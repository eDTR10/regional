import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FaceRecWarning from "./FaceRecWarning";
import FaceRecMain from "./FaceMain";
import axios from "./../../../plugin/axios";
import DashboardAnalogClock from "@/screens/admin/dashboard/dashboard-body/DashboardAnalogClock";

function FaceRec() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(60); // 15 seconds for testing
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("users/userDetails", {
        headers: { Authorization: `Token ${localStorage.getItem("accessToken")}` },
      })
      .then((response) => {
        setUserData(response.data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
       
            navigate("/regional/user/temp");     
            window.location.reload();
            
          }
        
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  const formatTimer = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="flex h-full w-full justify-center items-center">Loading...</div>;

  if (!userData || !userData.description || userData.description.length === 0) {
    return (
      <div className="flex-1 h-full flex items-center justify-center">
        
        <FaceRecWarning />
      </div>
    );
  }

  return (
    <div className="flex-1 h-full overflow-auto">
      <div className="fixed bottom-20 right-2 bg-gray-100 px-3 py-1 rounded-md font-mono text-sm z-50">
       <span className=" md:hidden">Session Timer:</span>   {formatTimer(timer)}
      </div>
      <DashboardAnalogClock />
      <FaceRecMain userObject={userData} />
    </div>
  );
}

export default FaceRec;
