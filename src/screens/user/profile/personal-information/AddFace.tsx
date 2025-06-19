import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";


import * as React from "react";
import { useCallback} from "react";
import * as faceapi from "face-api.js";
import axios from "./../../../../plugin/axios";
import Swal from "sweetalert2";
import { User2Icon } from "lucide-react";

const MODEL_URL = '/regional/models'; // adjust path according to your setup

export function DrawerDemo(datas:any) {
  const [data, setData] = React.useState<any>({
    name: datas?.full_name,
    id: datas?.employee_id,
    position: datas?.job_title,
    photos: [],
  });

  
  const [previews, setPreviews] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false); // Add this state
  

 

  const loadModels = useCallback(() => {
    Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ]).then(() => {
      console.log("Models loaded");
    });
  }, []);

  const getFaceDescriptor = useCallback(async (img: HTMLImageElement) => {
    return await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);

    setData((prevData:any) => ({
      ...prevData,
      photos: [...prevData.photos, ...files],
    }));
  };

  const handleRemoveImage = (index: number) => {
    setPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
    setData((prevData:any) => ({
      ...prevData,
      photos: prevData.photos.filter((_:any, i:any) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    

    const descriptions = await Promise.all(
      data.photos.map(async (file: File) => {
        const img = await faceapi.fetchImage(URL.createObjectURL(file));
        const detection = await getFaceDescriptor(img);


        return detection?.descriptor || [];
      })
    );

    const labeledFaceDescriptors:any = {
      label: datas.full_name,
      descriptors: descriptions.map(descriptor => 
    Object.keys(descriptor)
      .map(key => parseFloat(descriptor[key]))
  )
    };

    axios.put('users/user_update/',{
        face_id:labeledFaceDescriptors.descriptors
    },{
          headers: {
            Authorization: `Token ${localStorage.getItem("accessToken")}`,
          },
        })
    .then((_response) => {
        setPreviews([]);
        Swal.fire({
          icon: "success",  
            title: "Face data updated successfully!",
            showConfirmButton: false,
            timer: 2000
        });
        setData({
          name: datas?.full_name,
          id: datas?.employee_id,
          position: datas?.job_title,
          photos: [],
        });
        setOpen(false); // <-- Close the drawer after success
    }
    ).catch((error) => {
        
        Swal.fire({
          icon: "error",
            title: "Error updating face data",
            text: error.response?.data?.detail || "An error occurred while updating face data.",
            showConfirmButton: true,
        });
       
  
        console.error("Error updating face data:", error);
        }   
    );

    setLoading(false);
    // window.location.reload();
    console.log(data);
  };

  React.useEffect(() => {
    loadModels();
    console.log("sdsdsd ", datas)
  }, [loadModels]);

  React.useEffect(() => {
    setData({
      name: datas?.full_name,
      id: datas?.employee_id,
      position: datas?.job_title,
      photos: [],
    });
  }, [datas]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button  onClick={() => setOpen(true)}> <User2Icon className=" w-4 h-4 mr-3 "/> Register your Face for Digital Biometric</Button>
      </DrawerTrigger>
      <DrawerContent title="Register Face" description="Upload face and wait for the model to train">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Register a Face</DrawerTitle>
            <DrawerDescription>Upload face and wait for the model to train.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex text-foreground gap-4 flex-col justify-center">
              <div className="flex-1 text-start w-full">
                <p>Images</p>
                <label className="text-sm text-foreground font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"></label>
                <div className="grid w-full items-start">
                  <input
                    id="picture"
                    onChange={handleFileChange}
                    type="file"
                    multiple
                    className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-foreground file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium"
                  />
                </div>
                <div className="preview mt-3 grid grid-cols-3 gap-2">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        className="h-[70px] w-full object-contain"
                        alt={`Image Preview ${index}`}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-3 h-[120px]"></div>
          </div>
          <DrawerFooter>
            <Button
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Submit'}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
