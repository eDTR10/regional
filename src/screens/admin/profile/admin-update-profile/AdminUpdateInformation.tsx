import React, { useState } from 'react';
import { ArrowRight, Plane, Building2, Car, Globe, EyeOff, Eye,  Home } from 'lucide-react';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputText2 from '@/components/input/InputText2';
import axios from "../../../../plugin/axios";
import { convertStatus } from '@/helper/convert-status';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import Swal from 'sweetalert2';

// Helper function to get status details
const getStatusDetails = (status: number,) => {
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

const AdminUpdateInformation = (profileData: any, onPhotoUpdate: any) => {

  

    const data = profileData?.profileData;

    const [fullName, setFullName] = useState(data?.full_name || '');
    const [email, setEmail] = useState(data?.email || '');
    const [sex, setSex] = useState(data?.sex ? data?.sex : '');
    const [birthday, setBirthday] = useState(data?.birthday ? data?.birthday.split('T')[0] : '');
    const [street, setStreet] = useState(data?.street ? data?.street : '');
    const [city, setCity] = useState(data?.city ? data?.city : '');
    const [zip, setZip] = useState(data?.zip ? data?.zip : '');
    const [status, setStatus] = useState(data?.status ? data?.status.toString() : ''); // Convert status to string for Select component
    const [isProfilePhotoModalOpen, setIsProfilePhotoModalOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [retypeNewPassword, setRetypeNewPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showRetypeNewPassword, setShowRetypeNewPassword] = useState(false);
    const [photo, setPhoto] = useState(data?.photos ? data?.photos : '');
    const statusDetails = getStatusDetails(parseInt(status));

    const updateProfile = async () => {
        const emptyFields = [];
        if (!email) emptyFields.push("Email");
        if (!fullName) emptyFields.push("Full Name");
        if (!birthday) emptyFields.push("Birthday");

        if (emptyFields.length > 0) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `The following fields are requ  ired: ${emptyFields.join(", ")}. Please double check them.`,
            showConfirmButton: true,
            confirmButtonColor: '#0084ff',
        });
        return;
        }

        try {
            const response = await axios.put('users/user_update/', {
                email: email,
                full_name: fullName,
                sex: sex,
                birthday: birthday ? birthday : null,
                street: street,
                city: city,
                zip: zip,
                status: parseInt(status), // Convert status back to number
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem("accessToken")}`,
                }
            });
            Swal.fire({
                icon: "success",
                title: "Updated Successfully...",
                showConfirmButton: false,
                timer: 2000
            });
            localStorage.setItem("user", JSON.stringify(response.data))
        } catch (error: any) {
            console.error('Error fetching data:', error.response ? error.response.data : error.message);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.response.data.non_field_errors[0],
                showConfirmButton: false,
            });
        }
    };

    const handleConfirm = () => {
        setIsDialogOpen(false);
        updateProfile();
    };

    const handlePasswordChange = async () => {
        if (newPassword !== retypeNewPassword) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "New passwords do not match",
                showConfirmButton: false,
            });
            return;
        }


        try {
             await axios.put('users/user_update/', {
                "password": newPassword,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem("accessToken")}`,
                }
            });
            Swal.fire({
                icon: "success",
                title: "Password Changed Successfully...",
                showConfirmButton: false,
                timer: 2000
            });
            setIsPasswordModalOpen(false);
        } catch (error: any) {
            console.error('Error changing password:', error.response ? error.response.data : error.message);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.response.data.non_field_errors[0],
                showConfirmButton: false,
            });
        }
    };

    const handleProfilePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('photos', file);

            try {
                const response = await axios.put('users/user_update/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Token ${localStorage.getItem("accessToken")}`,
                    }
                });
                Swal.fire({
                    icon: "success",
                    title: "Profile Photo Updated Successfully...",
                    showConfirmButton: false,
                    timer: 2000
                });
                setIsProfilePhotoModalOpen(false);
                setPhoto(response.data.photos);
                if (onPhotoUpdate) {
                    onPhotoUpdate(response.data.photos);
                }

            } catch (error: any) {
                console.error('Error uploading photo:', error.response ? error.response.data : error.message);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: error.response.data.non_field_errors[0],
                    showConfirmButton: false,
                });
            }
        }
    };

    return (
        <div>
            <div className='flex flex-col w-full items-center p-8 bg-primary-foreground border border-border'>
                <Avatar className=" relative">
                    
                    <AvatarImage
                        src={
                            photo
                                ? `${import.meta.env.VITE_URL}${photo}`
                                : "https://github.com/shadcn.png"
                        }
                        alt={fullName}
                        className=" border border-border rounded-full h-28 w-28 object-cover opacity-30"
                    />
                </Avatar>


                <div className="flex flex-col items-center mt-4">
                    <p className="animate-pulse text-2xl text-primary truncate">I'm, {fullName}! 👋</p>
                    <p className="text-sm italic text-foreground flex items-center">
                        I am currently <span className={`mx-2 ${statusDetails.color}`}><Badge className='animate-bounce'>{convertStatus(parseInt(status))}</Badge></span>
                        {statusDetails.icon}
                    </p>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 mt-6">
                    <div className="flex flex-col col-span-2 md:col-span-1">
                        <p className="text-md text-foreground">Fullname</p>
                        <Input
                            placeholder='Fullname'
                            title='Fullname'
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className='text-md text-foreground'
                        />
                    </div>
                    <div className="flex flex-col col-span-1">
                        <p className="text-md text-foreground">Email</p>
                        <Input
                            placeholder='Email'
                            title='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='text-md text-foreground'
                        />
                    </div>
                    <div className="flex flex-col col-span-1">
                        <p className="text-md text-foreground">Sex</p>
                        <Select value={sex} onValueChange={(value) => setSex(value)}>
                            <SelectTrigger className="text-foreground">
                                <SelectValue placeholder="Please select gender..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col col-span-1">
                        <p className="text-md text-foreground">Status</p>
                        <Select value={status} onValueChange={(value) => setStatus(value)}>
                            <SelectTrigger className="text-foreground">
                                <SelectValue placeholder="Please select status..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">In Office</SelectItem>
                                <SelectItem value="2">Out of Office</SelectItem>
                                <SelectItem value="3">On Travel</SelectItem>
                                <SelectItem value="4">On Leave</SelectItem>
                                <SelectItem value="5">Work from Home</SelectItem>
                                <SelectItem value="6">Holiday</SelectItem>
                                <SelectItem value="7">Off Set</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col col-span-1">
                        <p className="text-md text-foreground -mb-2">Birthday</p>
                        <InputText2 value={birthday} onChange={(e: any) => {
                            console.log(e.target.value)
                            setBirthday(e.target.value)
                        }} className=" text-foreground flex justify-between" type="date" />
                    </div>
                    <div className="flex flex-col col-span-1 md:col-span-1">
                        <p className="text-md text-foreground">Street</p>
                        <Input
                            placeholder='Street'
                            title='Street'
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                            className='text-md text-foreground'
                        />
                    </div>
                    <div className="flex flex-col col-span-1 md:col-span-1">
                        <p className="text-md text-foreground">City</p>
                        <Input
                            placeholder='City'
                            title='City'
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className='text-md text-foreground'
                        />
                    </div>
                    <div className="flex flex-col col-span-1 md:col-span-1">
                        <p className="text-md text-foreground">Zip Code</p>
                        <Input
                            placeholder='Zip Code'
                            title='Zip Code'
                            value={zip}
                            onChange={(e) => setZip(e.target.value)}
                            className='text-md text-foreground'
                        />
                    </div>
                </div>

                <div className="flex justify-center w-full">
                    <Button className='mt-8 mr-12' onClick={() => setIsPasswordModalOpen(true)}>Change Password</Button>
                    <Button className='mt-8 ' onClick={() => setIsDialogOpen(true)}>Save Changes <span><ArrowRight /></span></Button>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogTitle className='text-foreground'>Confirm Profile Update</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to update your profile?
                    </DialogDescription>
                    <DialogFooter>
                        <Button variant="outline" className='text-foreground ' onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button className='text-foreground' onClick={handleConfirm}>Confirm</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
                <DialogContent>
                    <DialogTitle className='text-foreground'>Change Password</DialogTitle>
                    <DialogDescription>
                        Please enter your current password and new password.
                    </DialogDescription>
                    <div className="flex flex-col gap-4 mt-4">
                        <div className="relative">
                            <Input
                                type={showNewPassword ? "text" : "password"}
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className='text-md text-foreground'
                            />
                            <span
                                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {!showNewPassword ? <EyeOff className="text-foreground" /> : <Eye className="text-foreground" />}
                            </span>
                        </div>
                        <div className="relative">
                            <Input
                                type={showRetypeNewPassword ? "text" : "password"}
                                placeholder="Re-type New Password"
                                value={retypeNewPassword}
                                onChange={(e) => setRetypeNewPassword(e.target.value)}
                                className='text-md text-foreground'
                            />
                            <span
                                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                                onClick={() => setShowRetypeNewPassword(!showRetypeNewPassword)}
                            >
                                {!showRetypeNewPassword ? <EyeOff className="text-foreground" /> : <Eye className="text-foreground" />}
                            </span>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className='text-foreground ' onClick={() => setIsPasswordModalOpen(false)}>Cancel</Button>
                        <Button className='text-foreground' onClick={handlePasswordChange}>Change Password</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isProfilePhotoModalOpen} onOpenChange={setIsProfilePhotoModalOpen}>
                <DialogContent>
                    <DialogTitle className='text-foreground'>Upload Profile Photo</DialogTitle>
                    <DialogDescription>
                        Please select a new profile photo to upload.
                    </DialogDescription>
                    <div className="flex flex-col gap-4 mt-4">
                        <input type="file" accept="image/*" onChange={handleProfilePhotoChange} />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className='text-foreground mt-2' onClick={() => setIsProfilePhotoModalOpen(false)}>Cancel</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminUpdateInformation;