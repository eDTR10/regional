import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import AdminInformation from "./admin-information/AdminInformation";
import { useEffect, useState } from "react";
import axios from "../../../plugin/axios";
import AdminUpdateInformation from "./admin-update-profile/AdminUpdateInformation";

const AdminProfileMainContainer = () => {

    const [profileData, setProfileData] = useState<any>([]);

    const [updatedPhoto, setUpdatedPhoto] = useState('');

    const handlePhotoUpdate = (newPhoto: string) => {
        setUpdatedPhoto(newPhoto);
    };

    useEffect(() => {
        // console.log(localStorage.getItem("accessToken"));
        const fetchData = async () => {
            try {
                const response = await axios.get('users/userDetails', {
                    headers: {
                        Authorization: `Token ${localStorage.getItem("accessToken")}`,
                    },
                });
                setProfileData(response.data);
                console.log('Fetched data:', response.data);
            } catch (error: any) {
                console.error('Error fetching data:', error.response ? error.response.data : error.message);

            }
        };
        fetchData();
    }, []);


    return (
        <div className="flex-1 flex flex-col items-center mt-12">
            <Tabs defaultValue="account" className="w-full p-10">
                <TabsList className="flex justify-center w-full sticky top-0 ">
                    <TabsTrigger value="account" className="flex-1 text-center ">Personal Information</TabsTrigger>
                    <TabsTrigger value="password" className="flex-1 text-center">Edit Profile</TabsTrigger>
                </TabsList>
                <TabsContent value="account" className="w-full h-[calc(100vh-4rem)] ">
                    <div className="w-full p-4">
                        <AdminInformation profileData={profileData} updatedPhoto={updatedPhoto} />
                    </div>
                </TabsContent>
                <TabsContent value="password" className="overflow-scroll pb-12 w-full h-[calc(100vh-4rem)] ">
                    <div className="w-full p-4">
                        <AdminUpdateInformation profileData={profileData} onPhotoUpdate={handlePhotoUpdate} />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default AdminProfileMainContainer
