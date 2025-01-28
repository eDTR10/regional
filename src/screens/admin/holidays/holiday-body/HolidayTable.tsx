import { useEffect, useState } from 'react';
import {  Car, PlusSquareIcon, Search,Trash2 } from 'lucide-react';
import axios from '../../../../plugin/axios';
import Swal from 'sweetalert2';

import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { convertDate } from '@/helper/date-time';
import { convertStatus } from '@/helper/convert-status';
import InputText2 from '@/components/input/InputText2';


const HolidayTable = () => {

    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, _setFilterType] = useState('All');
    const [data, setData] = useState([]);

    const [isAddActivityDialogOpen, setIsAddActivityDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [activityToDelete, setActivityToDelete] = useState<any>(null);
    const [_employeeName, _setEmployeeName] = useState('');
    const [_activity, setActivity] = useState('');
    const [period, setPeriod] = useState('')
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [description, setDescription] = useState('');

    const userJson = localStorage.getItem("user");
    const userObject = userJson ? JSON.parse(userJson) : null;

   

    const addActivity = async () => {
        try {
            await axios.post('holiday/', {
                USERID: userObject?.uid,
                fromDate: fromDate,
                toDate: toDate,
                description: description,
                status: 6,
                period: period ? period : 1,
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
            setIsAddActivityDialogOpen(false);
            fetchData();
            setActivity('');
            setPeriod('');
            // Refresh data after adding activity
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

    console.log(activityToDelete)
    const deleteActivity = async () => {
        try {
             await axios.delete(`holiday/delete/${activityToDelete.holiday_id}/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem("accessToken")}`,
                }
            });
            Swal.fire({
                icon: "success",
                title: "Deleted Successfully...",
                showConfirmButton: false,
                timer: 2000
            });
            setIsDeleteDialogOpen(false);
            fetchData(); // Refresh data after deleting activity
        } catch (error: any) {
            console.error('Error deleting data:', error.response ? error.response.data : error.message);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.response.data.non_field_errors[0],
                showConfirmButton: false,
            });
        }
    };

    const fetchData = async () => {
        try {
            const response = await axios.get('holiday/', {
                headers: {
                    Authorization: `Token ${localStorage.getItem("accessToken")}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });
            setData(response.data);
            console.log('Fetched data:', response.data);
        } catch (error: any) {
            console.error('Error fetching data:', error.response ? error.response.data : error.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredCheckData = data.filter((item: any) => {
        const matchesSearchTerm = item.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item?.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            convertStatus(item?.status).includes(searchTerm.toLowerCase());

        const matchesFilterType = filterType === 'All' || convertStatus(item?.status) === filterType;

        return matchesSearchTerm && matchesFilterType;
    });

    return (
        <div className='relative w-xl p-2 m-4 border border-border bg-primary-foreground min-h-[130px]'>
            <div className='flex p-4 justify-between items-center bg-primary mb-2'>
                <p className='text-white '>LIST OF HOLIDAYS</p>
                <Car className='animate-bounce text-6xl text-white' />
            </div>
            <div className='flex items-center w-full content-center py-2'>
                <Search className='text-primary mr-2' />
                <input
                    type="text"
                    placeholder=" Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="outline-none focus:outline-primary border pl-2 h-8 border-border rounded w-1/2 text-foreground bg-primary-foreground"
                />
                <div className='flex-grow'></div> {/* This will push the button to the end */}
                <Button title='Add Activity' onClick={() => setIsAddActivityDialogOpen(true)} className='ml-2 justify-end text-white flex gap-2'>Add Holiday <PlusSquareIcon className=' w-4 h-4' /></Button>
            </div>

            {/* <div className="flex gap-2 py-2">
                <button
                    onClick={() => setFilterType('All')}
                    className={`p-2 border border-border text-primary rounded ${filterType === 'All' ? 'bg-blue-500 text-white' : ''}`}
                >
                    All
                </button>
                <button
                    onClick={() => setFilterType('In Office')}
                    className={`p-2 border border-border text-primary rounded ${filterType === 'In Office' ? 'bg-blue-500 text-white' : ''}`}
                >
                    In Office
                </button>
                <button
                    onClick={() => setFilterType('Out of Office')}
                    className={`p-2 border border-border text-primary rounded ${filterType === 'Out of Office' ? 'bg-blue-500 text-white' : ''}`}
                >
                    Out of Office
                </button>
                <button
                    onClick={() => setFilterType('On Travel')}
                    className={`p-2 border border-border text-primary rounded ${filterType === 'On Travel' ? 'bg-blue-500 text-white' : ''}`}
                >
                    On Travel
                </button>
                <button
                    onClick={() => setFilterType('On Leave')}
                    className={`p-2 border border-border text-primary rounded ${filterType === 'On Leave' ? 'bg-blue-500 text-white' : ''}`}
                >
                    On Leave
                </button>
            </div> */}

            <div className="overflow-auto bg-primary-foreground max-h-full">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[170px] border border-border text-white sticky top-0 bg-primary">HOLIDAY</TableHead>
                            <TableHead className='text-white border border-border text-md sticky top-0 bg-primary'>FROM DATE</TableHead>
                            <TableHead className='text-white border border-border text-md sticky top-0 bg-primary'>TO DATE</TableHead>
                            <TableHead className='text-white border border-border text-md sticky top-0 bg-primary'>ACTION</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredCheckData.map((item: any, index) => (
                            <TableRow key={index} className='border border-border'>
                                <TableCell className="font-small">{item?.description}</TableCell>
                                <TableCell>{convertDate(item?.fromDate).customLongDateFormat}</TableCell>
                                <TableCell>{convertDate(item?.toDate).customLongDateFormat}</TableCell>
                                <TableCell>
                                    <Button variant={'secondary'} onClick={() => {
                                        setActivityToDelete(item);
                                        setIsDeleteDialogOpen(true);
                                    }}><Trash2 className='text-red-500 w-4 h-4' /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isAddActivityDialogOpen} onOpenChange={setIsAddActivityDialogOpen}>
                <DialogContent className='w-[350px]'>
                    <DialogTitle className='text-foreground'>Add Activity</DialogTitle>
                    <DialogDescription>
                        Please fill in the details below to add a new activity.
                    </DialogDescription>
                    <div className="flex flex-col gap-4 mt-4">
                        <Input className='col-span-4 text-foreground outline-none' required value={description}
                            onChange={(e: any) => setDescription(e.target.value)} placeholder="Please input Holiday Name..." />
                        <div className='flex'>
                            {/* <Select value={activity} onValueChange={(value) => setActivity(value)}>
                                <SelectTrigger className="text-foreground" style={{ marginRight: 12 }}>
                                    <SelectValue placeholder="Select Activity" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">In Office</SelectItem>
                                    <SelectItem value="2">Out of Office</SelectItem>
                                    <SelectItem value="3">On Travel</SelectItem>
                                    <SelectItem value="4">On Leave</SelectItem>
                                    <SelectItem value="5">Work from Home</SelectItem>
                                </SelectContent>
                            </Select> */}

                            <Select value={period} onValueChange={(value) => setPeriod(value)}>
                                <SelectTrigger className="text-foreground">
                                    <SelectValue placeholder="Select Time Period" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Whole Day</SelectItem>
                                    <SelectItem value="2">AM</SelectItem>
                                    <SelectItem value="3">PM</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex gap-4 w-full justify-between">
                            <div className="flex flex-col col-span-1 w-full">
                                <p className="text-md text-foreground  w-full">From: </p>
                                <InputText2 value={fromDate} onChange={(e: any) => {
                                    console.log(e.target.value)
                                    setFromDate(e.target.value)
                                }} className="text-foreground w-full flex justify-between" type="date" />
                            </div>
                            <div className="flex flex-col col-span-1 w-full">
                                <p className="text-md text-foreground ">To: </p>
                                <InputText2 value={toDate} onChange={(e: any) => {
                                    console.log(e.target.value)
                                    setToDate(e.target.value)
                                }} className="text-foreground flex justify-between" type="date" />
                            </div>
                        </div>

                    </div>
                    <DialogFooter>
                        <Button variant="outline" className='text-foreground mt-4' onClick={() => setIsAddActivityDialogOpen(false)}>Cancel</Button>
                        <Button className='mt-4' onClick={addActivity}>Submit</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className='w-[350px]'>
                    <DialogTitle className='text-foreground'>Confirm Deletion</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this activity?
                    </DialogDescription>
                    <DialogFooter>
                        <Button variant="outline" className='text-foreground mt-4' onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                        <Button className='bg-red-500 text-foreground mt-4' onClick={deleteActivity}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default HolidayTable;

