import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function TempPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-center px-4">
      <h1 className="text-3xl font-bold mb-3 text-primary">
        ⚠️ Biometric Timeout
      </h1>
      <p className="text-gray-600 mb-8 max-w-md">
        ⏱️ For security and performance reasons, this session has timed out. 
        Please click the button below to return to the biometric page.
      </p>
      <Button
        onClick={() => navigate("/regional/user/biometric/")}
        className="px-6 py-2 bg-primary hover:bg-primary/90 text-white text-base rounded-md shadow-md transition"
      >
        🔄 Go Back to Biometric
      </Button>
    </div>
  );
}

export default TempPage;
