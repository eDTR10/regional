import { useEffect, useState } from 'react'
import axios from "../../../plugin/axios";
import UserDashboardTableAttendance from './dashboard-body/UserDashboardTableAttendance';

import DashboardCards from './dashboard-body/DashboardCards';

import DashboardAnalogClock from '@/screens/admin/dashboard/dashboard-body/DashboardAnalogClock';
import DashboardTableBirthday from '@/screens/admin/dashboard/dashboard-body/DashboardTableBirthday';
import { Building2, Car, Globe, Home, Plane } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { convertStatus } from '@/helper/convert-status';

const getStatusDetails = (status: number) => {
    switch (status) {
        case 1:
            return { color: 'text-green-500', icon: <Building2 className='text-green-500' /> };
        case 2:
            return { color: 'text-red-500', icon: <Car className='text-red-500' /> };
        case 3:
            return { color: 'text-blue-500', icon: <Globe className='text-blue-500' /> };
        case 4:
            return { color: 'text-yellow-500', icon: <Plane className='text-yellow-500' /> };
        case 5:
            return { color: 'text-yellow-500', icon: <Home className='text-green-500' /> };
        default:
            return { color: 'text-gray-500', icon: <Plane className='text-gray-500' /> };
    }
};


const UserDashboardMainContainer = () => {
    const [data, setData] = useState([]);
    const userJson = localStorage.getItem("user");
    const userObject = userJson ? JSON.parse(userJson) : null;
    const fullName = userObject?.full_name;

    const [profileData, setProfileData] = useState<any>([]);

    const status = profileData?.status ? profileData.status : 0;
    const statusDetails = getStatusDetails(status);

    useEffect(() => {
        // console.log(localStorage.getItem("accessToken"));
        const fetchData = async () => {
            try {
                const response = await axios.get('users/summary', {
                    headers: {
                        Authorization: `Token ${localStorage.getItem("accessToken")}`,
                    },
                });
                setData(response.data);

                localStorage.setItem('birthday', response.data.birthday_celebrants.length != 0 ? "1" : "0")

            } catch (error: any) {
                console.error('Error fetching data:', error.response ? error.response.data : error.message);

            }
        };
        fetchData();
    }, []);

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
        <div className="flex-1 h-full overflow-auto">
            <DashboardAnalogClock />
            <div className="flex-1 items-center mt-20 justify-between">
                <div>
                    <p className="animate-pulse ml-4 text-2xl text-primary">Hello, {fullName}! 👋</p>
                    <p className="ml-4 text-sm italic text-foreground flex items-center">
                        I am currently <span className={`mx-2 ${statusDetails.color}`}><Badge className='animate-bounce'>{convertStatus(status)}</Badge></span>
                        {statusDetails.icon}
                    </p>
                </div>

                <DashboardCards data={data} />

            </div>
            {/* <div className="animate__animated animate__slideInRight">
                <UserDashboardTableAttendance />
            </div> */}
            <div className=" animate__animated animate__slideInRight  grid  grid-cols-2 forTable:grid-cols-1">
                <UserDashboardTableAttendance />
                <DashboardTableBirthday data={data} />
            </div>
        </div>
    )
}

export default UserDashboardMainContainer
