import UserPersonalInformation from "./personal-information/UserPersonalInformation";


import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import UserEditPersonalInformation from "./update-profile/UserEditPersonalInformation";
import { useEffect, useState } from "react";
import axios from "../../../plugin/axios";

const UserProfile = () => {
    const [profileData, setProfileData] = useState<any>([]);
    const [updatedPhoto, setUpdatedPhoto] = useState('');

    const handlePhotoUpdate = (newPhoto: string) => {
        setUpdatedPhoto(newPhoto);
    };

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

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="flex-1 flex flex-col items-center mt-12">
            <Tabs defaultValue="account" className="w-[90%] mt-10 flex flex-col items-center ">
                <TabsList className="flex justify-center w-full sticky ">
                    <TabsTrigger value="account" className="flex-1 text-center">Personal Information</TabsTrigger>
                    <TabsTrigger value="password" className="flex-1 text-center">Edit Profile</TabsTrigger>
                </TabsList>
                <TabsContent value="account" className="w-full h-[calc(100vh-4rem)] ">
                    <div className="w-full p-4">
                        <UserPersonalInformation profileData={profileData} updatedPhoto={updatedPhoto} />
                    </div>
                </TabsContent>
                <TabsContent value="password" className="overflow-scroll pb-12 w-full h-[calc(100vh-4rem)] ">
                    <div className="w-full p-4">
                        <UserEditPersonalInformation profileData={profileData} onPhotoUpdate={handlePhotoUpdate} />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default UserProfile;