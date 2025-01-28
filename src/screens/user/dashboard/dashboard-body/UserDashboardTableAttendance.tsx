import { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Search, Sheet } from 'lucide-react';
import axios from '../../../../plugin/axios';
import Swal from 'sweetalert2';

import { convertCheckType } from '@/helper/check-type';
import { convertDate } from '@/helper/date-time';

const UserDashboardTableAttendance = () => {

    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [data, setData] = useState([]);

    useEffect(() => {
        // console.log(localStorage.getItem("accessToken"));
        const fetchData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_POINT}/today/`, {
                    headers: {
                        Authorization: `Token ${localStorage.getItem("accessToken")}`,
                    },
                });
                setData(response.data);
                console.log('Fetched data:', response.data);
            } catch (error: any) {
                console.error('Error fetching data:', error.response ? error.response.data : error.message);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong while fetching the data!',
                });
            }
        };

        fetchData();
    }, []);

    const filteredCheckData = data.filter((item: any) => {
        const matchesSearchTerm = item.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            convertDate(item.CHECKTIME).localeTime12HourFormat.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.CHECKTYPE.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilterType = filterType === 'All' || convertCheckType(item?.CHECKTYPE) === filterType;

        return matchesSearchTerm && matchesFilterType;
    });


    return (
        <div className=' relative w-xl p-2 m-4 border border-border bg-primary-foreground min-h-[130px]'>
            <div className='flex p-4 justify-between items-center bg-primary mb-2'>
                <p className='text-white '>DAILY ATTENDANCE</p>
                <Sheet className='text-6xl text-white' />
            </div>
            <div className='flex items-center content-center py-2 '>
                <Search className='text-primary mr-2' />
                <input
                    type="text"
                    placeholder=" Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="outline-none  focus:outline-primary  border pl-2 h-8 border-border rounded w-1/2 text-foreground bg-primary-foreground"
                />
            </div>

            <div className="  flex gap-2 py-2">
                <button
                    onClick={() => setFilterType('All')}
                    className={`p-2 border border-border text-primary rounded ${filterType === 'All' ? 'bg-blue-500 text-white' : ''}`}
                >
                    All
                </button>
                <button
                    onClick={() => setFilterType('AM Arrival')}
                    className={`p-2 border border-border text-primary rounded ${filterType === 'AM Arrival' ? 'bg-blue-500 text-white' : ''}`}
                >
                    AM Arrival
                </button>
                <button
                    onClick={() => setFilterType('AM Departure')}
                    className={`p-2 border border-border text-primary rounded ${filterType === 'AM Departure' ? 'bg-blue-500 text-white' : ''}`}
                >
                    AM Departure
                </button>
                <button
                    onClick={() => setFilterType('PM Arrival')}
                    className={`p-2 border border-border text-primary rounded ${filterType === 'PM Arrival' ? 'bg-blue-500 text-white' : ''}`}
                >
                    PM Arrival
                </button>
                <button
                    onClick={() => setFilterType('PM Departure')}
                    className={`p-2 border border-border text-primary rounded ${filterType === 'PM Departure' ? 'bg-blue-500 text-white' : ''}`}
                >
                    PM Departure
                </button>
            </div>

            <div className="overflow-auto bg-primary-foreground max-h-full">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[170px] border border-border text-white sticky top-0 bg-primary">FULLNAME</TableHead>
                            <TableHead className='text-white border border-border text-md sticky top-0 bg-primary'>CHECK TIME</TableHead>
                            <TableHead className='text-white border border-border text-md sticky top-0 bg-primary'>CHECK TYPE</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredCheckData.map((item: any, index) => (
                            <TableRow key={index} className=' border border-border'>
                                <TableCell className="font-small">{item?.full_name}</TableCell>
                                <TableCell>{convertDate(item?.CHECKTIME).localeTime12HourFormat}</TableCell>
                                <TableCell>
                                    {convertCheckType(item?.CHECKTYPE)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default UserDashboardTableAttendance;