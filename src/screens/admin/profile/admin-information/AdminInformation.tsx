
import { Plane,  Home, Globe, Car, Building2 } from 'lucide-react';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { convertDate } from '@/helper/date-time';
import { convertStatus } from '@/helper/convert-status';

// Helper function to get status details
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


const AdminInformation = (profileData: any) => {
  
    const data = profileData.profileData;

    const fullName = data?.full_name;

    const status = data?.status ? data.status : 0;
    const statusDetails = getStatusDetails(status);

    console.log(profileData);
    return (
        <div>
            <div className='flex flex-col w-full items-center p-8 bg-primary-foreground border border-border'>
                <Avatar>
                    <AvatarImage src={profileData.profileData.photos ? `${import.meta.env.VITE_URL}${profileData.profileData.photos}` : 'https://github.com/shadcn.png'} alt={fullName} className='rounded-full h-28 w-28 object-cover' />
                </Avatar>

                <div className="flex flex-col items-center mt-4">
                    <p className="animate-pulse text-2xl text-primary truncate">I'm, {fullName}! 👋</p>
                    <p className="text-sm italic text-foreground flex items-center">
                        I am currently <span className={`mx-2 ${statusDetails.color}`}><Badge className='animate-bounce'>{convertStatus(status)}</Badge></span>
                        {statusDetails.icon}
                    </p>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 mt-6">
                    <div className="flex flex-col col-span-2 md:col-span-1 sm:grid-cols-1">
                        <p className="text-md text-foreground">Fullname</p>
                        <Input placeholder='Fullname' title='Fullname' disabled value={data?.full_name ? data?.full_name : 'N/A'} className='text-md text-foreground ' />
                    </div>
                    <div className="flex flex-col sm:grid-cols-1 xs:col-span-1">
                        <p className="text-md text-foreground">Email</p>
                        <Input placeholder='Email' title='Email' disabled value={data?.email ? data?.email : 'N/A'} className='text-md text-foreground' />
                    </div>
                    <div className="flex flex-col xs:col-span-1">
                        <p className="text-md text-foreground">Sex</p>
                        <Input placeholder='Sex' title='Sex' disabled value={data?.sex ? data?.sex : 'N/A'} className='text-md text-foreground' />
                    </div>
                    <div className="flex flex-col col-span-2 md:col-span-1 xs:col-span-1">
                        <p className="text-md text-foreground">Birthday</p>
                        <Input placeholder='Birthday' title='Birthday' disabled value={data?.birthday ? convertDate(data?.birthday).customLongDateFormat : 'N/A'} className='text-md text-foreground' />
                    </div>
                    <div className="flex flex-col col-span-3 md:col-span-2 xs:col-span-1">
                        <p className="text-md text-foreground">Address</p>
                        <Input placeholder='Address' title='Address' disabled value={data?.street + data?.city ? data?.street + ", " + data?.city + " " + data?.zip : 'N/A'} className='text-md text-foreground' />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminInformation;