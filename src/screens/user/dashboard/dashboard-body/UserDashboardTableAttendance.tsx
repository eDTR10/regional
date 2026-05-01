import { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Search, ClipboardList, Filter } from 'lucide-react';
import axios from './../../../../plugin/axios';
import Swal from 'sweetalert2';
import { convertCheckType } from '@/helper/check-type';
import { convertDate } from '@/helper/date-time';

const filterButtons = [
    { label: 'All', value: 'All' },
    { label: 'Time-In', value: 'Time-In' },
    { label: 'Break-In', value: 'Break-In' },
    { label: 'Break-Out', value: 'Break-Out' },
    { label: 'Time-Out', value: 'Time-Out' },
];

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

    const getCheckTypeBadge = (checkType: string) => {
        const type = convertCheckType(checkType);
        const styles: Record<string, string> = {
            'Time-In': 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-800',
            'Time-Out': 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:ring-rose-800',
            'Break-In': 'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:ring-sky-800',
            'Break-Out': 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:ring-amber-800',
        };
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 sm:text-[7px] text-center rounded-full text-xs font-semibold ring-1 ${styles[type] || 'bg-slate-100 text-slate-600 ring-slate-200'}`}>
                {type}
            </span>
        );
    };

    return (
        <div className='relative bg-card border border-border/60 rounded-2xl shadow-sm overflow-hidden'>
            {/* Header */}
            <div className='flex items-center justify-between p-5 border-b border-border/60'>
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10">
                        <ClipboardList className='w-5 h-5 text-primary' />
                    </div>
                    <div>
                        <h3 className='text-base font-semibold text-foreground'>Today's Attendance</h3>
                        <p className='text-xs text-muted-foreground mt-0.5'>{filteredCheckData.length} records</p>
                    </div>
                </div>
            </div>

            {/* Search + Filters */}
            <div className='px-5 py-4 space-y-3 border-b border-border/40 bg-muted/30'>
                {/* Search bar */}
                <div className='relative'>
                    <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                    <input
                        type="text"
                        placeholder="Search by name, time, or type..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 h-9 text-sm border border-border/80 rounded-xl bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                    />
                </div>

                {/* Filter pills */}
                <div className="flex gap-1.5 flex-wrap items-center">
                    <Filter className="w-3.5 h-3.5 text-muted-foreground mr-1" />
                    {filterButtons.map((btn) => (
                        <button
                            key={btn.value}
                            onClick={() => setFilterType(btn.value)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${filterType === btn.value
                                ? 'bg-primary text-white shadow-sm'
                                : 'bg-background text-muted-foreground border border-border/80 hover:bg-accent hover:text-foreground'
                                }`}
                        >
                            {btn.label}
                        </button>
                    ))}

                    {/* Department Filter */}
                    <select
                        value={filterDept}
                        onChange={e => setFilterDept(e.target.value)}
                        className="ml-auto px-3 py-1 text-xs border border-border/80 text-foreground bg-background rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                    >
                        <option value="All">All Offices</option>
                        {departmentOptions.map((dept) => (
                            <option key={dept.value} value={dept.value}>{dept.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-auto max-h-[400px]">
                <Table tableName="attendance">
                    <TableHeader>
                        <TableRow className="border-b border-border/60">
                            <TableHead className="w-[200px] text-xs font-semibold text-muted-foreground uppercase tracking-wider sticky top-0 bg-card py-3 px-5">Name</TableHead>
                            <TableHead className='text-xs font-semibold text-muted-foreground uppercase tracking-wider sticky top-0 bg-card py-3 px-5'>Time</TableHead>
                            <TableHead className='text-xs font-semibold text-muted-foreground uppercase tracking-wider sticky top-0 bg-card py-3 px-5'>Type</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredCheckData.map((item: any, index) => (
                            <TableRow key={index} className='border-b border-border/40 hover:bg-muted/40 transition-colors duration-150'>
                                <TableCell className="py-3 px-5">
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{item?.full_name}</p>
                                        <p className='text-[10px] text-muted-foreground mt-0.5'>{item?.deptid}</p>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 px-5">
                                    <span className="text-sm text-foreground font-mono">{convertDate(item?.CHECKTIME).localeTime12HourFormat}</span>
                                </TableCell>
                                <TableCell className="py-3 px-5 ">
                                    {getCheckTypeBadge(item?.CHECKTYPE)}
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredCheckData.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-12 text-muted-foreground text-sm">
                                    No attendance records found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default DashboardTableAttendance;