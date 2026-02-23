import Swal from "sweetalert2";
  import * as faceapi from "face-api.js";
  import { useCallback, useEffect, useRef, useState } from "react";
  import { RotateCcwIcon, Camera, MapPin } from "lucide-react";
  import axios from "./../../../plugin/axios";
  import { useNavigate } from "react-router-dom";

  type LocationStatus = "ok" | "error" | "permission_denied" | "checking" | null;
  type CameraStatus = "ok" | "error" | "permission_denied" | "checking" | null;

  // Permission storage keys
  const LOCATION_PERMISSION_KEY = "location_permission_granted";
  const CAMERA_PERMISSION_KEY = "camera_permission_granted";
  const PERMISSIONS_EXPLAINED_KEY = "permissions_explained";

  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function isSmiling(expressions: any) {
    return expressions.happy > 0.5;
  }

  // Browser/Device helpers
  const isMobileDevice = () =>
    typeof navigator !== "undefined" && /android|iphone|ipad|ipod|iemobile|mobile/i.test(navigator.userAgent);

  const isChromeBrowser = () =>
    typeof navigator !== "undefined" && /chrome|crios/i.test(navigator.userAgent) && !/edg|opr|brave|firefox/i.test(navigator.userAgent);

  // Adjust radius by +10 meters for Chrome to compensate observed gap
  const getEffectiveRadiusKm = (baseKm: number) => baseKm + (isChromeBrowser() ? 0.01 : 0);

  // Coarse device tier for adaptive tuning
  type DeviceTier = 'low' | 'mid' | 'high';
  const getDeviceTier = (): DeviceTier => {
    try {
      const mem = (navigator as any).deviceMemory ?? 4; // number of GB
      const cores = navigator.hardwareConcurrency ?? 4;
      const mobile = isMobileDevice();
      if (mobile && (mem <= 2 || cores <= 4)) return 'low';
      if (mem <= 2 || cores <= 2) return 'low';
      if (mem <= 4 || cores <= 4) return 'mid';
      return 'high';
    } catch {
      return 'mid';
    }
  };

  function isWithinRadiusAny(
    currentLat: number,
    currentLon: number,
    targetLocations: string[],
    radiusKm: number = 0.08
  ): { isNearby: boolean; distance: number; nearestLocation: string } {
    let minDistance = Infinity;
    let isNearAny = false;
    let nearestLocation = "";

    const effectiveRadiusKm = getEffectiveRadiusKm(radiusKm);

    targetLocations.forEach((location) => {
      const [targetLat, targetLon] = location.split(",").map((coord) => parseFloat(coord.trim()));
      const distance = calculateDistance(currentLat, currentLon, targetLat, targetLon);
      if (distance <= effectiveRadiusKm) isNearAny = true;
      if (distance < minDistance) {
        minDistance = distance;
        nearestLocation = location;
      }
    });

    return { isNearby: isNearAny, distance: minDistance, nearestLocation };
  }

  function getCurrentISOTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
  }

  // Performance optimization: Debounce utility
  function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
    let timeout: NodeJS.Timeout;
    return ((...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    }) as T;
  }

  // Performance optimization: Throttle utility
  function throttle<T extends (...args: any[]) => any>(func: T, limit: number): T {
    let inThrottle: boolean;
    return ((...args: any[]) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }) as T;
  }

  // Permission management utilities
  const PermissionManager = {
    hasStoredPermission: (key: string): boolean => {
      return localStorage.getItem(key) === "true";
    },
    setPermissionStatus: (key: string, granted: boolean) => {
      localStorage.setItem(key, granted.toString());
    },
    hasShownExplanation: (): boolean => {
      return localStorage.getItem(PERMISSIONS_EXPLAINED_KEY) === "true";
    },
    setExplanationShown: () => {
      localStorage.setItem(PERMISSIONS_EXPLAINED_KEY, "true");
    },
    checkBrowserPermission: async (name: PermissionName): Promise<PermissionState | null> => {
      try {
        if ('permissions' in navigator) {
          const permission = await navigator.permissions.query({ name });
          return permission.state;
        }
        return null;
      } catch (error) {
        console.warn(`Permission check failed for ${name}:`, error);
        return null;
      }
    }
  };

  const MODEL_URL = "/regional/models";

  // Optimized video constraints by device tier
  const getOptimizedVideoConstraints = (camera: string) => {
    const tier = getDeviceTier();
    let width: MediaTrackConstraints["width"] = { ideal: 640, max: 1280 };
    let height: MediaTrackConstraints["height"] = { ideal: 480, max: 720 };
    let frameRate: MediaTrackConstraints["frameRate"] = { ideal: 15, max: 30 };

    if (tier === 'low') {
      width = { ideal: 480, max: 640 };
      height = { ideal: 360, max: 480 };
      frameRate = { ideal: 12, max: 24 };
    } else if (tier === 'mid') {
      width = { ideal: 640, max: 960 };
      height = { ideal: 480, max: 540 };
      frameRate = { ideal: 15, max: 30 };
    } else {
      width = { ideal: 640, max: 1280 };
      height = { ideal: 480, max: 720 };
      frameRate = { ideal: 24, max: 30 };
    }

    return {
      video: {
        facingMode: camera,
        width,
        height,
        frameRate,
        aspectRatio: 1.333
      }
    } as MediaStreamConstraints;
  };

  function FaceRecMain({ userObject }: { userObject: any }) {
    const navigate = useNavigate();
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [isModelsLoaded, setIsModelsLoaded] = useState(false);
    const [faces, setFaces] = useState<any[]>([]);
    const [_persons, setPersons] = useState<any[]>([]);
    const [locationStatus, setLocationStatus] = useState<LocationStatus>(null);
    const [cameraStatus, setCameraStatus] = useState<CameraStatus>(null);
    const [proximityStatus, setProximityStatus] = useState<string | null>(null);
    const [livelinessStatus, setLivelinessStatus] = useState<"pending" | "passed" | "failed">("pending");
    const [livelinessMessage, setLivelinessMessage] = useState<string>("Checking permissions...");
    const [status, setStatus] = useState("Loading...");
    const [camera, setCamera] = useState("user");
    const [_name, setName] = useState<any[]>([]);
    const [permissionsInitialized, setPermissionsInitialized] = useState(false);
    const [floatingMenuShown, setFloatingMenuShown] = useState(false);

    // Add these refs to track stable location state
    const lastLocationStatusRef = useRef<boolean | null>(null); // true = nearby, false = outside, null = unknown
    const locationPermissionGrantedRef = useRef<boolean>(false);
    const officeLocationsRef = useRef<string[] | null>(null);
    const locationPromptShownRef = useRef<boolean>(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const detectionIntervalRef = useRef<NodeJS.Timeout>();
    const faceMatcher = useRef<faceapi.FaceMatcher | null>(null);
    const locationIntervalRef = useRef<NodeJS.Timeout>();
    const floatingMenuTimeoutRef = useRef<NodeJS.Timeout>();
    const animationFrameRef = useRef<number>();
    const menuCooldownUntilRef = useRef<number>(0);

    // Determine if actions are enabled
    const canPerformActions = livelinessStatus === "passed" && 
                            locationPermissionGrantedRef.current && 
                            cameraStatus === "ok" && 
                            lastLocationStatusRef.current === true; // Only allow if actually nearby

    // Floating menu handler
    const showFloatingMenu = useCallback(() => {
      // Prevent if already shown, during cooldown, or if any Swal is visible (e.g., success dialog)
      if (floatingMenuShown) return;
      if (Date.now() < menuCooldownUntilRef.current) return;
      try { if ((Swal as any).isVisible && Swal.isVisible()) return; } catch {}
      
      setFloatingMenuShown(true);
      
      Swal.fire({
    title: 'Biometric Actions',
    html: `
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; justify-content: center; margin-top: 1rem; max-width: 400px; margin-left: auto; margin-right: auto;">
        <button 
          id="time-in-btn" 
          style="
            background: linear-gradient(135deg, #2196F3, #1976D2);
            color: white;
            padding: 1rem;
            border: none;
            border-radius: 0.75rem;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
            font-size: 14px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          "
          onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.2)'"
          onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'"
        >
         🏢 Time In
        </button>
          <button 
          id="time-out-btn" 
          style="
            background: linear-gradient(135deg, #2196F3, #1976D2);
            color: white;
            padding: 1rem;
            border: none;
            border-radius: 0.75rem;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
            font-size: 14px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          "
          onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.2)'"
          onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'"
        >
          🌙 Time Out
        </button>
        <button 
          id="break-in-btn" 
          style="
            background: linear-gradient(135deg, #2196F3, #1976D2);
            color: white;
            padding: 1rem;
            border: none;
            border-radius: 0.75rem;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
            font-size: 14px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          "
          onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.2)'"
          onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'"
        >
          ☕ Break In
        </button>
        <button 
          id="break-out-btn" 
          style="
            background: linear-gradient(135deg, #2196F3, #1976D2);
            color: white;
            padding: 1rem;
            border: none;
            border-radius: 0.75rem;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
            font-size: 14px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          "
          onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.2)'"
          onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'"
        >
          🍽️ Break Out
        </button>
      
      </div>
    `,
    showConfirmButton: false,
    showCancelButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    position: 'center',
    toast: false,
    timer: 6000, // Increased time because there are more options
    timerProgressBar: true,
    width: '420px',
    background: '#fff',
    customClass: {
      popup: 'floating-menu-popup',
      timerProgressBar: 'floating-menu-timer'
    },
    didOpen: () => {
      document.getElementById('time-in-btn')?.addEventListener('click', () => {
        menuCooldownUntilRef.current = Date.now() + 3000;
        handleTimeAction('I');
        Swal.close();
      });
      
      document.getElementById('break-in-btn')?.addEventListener('click', () => {
        menuCooldownUntilRef.current = Date.now() + 3000;
        handleTimeAction('i');
        Swal.close();
      });

      document.getElementById('break-out-btn')?.addEventListener('click', () => {
        menuCooldownUntilRef.current = Date.now() + 3000;
        handleTimeAction('0');
        Swal.close();
      });
      
      document.getElementById('time-out-btn')?.addEventListener('click', () => {
        menuCooldownUntilRef.current = Date.now() + 3000;
        handleTimeAction('o');
        Swal.close();
      });
    },
    willClose: () => {
      // Ensure cooldown after any close path
      menuCooldownUntilRef.current = Math.max(menuCooldownUntilRef.current, Date.now() + 3000);
      setFloatingMenuShown(false);
    }
  });

      // Auto-hide after 4 seconds
      floatingMenuTimeoutRef.current = setTimeout(() => {
        Swal.close();
        setFloatingMenuShown(false);
      }, 4000);
    }, [floatingMenuShown]);

    // Show floating menu when canPerformActions becomes true
    useEffect(() => {
      if (
        canPerformActions &&
        !floatingMenuShown &&
        Date.now() >= menuCooldownUntilRef.current &&
        // avoid showing while another Swal is on screen
        (!(Swal as any).isVisible || !Swal.isVisible())
      ) {
        showFloatingMenu();
      }
      
      return () => {
        if (floatingMenuTimeoutRef.current) {
          clearTimeout(floatingMenuTimeoutRef.current);
        }
      };
    }, [canPerformActions, floatingMenuShown, showFloatingMenu]);

    // Show initial permission explanation
    const showPermissionExplanation = useCallback(() => {
      if (!PermissionManager.hasShownExplanation()) {
        Swal.fire({
          title: 'Permission Setup Required',
          html: `
            <div style="text-align: left; margin: 20px 0;">
              <p><strong>This app requires two permissions to function:</strong></p>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li><strong>Camera Access:</strong> For facial recognition and biometric verification</li>
                <li><strong>Location Access:</strong> To verify you're within the office premises</li>
              </ul>
              <p style="margin-top: 15px; font-size: 14px; color: #666;">
                <em>Note: These permissions are required for security and will be requested once. 
                You can manage them in your browser settings later.</em>
              </p>
            </div>
          `,
          icon: 'info',
          confirmButtonText: 'Grant Permissions',
          confirmButtonColor: '#3085d6',
          allowOutsideClick: false,
          allowEscapeKey: false
        }).then(() => {
          PermissionManager.setExplanationShown();
          initializePermissions();
        });
      } else {
        initializePermissions();
      }
    }, []);

    // Initialize permissions
    const initializePermissions = useCallback(async () => {
      setStatus("Checking permissions...");
      
      const hasStoredCamera = PermissionManager.hasStoredPermission(CAMERA_PERMISSION_KEY);
      const hasStoredLocation = PermissionManager.hasStoredPermission(LOCATION_PERMISSION_KEY);
      
      const browserCameraPermission = await PermissionManager.checkBrowserPermission('camera' as PermissionName);
      const browserLocationPermission = await PermissionManager.checkBrowserPermission('geolocation' as PermissionName);
      
      // Handle camera permission
      if (hasStoredCamera && browserCameraPermission === 'granted') {
        setCameraStatus("ok");
      } else if (browserCameraPermission === 'denied') {
        setCameraStatus("permission_denied");
        PermissionManager.setPermissionStatus(CAMERA_PERMISSION_KEY, false);
      } else {
        await requestCameraPermission();
      }
      
      // Handle location permission with enhanced tracking
      if (hasStoredLocation && browserLocationPermission === 'granted') {
        setLocationStatus("ok");
        locationPermissionGrantedRef.current = true;
      } else if (browserLocationPermission === 'denied') {
        setLocationStatus("permission_denied");
        locationPermissionGrantedRef.current = false;
        PermissionManager.setPermissionStatus(LOCATION_PERMISSION_KEY, false);
      } else {
        await requestLocationPermission();
      }
      
      setPermissionsInitialized(true);
    }, []);

    // Request camera permission with optimized constraints
    const requestCameraPermission = useCallback(async () => {
      setCameraStatus("checking");
      try {
        const constraints = getOptimizedVideoConstraints(camera);
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        setCameraStatus("ok");
        PermissionManager.setPermissionStatus(CAMERA_PERMISSION_KEY, true);
        
        stream.getTracks().forEach(track => track.stop());
        
      } catch (error: any) {
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          setCameraStatus("permission_denied");
          PermissionManager.setPermissionStatus(CAMERA_PERMISSION_KEY, false);
          showCameraPermissionError();
        } else {
          setCameraStatus("error");
          console.error("Camera access error:", error);
        }
      }
    }, [camera]);

    // Helper: open browser site settings for this origin, then prompt reload
    const openSiteSettings = useCallback(() => {
      const origin = window.location.origin;
      const ua = navigator.userAgent.toLowerCase();
      const isEdge = ua.includes('edg');
      const isFirefox = ua.includes('firefox');
      const isMobile = /android|iphone|ipad|ipod/i.test(ua);
      const isChromeDesktop = (ua.includes('chrome') || ua.includes('crios')) && !isEdge && !ua.includes('opr');

      let url: string | null = null;
      if (!isMobile && (isChromeDesktop || isEdge)) {
        const proto = isEdge ? 'edge' : 'chrome';
        url = `${proto}://settings/content/siteDetails?site=${encodeURIComponent(origin)}`;
      } else if (!isMobile && isFirefox) {
        url = 'about:preferences#privacy';
      }
      if (url) {
        try { window.open(url, '_blank'); } catch {}
      }
      const mobileInstructions = isMobile
        ? `<ol style="text-align:left; padding-left: 20px;">
            <li>Tap the lock icon in the address bar</li>
            <li>Permissions ➜ Location</li>
            <li>Choose "Allow while using"</li>
          </ol>`
        : `<p>In Site Settings, set Location to <strong>Allow</strong> for ${origin}, then return here.</p>`;
      Swal.fire({
        icon: 'info',
        title: 'Enable location for this site',
        html: mobileInstructions,
        confirmButtonText: 'Reload Page',
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => window.location.reload());
    }, []);

    // Enhanced location permission request
    const requestLocationPermission = useCallback(async (): Promise<"granted" | "denied" | "error"> => {
      setLocationStatus("checking");
      
      if (!navigator.geolocation) {
        setLocationStatus("error");
        setProximityStatus("❌ Geolocation not supported");
        locationPermissionGrantedRef.current = false;
        return "error";
      }
      
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (_position) => {
            setLocationStatus("ok");
            locationPermissionGrantedRef.current = true;
            PermissionManager.setPermissionStatus(LOCATION_PERMISSION_KEY, true);
            resolve("granted");
          },
          (error) => {
            if (error.code === error.PERMISSION_DENIED) {
              setLocationStatus("permission_denied");
              locationPermissionGrantedRef.current = false;
              PermissionManager.setPermissionStatus(LOCATION_PERMISSION_KEY, false);
              showLocationPermissionError();
              resolve("denied");
            } else {
              setLocationStatus("error");
              locationPermissionGrantedRef.current = false;
              console.error("Location access error:", error);
              resolve("error");
            }
          },
          { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }
        );
      });
    }, []);

    // Show camera permission error
    const showCameraPermissionError = useCallback(() => {
      Swal.fire({
        title: 'Camera Permission Required',
        html: `
          <div style="text-align: left; margin: 20px 0;">
            <p>Camera access is required for facial recognition. To enable:</p>
            <ol style="margin: 10px 0; padding-left: 20px;">
              <li>Click the camera icon in your browser's address bar</li>
              <li>Select "Allow" for camera access</li>
              <li>Refresh the page</li>
            </ol>
            <p style="margin-top: 15px; font-size: 14px; color: #666;">
              <em>Or go to browser Settings > Privacy & Security > Site Settings > Camera</em>
            </p>
          </div>
        `,
        icon: 'warning',
        confirmButtonText: 'Try Again',
        showCancelButton: true,
        cancelButtonText: 'Skip',
        confirmButtonColor: '#3085d6'
      }).then((result) => {
        if (result.isConfirmed) {
          requestCameraPermission();
        }
      });
    }, [requestCameraPermission]);

    // Show location permission error
    const showLocationPermissionError = useCallback(() => {
      Swal.fire({
        title: 'Location Permission Required',
        html: `
          <div style="text-align: left; margin: 20px 0;">
            <p>Location access is required to verify office proximity. To enable:</p>
            <ol style="margin: 10px 0; padding-left: 20px;">
              <li>Click the location icon in your browser's address bar</li>
              <li>Select "Allow" for location access</li>
              <li>Refresh the page</li>
            </ol>
            <p style="margin-top: 15px; font-size: 14px; color: #666;">
              <em>Or use the button below to open your browser's site settings.</em>
            </p>
          </div>
        `,
        icon: 'warning',
        confirmButtonText: 'Grant Location Access',
        showCancelButton: false, // remove Skip
        confirmButtonColor: '#3085d6'
      }).then((result) => {
        if (result.isConfirmed) {
          // If permission is denied at browser level, open settings; otherwise prompt and then reload
          PermissionManager.checkBrowserPermission('geolocation' as PermissionName)
            .then((state) => {
              if (state === 'denied') {
                openSiteSettings();
              } else {
                requestLocationPermission().finally(() => window.location.reload());
              }
            })
            .catch(() => requestLocationPermission().finally(() => window.location.reload()));
        } else if (result.isDenied) {
          openSiteSettings();
        }
      });
    }, [requestLocationPermission, openSiteSettings]);

    // Enhanced location checking with stable status tracking
    const handleGetLocation = useCallback(throttle((locations: string[]) => {
      // Remember office locations so we can retry automatically once permission is granted
      officeLocationsRef.current = locations;

      // If location permission was never granted, don't try to check
      if (!locationPermissionGrantedRef.current) {
        setProximityStatus("❌ Location permission required");
        setLocationStatus("permission_denied");
        return;
      }

      const checkLocation = () => {
        if (!navigator.geolocation) {
          setProximityStatus("❌ Geolocation not supported");
          setLocationStatus("error");
          return;
        }

    navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const { isNearby, distance } = isWithinRadiusAny(latitude, longitude, locations);
            
            // Update the last known location status
            lastLocationStatusRef.current = isNearby;
            
            // Create the status message
            const newProximityStatus = isNearby
              ? `✅ Within office range! (${distance.toFixed(2)} km)`
              : `❌ Outside office range (${distance.toFixed(2)} km from nearest office)`;
            
            // Always update proximity status since location is working
            setProximityStatus(newProximityStatus);
            setLocationStatus(isNearby ? "ok" : "ok"); // Keep status as "ok" even if outside range
          },
          (error) => {
            console.error("Location error:", error);
            
            // Use the last known location status to maintain stability
            if (lastLocationStatusRef.current !== null) {
              // Keep the last known status instead of showing error
              const lastKnownStatus = lastLocationStatusRef.current
                ? "✅ Within office range! (checking...)"
                : "❌ Outside office range (checking...)";
              
              setProximityStatus(prevStatus => {
                // Only update if we don't have a valid previous status
                if (!prevStatus || prevStatus.includes("Location permission required") || prevStatus.includes("Location access failed")) {
                  return lastKnownStatus;
                }
                return prevStatus; // Keep existing status
              });
            } else {
              // If we have never successfully gotten location, show error
              setProximityStatus("❌ Location access failed");
              setLocationStatus("error");
            }
          },
          {
            // Prefer high accuracy on mobile/Chrome for tighter readings
            enableHighAccuracy: isMobileDevice() || isChromeBrowser(),
            timeout: isMobileDevice() ? 20000 : 10000,
            maximumAge: 0 // Force fresh read to avoid stale/delayed location
          }
        );
      };

      if (locationIntervalRef.current) clearInterval(locationIntervalRef.current);
      checkLocation();
      locationIntervalRef.current = setInterval(checkLocation, 45000);
    }, 15000), []); // Increased throttle to 15 seconds

    // Optimized model loading with lazy loading
    const loadModels = useCallback(async () => {
      if (isModelsLoaded) return;
      try {
        setStatus("Loading models...");

        // Prefer WebGL backend when available for faster inference
        try {
          const tf = (faceapi as any).tf;
          if (tf?.setBackend) {
            await tf.setBackend('webgl');
            if (tf?.ready) await tf.ready();
          }
        } catch {}

        // Load only essential models for better performance
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);

        // Warm-up pass to compile kernels and avoid first-frame jank
        try {
          const warmupCanvas = document.createElement('canvas');
          warmupCanvas.width = 128; warmupCanvas.height = 128;
          const ctx = warmupCanvas.getContext('2d');
          ctx?.fillRect(0, 0, 1, 1);
          await faceapi
            .detectAllFaces(
              warmupCanvas,
              new faceapi.TinyFaceDetectorOptions({ inputSize: 160, scoreThreshold: 0.9 })
            )
            .withFaceLandmarks(true)
            .withFaceDescriptors()
            .withFaceExpressions();
        } catch {}
        setIsModelsLoaded(true);
      } catch (error) {
        setStatus("Error loading models");
      }
    }, [isModelsLoaded]);

    // Optimized face matcher initialization
    const initializeFaceMatcher = useCallback(async () => {
      try {
        const labeledFaceDescriptors = await Promise.all(
          faces.map((label: any) => {
            const descriptions = label.descriptors.map((arr: number[]) => new Float32Array(arr));
            return new faceapi.LabeledFaceDescriptors(label.label, descriptions);
          })
        );
        faceMatcher.current = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6); // Adjust threshold for better performance
      } catch (error) {
        console.error("Face matcher initialization error:", error);
      }
    }, [faces]);

    // Optimized video start
    const startVideo = useCallback(async () => {
      if (cameraStatus !== "ok") {
        setLivelinessMessage("Camera permission required");
        return;
      }

      try {
        if (videoRef.current?.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach((track) => track.stop());
          videoRef.current.srcObject = null;
        }

        const constraints = getOptimizedVideoConstraints(camera);
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setLivelinessMessage("Please smile to verify liveliness");
          };
        }
      } catch (error) {
        console.error("Error starting video:", error);
        setStatus("Error accessing camera");
        setCameraStatus("error");
      }
    }, [camera, cameraStatus]);

    // Optimized face detection with requestAnimationFrame
    const startFaceDetection = useCallback(() => {
      if (!faceMatcher.current || !videoRef.current || !canvasRef.current || cameraStatus !== "ok") {
        return;
      }

      if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);

      const tier = getDeviceTier();
      const inputSize = tier === 'low' ? 224 : tier === 'mid' ? 320 : 416;
      const intervalMs = tier === 'low' ? 700 : tier === 'mid' ? 500 : 350;

      const detectFaces = async () => {
        try {
          if (!videoRef.current || !canvasRef.current || !faceMatcher.current) return;

          const detections = await faceapi
            .detectAllFaces(
              videoRef.current,
              new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold: 0.6 })
            )
            .withFaceLandmarks(true) // Use tiny landmarks
            .withFaceDescriptors()
            .withFaceExpressions();

          const canvas = canvasRef.current;
          const displaySize = { width: 500, height: 600 };
          faceapi.matchDimensions(canvas, displaySize);
          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          const ctx = canvas.getContext("2d", { willReadFrequently: true });
          if (ctx) ctx.clearRect(0, 0, displaySize.width, displaySize.height);

          if (resizedDetections.length > 0) {
            const results = resizedDetections.map((d: any) => faceMatcher.current!.findBestMatch(d.descriptor));
            faceapi.draw.drawDetections(canvas, resizedDetections);
            results.forEach((result: any, i: number) => {
              const box = resizedDetections[i].detection.box;
              new faceapi.draw.DrawBox(box, { label: result.toString() }).draw(canvas);
            });

            const detection = resizedDetections[0];
            const expressions = detection.expressions;
            const bestMatch = results[0];
            const isRecognized = bestMatch && bestMatch.label !== "unknown";
            const smiling = isSmiling(expressions);

            if (isRecognized && smiling) {
              setLivelinessStatus("passed");
              setLivelinessMessage("Nice Smile!😉");
            } else if (isRecognized && !smiling) {
              setLivelinessStatus("pending");
              setLivelinessMessage("Please smile.");
            } else {
              setLivelinessStatus("pending");
              setLivelinessMessage("Face not recognized.");
            }

            setName(results);
            setStatus("Running");
          } else {
            setLivelinessStatus("pending");
            setStatus("Running");
            setLivelinessMessage("No face detected");
            setName([]);
          }
        } catch (error) {
          console.error("Face detection error:", error);
        }
      };

    // Adaptive interval by device tier
    detectionIntervalRef.current = setInterval(detectFaces, intervalMs);
    }, [cameraStatus]);

    // Fetch user face data
    const fetchData = useCallback(async () => {
      try {
        const response = await axios.get("users/userDetails", {
          headers: { Authorization: `Token ${localStorage.getItem("accessToken")}` },
        });
        const data = response.data;

        localStorage.setItem("user", JSON.stringify(data))
        
        // Store user data in memory instead of localStorage for better performance
        if (!data?.description) throw new Error("No face description data in API response");
        
        setFaces([{ label: data.full_name, descriptors: data.description }]);
        setPersons([{ id: data.full_name, name: data.full_name, position: data.job_title }]);
        setIsDataLoaded(true);
        
        if (data.location?.length > 0) {
          officeLocationsRef.current = data.location;
          handleGetLocation(data.location);
        } else {
          setProximityStatus("❌ No office locations configured");
          setLocationStatus("error");
        }
      } catch (error: any) {
        setStatus(error.message || "Error loading face data");
        setLocationStatus("error");
      }
    }, [handleGetLocation]);

    // Time action message mapping
    const timeActionMessages = {
      'I': { message: 'clocked in', emoji: '🌅' },
      'i': { message: 'started break', emoji: '☕' },
      '0': { message: 'ended break', emoji: '🍽️' },
      'o': { message: 'clocked out', emoji: '🌙' }
    };

    // Optimized time action
    const handleTimeAction = useCallback(debounce((action: "I" | "i" | "0" | "o") => {
      const { message, emoji } = timeActionMessages[action];
      const currentTime = getCurrentISOTime();
      
      axios
        .post(
          "checkinoutregion/create/",
          {
            CHECKTIME: currentTime,
            CHECKTYPE: action,
            VERIFYCODE: userObject.deptid,
            SENSORID: 0,
          },
          { headers: { Authorization: `Token ${localStorage.getItem("accessToken")}` } }
        )
        .then(() => {
          const successMessages = {
            'I': "Have a great day at work! 💼",
            'i': "Enjoy your break! ☕",
            '0': "Welcome back! 🔋",
            'o': "See you tomorrow! 🌙"
          };

          Swal.fire({
            title: `${emoji} Success! ${emoji}`,
            html: `
              <div style="text-align: center; margin: 20px 0;">
                <p style="font-size: 18px; margin-bottom: 15px;">
                  You have successfully ${message}! 
                </p>
                <p style="font-size: 16px; color: #10b981; margin-bottom: 10px;">
                  😊 Nice smile, by the way! 😊
                </p>
                <p style="font-size: 14px; color: #666; font-style: italic;">
                  ${successMessages[action]}
                </p>
              </div>
            `,
            icon: "success",
            confirmButtonColor: "#3085d6",
            timer: 3000, // Increased timer to give time to read the nice message
            showConfirmButton: false,
            customClass: {
              popup: 'success-popup',
              title: 'success-title'
            }
          });
          setTimeout(()=>{
            navigate("/regional/user/home");     
            window.location.reload();
          }, 3000) // Adjusted timeout to match the new timer
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "❌ Oops! Something went wrong",
            html: `
              <div style="text-align: center; margin: 20px 0;">
                <p style="font-size: 16px; margin-bottom: 10px;">
                  ${error.response?.data?.detail || "An error occurred while processing your request."}
                </p>
                <p style="font-size: 14px; color: #666; font-style: italic;">
                  😔 Don't worry, please try again!
                </p>
              </div>
            `,
            confirmButtonColor: "#d33",
            confirmButtonText: "Try Again 🔄"
          });
        });
    }, 1000), [userObject, navigate]);

    // Initialize permissions and fetch data on mount
    useEffect(() => {
      fetchData();
      showPermissionExplanation();
      
      return () => {
        if (videoRef.current?.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach((track) => track.stop());
          videoRef.current.srcObject = null;
        }
        if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);
        if (locationIntervalRef.current) clearInterval(locationIntervalRef.current);
        if (floatingMenuTimeoutRef.current) clearTimeout(floatingMenuTimeoutRef.current);
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext("2d", { willReadFrequently: true });
          if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
        setStatus("Stopped");
      };
    }, [fetchData, showPermissionExplanation]);

    // Load models
    useEffect(() => {
      if (!isModelsLoaded) {
        loadModels();
      }
    }, [isModelsLoaded, loadModels]);

    // Start video and detection when everything is ready
    useEffect(() => {
      if (isModelsLoaded && isDataLoaded && faces.length > 0 && permissionsInitialized && cameraStatus === "ok") {
        (async () => {
          await initializeFaceMatcher();
          await startVideo();
          startFaceDetection();
        })();
      }
      
      return () => {
        if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);
      };
    }, [isModelsLoaded, isDataLoaded, faces.length, permissionsInitialized, cameraStatus, camera, initializeFaceMatcher, startVideo, startFaceDetection]);

    // Auto-show location permission prompt when denied or required
    useEffect(() => {
      const shouldPrompt =
        locationStatus === "permission_denied" ||
        (proximityStatus && proximityStatus.includes("Location permission required"));
      if (shouldPrompt && !locationPromptShownRef.current) {
        locationPromptShownRef.current = true;
        showLocationPermissionError();
      }
      if (locationStatus === "ok") {
        // Reset so we can prompt again later if it becomes denied
        locationPromptShownRef.current = false;
      }
    }, [locationStatus, proximityStatus, showLocationPermissionError]);
    
    // Listen for browser permission changes and refresh location automatically
    useEffect(() => {
      let perm: PermissionStatus | null = null;
      const setup = async () => {
        try {
          // Some browsers may throw if Permissions API not fully supported
          // @ts-ignore
          const p = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
          perm = p;
          const onChange = () => {
            if (p.state === 'granted') {
              setLocationStatus('ok');
              locationPermissionGrantedRef.current = true;
              if (officeLocationsRef.current) {
                handleGetLocation(officeLocationsRef.current);
              }
            } else if (p.state === 'denied') {
              setLocationStatus('permission_denied');
              locationPermissionGrantedRef.current = false;
            }
          };
          p.onchange = onChange;
        } catch {
          // Silently ignore if not supported
        }
      };
      setup();
      return () => {
        if (perm) {
          // @ts-ignore
          perm.onchange = null;
        }
      };
    }, [handleGetLocation]);

    return (
      <div className="flex-1 h-full overflow-auto bg-background">
        <style>{`
          @keyframes pulse-ring {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            100% {
              transform: scale(1.4);
              opacity: 0;
            }
          }
          @keyframes pulse-ring-alt {
            0% {
              transform: scale(1);
              opacity: 0.8;
            }
            100% {
              transform: scale(1.5);
              opacity: 0;
            }
          }
          .pulse-ring {
            animation: pulse-ring 2s ease-out infinite;
          }
          .pulse-ring-alt {
            animation: pulse-ring-alt 2.5s ease-out infinite;
            animation-delay: 0.3s;
          }
          .pulse-ring-slow {
            animation: pulse-ring 3s ease-out infinite;
            animation-delay: 0.6s;
          }
        `}</style>
        <div className="flex-1 flex flex-col items-center justify-center min-h-screen p-6">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-3xl font-bold text-primary mb-2">
              🔐 Digital Biometric
            </h1>
            <p className="text-secondary-foreground text-lg">
              Welcome back, <span className="font-semibold text-primary">{userObject.full_name}</span>
            </p>
            <p className="text-sm text-secondary-foreground mt-2">
              {proximityStatus}
            </p>
          </div>

          {/* Main Content */}
          <div className="flex w-full justify-center px-4">
            <div className="flex flex-col items-center gap-6">
              {/* Circular face detection area */}
              <div className="relative flex items-center justify-center">
                {/* Animated rings wrapper */}
                <div className="absolute w-[350px] h-[350px] sm:w-[240px] sm:h-[240px] pointer-events-none rounded-full ">
                  {/* Ring 1 */}
                  <div
                    className={`absolute inset-0 rounded-full pulse-ring ${
                      livelinessMessage === "Nice Smile!😉"
                        ? "ring-2 ring-blue-400"
                        : livelinessMessage === "Please smile."
                        ? "ring-2 ring-green-500"
                        : livelinessMessage === "Face not recognized."
                        ? "ring-2 ring-red-500"
                        : livelinessMessage === "No face detected"
                        ? "ring-2 ring-red-500/80"
                        : "ring-2 ring-gray-400/30"
                    }`}
                  ></div>
                  
                  {/* Ring 2 */}
                  <div
                    className={`absolute inset-0 rounded-full pulse-ring-alt ${
                      livelinessMessage === "Nice Smile!😉"
                        ? "ring-2 ring-blue-400"
                        : livelinessMessage === "Please smile."
                        ? "ring-2 ring-green-300/70"
                        : livelinessMessage === "Face not recognized."
                        ? "ring-2 ring-yellow-400/70"
                        : livelinessMessage === "No face detected"
                        ? "ring-2 ring-red-400/30"
                        : "ring-2 ring-gray-300/20"
                    }`}
                  ></div>
                  
                  {/* Ring 3 */}
                  <div
                    className={`absolute inset-0 rounded-full pulse-ring-slow ${
                      livelinessMessage === "Nice Smile!😉"
                        ? "ring-2 ring-blue-300"
                        : livelinessMessage === "Please smile."
                        ? "ring-2 ring-green-300/40"
                        : livelinessMessage === "Face not recognized."
                        ? "ring-2 ring-yellow-300/40"
                        : livelinessMessage === "No face detected"
                        ? "ring-2 ring-red-400/20"
                        : "ring-2 ring-gray-300/10"
                    }`}
                  ></div>
                </div>

                {/* Main face circle */}
                <div
                  className={`flex items-center justify-center w-[400px] h-[400px] sm:w-80 sm:h-80 rounded-full overflow-hidden transition-all duration-300 ${
                    livelinessMessage === "Nice Smile!😉"
                      ? "ring-4 ring-blue-500 ring-offset-2 shadow-lg shadow-blue-500/50"
                      : livelinessMessage === "Please smile."
                      ? "ring-4 ring-green-400 ring-offset-2 shadow-lg shadow-green-500/50"
                      : livelinessMessage === "Face not recognized."
                      ? "ring-4 ring-yellow-500 ring-offset-2 shadow-lg shadow-yellow-500/50"
                      : livelinessMessage === "No face detected"
                      ? "ring-4 ring-red-400 ring-offset-2 shadow-lg shadow-red-500/40"
                      : "ring-4 ring-gray-400 ring-offset-2"
                  } bg-gradient-to-br from-slate-900 to-slate-800`}
                >
                  {/* Face name/position overlay */}
                  {/* <div className="absolute top-4 left-4 right-4 z-10 gap-2 text-primary flex flex-col pointer-events-none">
                    {name &&
                      name.map((response: any, key: any) => {
                        const matchedData = persons.find((item) => item.id === response._label);
                        return (
                          <div key={key} className="text-sm bg-slate-900 p-2 rounded-lg border border-slate-700">
                            <h3 className="font-semibold">{matchedData ? matchedData.name : "Unknown"}</h3>
                            <p className="text-xs text-gray-300">{matchedData ? matchedData.position : "Unrecognized"}</p>
                          </div>
                        );
                      })}
                  </div> */}

                  {/* Video and canvas */}
                  <video
                    crossOrigin="anonymous"
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    playsInline
                  ></video>
                  <canvas ref={canvasRef} className="w-full h-full absolute inset-0" />
                </div>

                {/* Status badge */}
                <div className="absolute flex justify-center translate-y-[190px] sm:translate-y-[140px] w-full ">
                  <span
                    className={`px-4 py-2 backdrop-blur-sm rounded-full text-sm sm:text-xs font-medium transition-all ${
                      livelinessStatus === "passed"
                        ? "bg-blue-500/60 text-green-50 border "
                        : "bg-green-500/60  text-yellow-50 border "
                    }`}
                  >
                    {livelinessMessage}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Section */}
          <div className="relative grid grid-cols-3 justify-center w-full mt-20 px-4 gap-4">
            <div className="flex flex-col gap-2 justify-start max-w-60">
              <p className="text-xs font-semibold text-secondary-foreground uppercase tracking-wide">Status</p>
              <span
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                  status === "Running"
                    ? "bg-green-600 text-green-50 border border-green-500"
                    : "bg-red-600 text-red-50 border border-red-500"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                {status}
              </span>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setCamera((prev) => (prev === "user" ? "environment" : "user"))}
                className="group relative p-3 rounded-full bg-primary hover:bg-primary/90 text-white border border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/50"
                title="Switch camera"
              >
                <RotateCcwIcon
                  className={`w-5 h-5 text-white transition-transform duration-500 ${
                    camera === "user" ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex flex-col gap-2 justify-end text-right">
              <p className="text-xs font-semibold text-secondary-foreground uppercase tracking-wide">Permissions</p>
              <div className="flex gap-3 justify-end">
                {/* Camera Permission */}
                <button
                  onClick={() => {
                    if (cameraStatus !== "ok") {
                      requestCameraPermission();
                    }
                  }}
                  className="flex items-center gap-1 px-2 py-1 rounded transition-all hover:bg-white/10 cursor-pointer group"
                  title={cameraStatus === "ok" ? "Camera enabled" : "Click to enable camera"}
                >
                  <Camera className={`w-4 h-4 transition-all ${cameraStatus === "ok" ? "text-green-500" : "text-red-500 group-hover:scale-110"}`} />
                  <span className={`w-2 h-2 rounded-full transition-all ${cameraStatus === "ok" ? "bg-green-500" : "bg-red-500 group-hover:scale-125"}`}></span>
                </button>
                
                {/* Location Permission */}
                <button
                  onClick={() => {
                    if (locationStatus !== "ok") {
                      requestLocationPermission();
                    }
                  }}
                  className="flex items-center gap-1 px-2 py-1 rounded transition-all hover:bg-white/10 cursor-pointer group"
                  title={locationStatus === "ok" ? "Location enabled" : "Click to enable location"}
                >
                  <MapPin className={`w-4 h-4 transition-all ${locationStatus === "ok" ? "text-green-500" : "text-red-500 group-hover:scale-110"}`} />
                  <span className={`w-2 h-2 rounded-full transition-all ${locationStatus === "ok" ? "bg-green-500" : "bg-red-500 group-hover:scale-125"}`}></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  export default FaceRecMain;