import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import * as faceapi from "face-api.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcwIcon } from "lucide-react";
import axios from "./../../../plugin/axios";

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
  return expressions.happy > 0.7;
}

function isWithinRadiusAny(
  currentLat: number,
  currentLon: number,
  targetLocations: string[],
  radiusKm: number = 0.030
): { isNearby: boolean; distance: number; nearestLocation: string } {
  let minDistance = Infinity;
  let isNearAny = false;
  let nearestLocation = "";

  targetLocations.forEach((location) => {
    const [targetLat, targetLon] = location.split(",").map((coord) => parseFloat(coord.trim()));
    const distance = calculateDistance(currentLat, currentLon, targetLat, targetLon);
    if (distance <= radiusKm) isNearAny = true;
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

// Permission management utilities
const PermissionManager = {
  // Check if permissions were previously granted
  hasStoredPermission: (key: string): boolean => {
    return localStorage.getItem(key) === "true";
  },

  // Store permission status
  setPermissionStatus: (key: string, granted: boolean) => {
    localStorage.setItem(key, granted.toString());
  },

  // Check if user has been shown permission explanation
  hasShownExplanation: (): boolean => {
    return localStorage.getItem(PERMISSIONS_EXPLAINED_KEY) === "true";
  },

  // Mark that permission explanation has been shown
  setExplanationShown: () => {
    localStorage.setItem(PERMISSIONS_EXPLAINED_KEY, "true");
  },

  // Check browser permission API if available
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

function FaceRecMain({ userObject }: { userObject: any }) {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [faces, setFaces] = useState<any[]>([]);
  const [persons, setPersons] = useState<any[]>([]);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>(null);
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>(null);
  const [proximityStatus, setProximityStatus] = useState<string | null>(null);
  const [livelinessStatus, setLivelinessStatus] = useState<"pending" | "passed" | "failed">("pending");
  const [livelinessMessage, setLivelinessMessage] = useState<string>("Checking permissions...");
  const [status, setStatus] = useState("Loading...");
  const [camera, setCamera] = useState("user");
  const [name, setName] = useState<any[]>([]);
  const [permissionsInitialized, setPermissionsInitialized] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout>();
  const faceMatcher = useRef<faceapi.FaceMatcher | null>(null);
  const locationIntervalRef = useRef<NodeJS.Timeout>();

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
    
    // Check stored permissions first
    const hasStoredCamera = PermissionManager.hasStoredPermission(CAMERA_PERMISSION_KEY);
    const hasStoredLocation = PermissionManager.hasStoredPermission(LOCATION_PERMISSION_KEY);
    
    // Check browser permission API
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
    
    // Handle location permission
    if (hasStoredLocation && browserLocationPermission === 'granted') {
      setLocationStatus("ok");
    } else if (browserLocationPermission === 'denied') {
      setLocationStatus("permission_denied");
      PermissionManager.setPermissionStatus(LOCATION_PERMISSION_KEY, false);
    } else {
      await requestLocationPermission();
    }
    
    setPermissionsInitialized(true);
  }, []);

  // Request camera permission
  const requestCameraPermission = useCallback(async () => {
    setCameraStatus("checking");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: camera } 
      });
      
      // Permission granted
      setCameraStatus("ok");
      PermissionManager.setPermissionStatus(CAMERA_PERMISSION_KEY, true);
      
      // Stop the stream immediately as we'll start it properly later
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

  // Request location permission
  const requestLocationPermission = useCallback(async () => {
    setLocationStatus("checking");
    
    if (!navigator.geolocation) {
      setLocationStatus("error");
      setProximityStatus("❌ Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (_position) => {
        setLocationStatus("ok");
        PermissionManager.setPermissionStatus(LOCATION_PERMISSION_KEY, true);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setLocationStatus("permission_denied");
          PermissionManager.setPermissionStatus(LOCATION_PERMISSION_KEY, false);
          showLocationPermissionError();
        } else {
          setLocationStatus("error");
          console.error("Location access error:", error);
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
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
            <em>Or go to browser Settings > Privacy & Security > Site Settings > Location</em>
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
        requestLocationPermission();
      }
    });
  }, [requestLocationPermission]);

  // Enhanced location checking with permission handling
  const handleGetLocation = useCallback((locations: string[]) => {
    if (locationStatus !== "ok") {
      setProximityStatus("❌ Location permission required");
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
          setProximityStatus(
            isNearby
              ? `✅ Within office range! (${distance.toFixed(2)} km)`
              : `❌ Outside office range (${distance.toFixed(2)} km from nearest office)`
          );
          setLocationStatus(isNearby ? "ok" : "error");
        },
        (error) => {
          console.error("Location error:", error);
          setProximityStatus("❌ Location access failed");
          setLocationStatus("error");
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 }
      );
    };

    if (locationIntervalRef.current) clearInterval(locationIntervalRef.current);
    checkLocation();
    locationIntervalRef.current = setInterval(checkLocation, 10000);
  }, [locationStatus]);

  // Load face-api models
  const loadModels = useCallback(async () => {
    if (isModelsLoaded) return;
    try {
      setStatus("Loading models...");
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);
      setIsModelsLoaded(true);
    } catch (error) {
      setStatus("Error loading models");
    }
  }, [isModelsLoaded]);

  // Initialize face matcher
  const initializeFaceMatcher = useCallback(async () => {
    try {
      const labeledFaceDescriptors = await Promise.all(
        faces.map((label: any) => {
          const descriptions = label.descriptors.map((arr: number[]) => new Float32Array(arr));
          return new faceapi.LabeledFaceDescriptors(label.label, descriptions);
        })
      );
      faceMatcher.current = new faceapi.FaceMatcher(labeledFaceDescriptors);
    } catch (error) {
      console.error("Face matcher initialization error:", error);
    }
  }, [faces]);

  // Enhanced video start with permission handling
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

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: camera } 
      });
      
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

  // Face detection (unchanged)
  const startFaceDetection = useCallback(() => {
    if (!faceMatcher.current || !videoRef.current || !canvasRef.current || cameraStatus !== "ok") {
      return;
    }

    if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);
    
    const detectFaces = async () => {
      try {
        if (!videoRef.current || !canvasRef.current || !faceMatcher.current) return;
        
        const detections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
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
          setLivelinessMessage("No face detected");
          setName([]);
        }
      } catch (error) {
        console.error("Face detection error:", error);
      }
    };

    detectionIntervalRef.current = setInterval(detectFaces, 200);
  }, [cameraStatus]);

  // Fetch user face data
  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get("users/userDetails", {
        headers: { Authorization: `Token ${localStorage.getItem("accessToken")}` },
      });
      const data = response.data;
      localStorage.setItem("user", JSON.stringify(data));
      
      if (!data?.description) throw new Error("No face description data in API response");
      
      setFaces([{ label: data.full_name, descriptors: data.description }]);
      setPersons([{ id: data.full_name, name: data.full_name, position: data.job_title }]);
      setIsDataLoaded(true);
      
      if (data.location?.length > 0) {
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

  // Time action (unchanged)
  const handleTimeAction = useCallback((action: "in" | "out") => {
    const message = action === "in" ? "clocked in" : "clocked out";
    const currentTime = getCurrentISOTime();
    
    axios
      .post(
        "checkinoutregion/create/",
        {
          CHECKTIME: currentTime,
          CHECKTYPE: action === "in" ? "I" : "o",
          VERIFYCODE: userObject.deptid,
          SENSORID: userObject.deptid,
        },
        { headers: { Authorization: `Token ${localStorage.getItem("accessToken")}` } }
      )
      .then(() => {
        Swal.fire({
          title: "Success!",
          text: `You have successfully ${message}!`,
          icon: "success",
          confirmButtonColor: "#3085d6",
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.detail || "An error occurred while processing your request.",
          confirmButtonColor: "#d33",
        });
      });
  }, [userObject]);

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

  // Determine if actions are enabled
  const canPerformActions = livelinessStatus === "passed" && locationStatus === "ok" && cameraStatus === "ok";

  return (
    <div className="flex-1 h-full overflow-auto">
      <div className="flex-1 items-center mt-20 justify-between">
        <div>
          <p className="animate-pulse ml-4 text-2xl text-primary">
            Hello, {userObject.full_name}! 👋
          </p>
          <p className="ml-4 text-sm italic text-foreground">
            You are currently <span>{proximityStatus}</span>
          </p>
          
          {/* Permission status indicators */}
          <div className="ml-4 mt-2 flex gap-4 text-xs">
            <span className={`flex items-center gap-1 ${cameraStatus === "ok" ? "text-green-600" : cameraStatus === "permission_denied" ? "text-red-600" : "text-yellow-600"}`}>
              📷 Camera: {cameraStatus === "ok" ? "✅ Active" : cameraStatus === "permission_denied" ? "❌ Denied" : cameraStatus === "checking" ? "⏳ Checking..." : "⚠️ Error"}
            </span>
            <span className={`flex items-center gap-1 ${locationStatus === "ok" ? "text-green-600" : locationStatus === "permission_denied" ? "text-red-600" : "text-yellow-600"}`}>
              📍 Location: {locationStatus === "ok" ? "✅ Active" : locationStatus === "permission_denied" ? "❌ Denied" : locationStatus === "checking" ? "⏳ Checking..." : "⚠️ Error"}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center mt-2">
          <p className="text-2xl font-bold sm:text-base text-primary">Digital Biometric</p>
          <p className="text-secondary-foreground text-sm mt-2">
            Please Smile🙂 To enable the Clock In/Out Button
          </p>
          
          <div className="flex w-full justify-center mt-2">
            <div
              className={
                canPerformActions
                  ? "flex self-center w-[80%] sm:w-[90%] sm:h-[40vh] h-[50vh] bg-border border border-5 border-green-500 rounded-md"
                  : "flex self-center w-[80%] sm:w-[90%] sm:h-[40vh] h-[50vh] bg-border border rounded-md"
              }
            >
              <div className="flex flex-col gap-5 items-center justify-center h-full w-full relative">
                <div className="overflow-hidden w-full max-w-[500px] h-[500px] relative flex">
                  <div className="ml-2 mt-5 absolute gap-2 text-primary col-span-1 flex flex-col">
                    {name &&
                      name.map((response: any, key: any) => {
                        const matchedData = persons.find((item) => item.id === response._label);
                        return (
                          <div key={key} className="text-sm bg-card/50 backdrop-blur-md p-2 rounded-md">
                            <h3>{matchedData ? matchedData.name : "Unknown"}</h3>
                            <p>{matchedData ? matchedData.position : "Unrecognized Person"}</p>
                          </div>
                        );
                      })}
                  </div>
                  <video
                    crossOrigin="anonymous"
                    ref={videoRef}
                    className="w-full h-full rounded-md"
                    autoPlay
                    muted
                    playsInline
                  ></video>
                  <canvas ref={canvasRef} className="w-full h-full absolute" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative grid grid-cols-3 justify-center w-[80%] items-center h-full">
            <p className="relative bottom-0 left-0 p-4 z-[999] justify-start justify-self-start sm:text-sm text-secondary-foreground">
              Status: &nbsp;
              <span
                className={
                  status === "Running"
                    ? "justify-end justify-self-end z-[999] text-green-600"
                    : "text-red-500 justify-end z-[999] justify-self-end"
                }
              >
                {status}
              </span>
            </p>
            <RotateCcwIcon
              className={
                camera === "user"
                  ? "cursor-pointer m-5 text-foreground justify-center self-center justify-self-center rotate-180 transition-all duration-700 col-span-1"
                  : "justify-center self-center justify-self-center cursor-pointer m-5 text-foreground col-span-1 rotate-0 transition-all duration-700"
              }
              onClick={() => setCamera((prev) => (prev === "user" ? "environment" : "user"))}
            />
            <span
              className={
                livelinessStatus === "passed"
                  ? "text-green-600 sm:text-sm justify-self-end"
                  : "text-yellow-600 sm:text-sm justify-self-end"
              }
            >
              {livelinessMessage}
            </span>
          </div>
          
          <div className="mt-10 sm:mt-2 flex gap-6 justify-center">
            <Button
              className={
                canPerformActions
                  ? "bg-primary"
                  : "pointer-events-none bg-red-500/50"
              }
              onClick={() => handleTimeAction("in")}
              disabled={!canPerformActions}
            >
              Time In
            </Button>
            <Button
              className={
                canPerformActions
                  ? "bg-primary"
                  : "pointer-events-none bg-red-500/50"
              }
              onClick={() => handleTimeAction("out")}
              disabled={!canPerformActions}
            >
              Time Out
            </Button>
          </div>
          
          {/* Permission retry buttons */}
          {(cameraStatus === "permission_denied" || locationStatus === "permission_denied") && (
            <div className="mt-4 flex gap-4 justify-center">
              {cameraStatus === "permission_denied" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={requestCameraPermission}
                  className="text-xs"
                >
                  Enable Camera
                </Button>
              )}
              {locationStatus === "permission_denied" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={requestLocationPermission}
                  className="text-xs"
                >
                  Enable Location
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FaceRecMain; 