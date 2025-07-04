import React from "react";

interface Props {
  onRetry: () => void;
}

const FaceRecTimeoutWarning: React.FC<Props> = ({ onRetry }) => (
  <div className="flex flex-col justify-center items-center w-full h-screen">
    <h2 className="text-xl font-bold mb-4">This page is currently turned off to limit the process on your device.</h2>
    <button
      className="px-4 py-2 bg-blue-500 text-white rounded"
      onClick={onRetry}
    >
      Return to Process
    </button>
  </div>
);

export default FaceRecTimeoutWarning;