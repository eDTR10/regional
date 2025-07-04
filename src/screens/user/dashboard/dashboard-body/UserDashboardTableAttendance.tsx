import  { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Search, Sheet } from 'lucide-react';
import axios from './../../../../plugin/axios';
import Swal from 'sweetalert2';
import { convertCheckType } from '@/helper/check-type';
import { convertDate } from '@/helper/date-time';

const DashboardTableAttendance = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [filterDept, setFilterDept] = useState('All');
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_POINT}/today/`, {
                    headers: {
                        Authorization: `Token ${localStorage.getItem("accessToken")}`,
                    },
                });
                setData(response.data);
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

    // Department options mapping
    const departmentOptions = [
        { value: "Regional Office", label: "Regional Office" },
        { value: "Bukidnon Provincial Office", label: "Bukidnon Provincial Office" },
        { value: "Camiguin Provincial Office", label: "Camiguin Provincial Office" },
        { value: "Misamis Oriental Provincial Office", label: "Misamis Oriental Provincial Office" },
        { value: "Misamis Occidental Provincial Office", label: "Misamis Occidental Provincial Office" },
        { value: "Lanao del Norte Provincial Office", label: "Lanao del Norte Provincial Office" },
    ];

    const filteredCheckData = data.filter((item: any) => {
        const matchesSearchTerm = item.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            convertDate(item.CHECKTIME).localeTime12HourFormat.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.CHECKTYPE.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilterType = filterType === 'All' || convertCheckType(item?.CHECKTYPE) === filterType;
        const matchesDept = filterDept === 'All' || item.deptid === filterDept;

        return matchesSearchTerm && matchesFilterType && matchesDept;
    });

    return (
        <div className=' relative w-xl p-2 m-4 border border-border bg-primary-foreground min-h-[130px]'>
            <div className='flex p-4 justify-between items-center bg-primary mb-2'>
                <p className='text-white '>TODAY'S ATTENDANCE</p>
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

            <div className="flex gap-2 py-2 flex-wrap">
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
                {/* Department Filter */}
                <select
                    value={filterDept}
                    onChange={e => setFilterDept(e.target.value)}
                    className="p-2 border border-border text-primary rounded ml-2"
                >
                    <option value="All">All Office</option>
                    {departmentOptions.map((dept) => (
                        <option key={dept.value} value={dept.value}>{dept.label}</option>
                    ))}
                </select>
            </div>

            <div className="overflow-auto bg-primary-foreground max-h-full">
                <Table tableName="attendance">
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
                                <TableCell className="font-small">{item?.full_name} 
                                   <br />
                                   <span className=' text-[7px]'>{item?.deptid}</span>
                                </TableCell>
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

export default DashboardTableAttendance;