import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import * as faceapi from "face-api.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcwIcon } from "lucide-react";
import axios from "./../../../plugin/axios";

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  // Haversine formula
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers

  return distance;
}

function isWithinRadius(
  currentLat: number,
  currentLon: number,
  targetLat: number,
  targetLon: number,
  radiusKm: number = 0.15
): { isNearby: boolean; distance: number } {
  const distance = calculateDistance(
    currentLat,
    currentLon,
    targetLat,
    targetLon
  );
  return {
    isNearby: distance <= radiusKm,
    distance: distance,
  };
}

function isSmiling(expressions: any) {
  return expressions.happy > 0.7;
}

function FaceRec() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
 
  const [faces, setFaces] = useState<any[]>([]);

  // Memoize user data to avoid repeated parsing
  const userObject = useRef(
    (() => {
      const userJson = localStorage.getItem("user");
      return userJson ? JSON.parse(userJson) : null;
    })()
  );

  const fullName = userObject.current?.full_name;
  const [locationStatus, setLocationStatus] = useState<any>(null);
  const [proximityStatus, setProximityStatus] = useState<string | null>(null);
  const [livelinessStatus, setLivelinessStatus] = useState<
    "pending" | "passed" | "failed"
  >("pending");
  const [livelinessMessage, setLivelinessMessage] = useState<string>(
    "Please blink or smile to verify liveliness"
  );

  const [status, setStatus] = useState("Loading...");
  const MODEL_URL = "/regional/models";
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [camera, setCamera] = useState("environment");
  const [name, setName] = useState<any[]>([]);
  const [persons, setPersons] = useState([
    {
      id: "",
      name: "",
      position: "",
    },
  ]);

  const requestAnimationFrameId = useRef<number>();
  const detectionIntervalRef = useRef<NodeJS.Timeout>();
  const faceMatcher = useRef<faceapi.FaceMatcher | null>(null);

  // Optimized coordinate parsing with memoization
  const getCoordinates = useCallback((locationArray: any[]) => {
    if (!locationArray || locationArray.length === 0) return null;

    const [coordinates] = locationArray;
    const [latitude, longitude] = coordinates.split(",").map(Number);

    return {
      latitude: parseFloat(latitude.toFixed(6)),
      longitude: parseFloat(longitude.toFixed(6)),
    };
  }, []);

  // Debounced location handler
  const handleGetLocation = useCallback((data1: any, data2: any) => {
    if (!navigator.geolocation) {
      setProximityStatus(null);
      Swal.fire({
        icon: "error",
        title: "Geolocation Not Supported",
        text: "Your browser does not support geolocation.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const { isNearby, distance } = isWithinRadius(
          latitude,
          longitude,
          data1,
          data2
        );

        if (isNearby) {
          setProximityStatus(
            `✅ Within office range! (${distance.toFixed(2)} km)`
          );
          setLocationStatus("ok");
        } else {
          setProximityStatus(
            `❌ Outside office range (${distance.toFixed(2)} km from office)`
          );
          setLocationStatus(false);
        }
      },
      (error) => {
        setProximityStatus(null);

        const errorMessages = {
          [error.PERMISSION_DENIED]:
            "Please enable location access in your browser settings. Or browse to you destop settings and enable location access.",
          [error.POSITION_UNAVAILABLE]: "Location information is unavailable.",
          [error.TIMEOUT]: "Location request timed out.",
        };

        const errorMessage =
          errorMessages[error.code as keyof typeof errorMessages] ||
          "An unknown error occurred.";

        Swal.fire({
          icon: "error",
          title: "Location Error",
          text: errorMessage,
          confirmButtonColor: "#3085d6",
        });
      }
    );
  }, []);

  // Optimized model loading with better error handling
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
      console.log("Face models loaded successfully");

      if (isDataLoaded && faces.length > 0) {
        await initializeFaceMatcher();
        startFaceDetection();
      }
    } catch (error) {
      console.error("Error loading face models:", error);
      setStatus("Error loading models");
    }
  }, [isModelsLoaded, isDataLoaded, faces.length]);

  // Initialize face matcher once
  const initializeFaceMatcher = useCallback(async () => {
    try {
      const labeledFaceDescriptors = await Promise.all(
        faces.map(async (label: any) => {
          const descriptions = label.descriptors.map(
            (arr: number[]) => new Float32Array(arr)
          );
          return new faceapi.LabeledFaceDescriptors(label.label, descriptions);
        })
      );

      faceMatcher.current = new faceapi.FaceMatcher(labeledFaceDescriptors);
    } catch (error) {
      console.error("Error initializing face matcher:", error);
    }
  }, [faces]);

  // Optimized video initialization
  const startVideo = useCallback(async () => {
    try {
      // Stop existing stream
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: camera },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Wait for video to be ready before loading models
        videoRef.current.onloadedmetadata = () => {
          if (!isModelsLoaded) {
            loadModels();
          }
        };
      }
    } catch (err) {
      console.error("Error starting video:", err);
      setStatus("Error accessing camera");
    }
  }, [camera, isModelsLoaded, loadModels]);

  // Optimized face detection with reduced frequency
  const startFaceDetection = useCallback(() => {
    if (!faceMatcher.current || !videoRef.current || !canvasRef.current) return;

    // Clear any existing detection
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }

    const detectFaces = async () => {
      try {
        if (!videoRef.current || !canvasRef.current || !faceMatcher.current)
          return;

        const detections = await faceapi
          .detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceLandmarks()
          .withFaceDescriptors()
          .withFaceExpressions();

        const canvas = canvasRef.current;
        const displaySize = { width: 500, height: 600 };

        faceapi.matchDimensions(canvas, displaySize);
        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );

        // Clear canvas
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, displaySize.width, displaySize.height);
        }

        if (resizedDetections.length > 0) {
          const results = resizedDetections.map((d: any) =>
            faceMatcher.current!.findBestMatch(d.descriptor)
          );

          // Draw detections
          faceapi.draw.drawDetections(canvas, resizedDetections);

          results.forEach((result: any, i: number) => {
            const box = resizedDetections[i].detection.box;
            const drawBox = new faceapi.draw.DrawBox(box, {
              label: result.toString(),
            });
            drawBox.draw(canvas);
          });

          // Liveliness detection
          const detection = resizedDetections[0];
          const expressions = detection.expressions;
          const bestMatch = results[0];
          const isRecognized = bestMatch && bestMatch.label !== "unknown";
          const smiling = isSmiling(expressions);

          if (isRecognized && smiling) {
            setLivelinessStatus("passed");
            setLivelinessMessage(
              "Nice Smile!😉"
            );
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
        console.error("Detection error:", error);
      }
    };

    // Use interval instead of requestAnimationFrame for better performance
    detectionIntervalRef.current = setInterval(detectFaces, 200); // Run every 500ms instead of every frame
  }, []);

  // Optimized data fetching
  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get("users/userDetails", {
        headers: {
          Authorization: `Token ${localStorage.getItem("accessToken")}`,
        },
      });

      const data = response.data;

      if (data?.description) {
        const faceData = [
          {
            label: data.full_name,
            descriptors: data.description,
          },
        ];

        const personData = [
          {
            id: data.full_name,
            name: data.full_name,
            position: data.job_title,
          },
        ];

        setFaces(faceData);
        setPersons(personData);
        setIsDataLoaded(true);

        // Handle location
        const coordinates = getCoordinates(data.location);
        if (coordinates) {
          handleGetLocation(coordinates.latitude, coordinates.longitude);
        }
      } else {
        console.error("No face description data in API response");
        setStatus("No face data available");
      }
    } catch (error: any) {
      console.error("Error fetching data:", error);
      setStatus("Error loading face data");
    }
  }, [getCoordinates, handleGetLocation]);

  // Initialize everything when data is loaded
  useEffect(() => {
    if (isDataLoaded && faces.length > 0) {
      startVideo();
    }
  }, [isDataLoaded, faces.length, startVideo]);

  // Handle camera changes
  useEffect(() => {
    if (isDataLoaded) {
      startVideo();
    }
  }, [camera, isDataLoaded, startVideo]);

  // Initialize app
  useEffect(() => {
    const checkPermissionAndFetch = async () => {
      if (navigator.permissions) {
        try {
          const permissionStatus = await navigator.permissions.query({
            name: "geolocation",
          });

          if (permissionStatus.state === "granted") {
            fetchData();
            setLocationStatus(true)
          } else if (permissionStatus.state === "denied") {
            setProximityStatus("❌ Location access denied.");
            setLocationStatus(false);
            fetchData(); // Still fetch face data even without location
          } else {
            setProximityStatus("❓ Location access not determined.");
            setLocationStatus(null);
            fetchData();
          }
        } catch (error) {
          console.error("Permission check error:", error);
          fetchData();
        }
      } else {
        setProximityStatus("❓ Location access not supported.");
        setLocationStatus(null);
        fetchData();
      }
    };

    checkPermissionAndFetch();
  }, [fetchData]);

  // Cleanup
  useEffect(() => {
    return () => {
      // Stop video tracks
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }

      // Clear intervals and animation frames
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }

      if (requestAnimationFrameId.current) {
        cancelAnimationFrame(requestAnimationFrameId.current);
      }

      // Clear canvas
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          ctx.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
        }   
      }

      setStatus("Stopped");
    };
  }, []);

  const getCurrentISOTime = () => {
    // Use the local time directly since we're already in PH timezone
    const now = new Date();

    // Format the date parts
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    // Create ISO string with PH timezonez
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
  };
  const handleTimeAction = useCallback((action: "in" | "out") => {
    const message = action === "in" ? "clocked in" : "clocked out";
    const currentTime = getCurrentISOTime();

  

         axios
      .post(
        "checkinoutregion/create/",
        {
          CHECKTIME: currentTime,
          CHECKTYPE: action === "in" ? "I" : "o",
          VERIFYCODE: JSON.parse(localStorage.getItem("user") || "{}").deptid,
          SENSORID: JSON.parse(localStorage.getItem("user") || "{}").deptid,
        },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("accessToken")}`,
          },
        }
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
          text:
            error.response?.data?.detail ||
            "An error occurred while processing your request.",
          confirmButtonColor: "#d33",
        });
      });
    

    

   


  }, []);

  return (
    <div className="flex-1 h-full overflow-auto">
      <div className="flex-1 items-center mt-20 justify-between">
        <div className="">
          <p className="animate-pulse ml-4 text-2xl text-primary">
            Hello, {fullName}! 👋
          </p>
          <p className="ml-4 text-sm italic text-foreground ">
            You are currently <span className=" ">{proximityStatus}</span>
            
          </p>
        </div>
        <div className="flex flex-col items-center justify-center mt-10 sm:mt-4">
          <p className="text-2xl font-bold sm:text-base text-primary">
            Digital Biometric
          </p>
          <p className=" text-secondary-foreground text-sm mt-2">
            Please Smile🙂 To enable the Clock In/Out Button{" "}
          </p>

          {true ? (
            <div className="flex w-full justify-center mt-10">
              <div className={livelinessStatus === "passed" && locationStatus === "ok" ? " flex self-center   w-[80%] sm:w-[90%] sm:h-[40vh]  h-[50vh] bg-border border border-5 border-green-500 rounded-md " :" flex self-center   w-[80%] sm:w-[90%] sm:h-[40vh]  h-[50vh] bg-border border rounded-md "}>
                <div className="   flex flex-col gap-5 items-center justify-center h-full w-full relative ">
                

                  

                  <div className=" overflow-hidden w-full max-w-[500px] h-[500px] relative flex">
                  

                   
<div className=" ml-2 mt-5 absolute gap-2 text-primary col-span-1 flex flex-col ">
  {name &&
    name.map((response: any, key: any) => {
      const matchedData = persons.find(
        (item) => item.id === response._label
      );
      return (
        <div
          key={key}
          className=" text-sm bg-card/50 backdrop-blur-md p-2 rounded-md"
        >
          <h3>{matchedData ? matchedData.name : 'Unknown'}</h3>
          <p>{matchedData ? matchedData.position : 'Unrecognized Person'}</p>
        </div>
      );
    })}
</div>

                    <video
                      crossOrigin="anonymous"
                      ref={videoRef}
                      className=" w-full h-full  rounded-md "
                      autoPlay
                      muted
                      playsInline
                    ></video>
                    <canvas
                      ref={canvasRef}
                      className="  w-full h-full  absolute"
                    />
                  </div>

                  <div className=" w-[300px]  grid  justify-center items-center  grid-cols-3  "></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex w-full justify-center mt-10">
              <div className=" flex items-center justify-center  w-[80%]  h-[40vh] bg-border border round">
                <p className="text-xl w-[80%] text-center font-thin text-[red]">
                  Please enable location access to use this feature or Go Within
                  your designated Office
                </p>
              </div>
            </div>
          )}


         
            <div className=" relative  grid grid-cols-3 justify-center  w-[80%] items-center   h-full">

                        <p className=" relative bottom-0 left-0 p-4 z-[999] justify-start justify-self-start  sm:text-sm  text-secondary-foreground ">
                     Status: &nbsp;
                      <span
                        className={
                          status == "Running"
                            ? "  justify-end justify-self-end z-[999] text-green-600"
                            : " text-red-500 justify-end z-[999] justify-self-end"
                        }
                      >
                        {status}
                      </span>
                    </p>
                        <RotateCcwIcon
                    className={
                      camera == "user"
                        ? "   cursor-pointer m-5 text-foreground justify-center self-center justify-self-center rotate-180 transition-all duration-700 col-span-1 "
                        : " justify-center self-center justify-self-center cursor-pointer m-5 text-foreground col-span-1  rotate-0 transition-all duration-700"
                    }
                    onClick={() => {
                      setCamera((prevState) =>
                        prevState === "user" ? "environment" : "user"
                      );
                    }}
                  />



              
                        <span
                          className={
                            livelinessStatus === "passed"
                              ? "text-green-600 sm:text-sm justify-self-end"
                              : "text-yellow-600 sm:text-sm  justify-self-end"
                          }
                        >
                          {livelinessMessage}
                        </span>
                     
                    </div>
         
          <div className=" mt-10 flex gap-6  justify-center">
            <Button
              className={
                livelinessStatus === "passed" && locationStatus === "ok"
                  ? " bg-primary "
                  : "  pointer-events-none bg-red-500/50  "
              }
              onClick={() => handleTimeAction("in")}
            >
              Time In
            </Button>
            <Button
              className={
                livelinessStatus === "passed" && locationStatus === "ok"
                  ? " bg-primary "
                  : "  pointer-events-none bg-red-500/50  "
              }
              onClick={() => handleTimeAction("out")}
            >
              Time Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FaceRec;
