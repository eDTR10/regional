
const FaceRecWarning = () => (
  <div className="flex flex-col items-center justify-center h-screen w-full">
    <div className="bg-card border border-border rounded-md p-8 shadow-md flex flex-col items-center">
      <p className="text-2xl font-bold text-primary mb-2">Face Registration Required</p>
      
      
      <p className="text-foreground text-center">
        Please register your face from your profile to use this page.
      </p>
      <p className=" text-primary text-xs"> View Profile →  Register your Face for Digital Biometric</p>
        <p className=" text-xs text-yellow-500 mt-5">*Note: Images won't be saved to the database — your privacy is safe 😊!</p>
    </div>
  </div>
);

export default FaceRecWarning;