import { useEffect, useState, useCallback } from 'react';
import { PlusSquareIcon, Search, Trash2, ChevronUp, ChevronDown, ChevronsUpDown, Activity } from 'lucide-react';
import axios from '../../../../plugin/axios';
import Swal from 'sweetalert2';

import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { convertDate } from '@/helper/date-time';
import { convertStatus } from '@/helper/convert-status';
import InputText2 from '@/components/input/InputText2';
import { Textarea } from '@/components/ui/textarea';

type SortKey = 'full_name' | 'fromDate' | 'toDate' | 'status' | 'description';
type SortDir = 'asc' | 'desc' | null;

const STATUS_FILTERS = [
    { label: 'All',              value: 'All' },
    { label: 'In Office',        value: 'In Office' },
    { label: 'Out of Office',    value: 'Out of Office' },
    { label: 'On Travel',        value: 'On Travel' },
    { label: 'On Leave',         value: 'On Leave' },
    { label: 'Work from Home',   value: 'Work from Home' },
    { label: 'Holiday',          value: 'Holiday' },
    { label: 'Off Set',          value: 'Off Set' },
    { label: 'Work Suspension',  value: 'Work Suspension' },
    { label: 'Halfday',          value: 'Halfday' },
];

const STATUS_COLORS: Record<string, string> = {
    'In Office':        'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
    'Out of Office':    'bg-orange-50 text-orange-600 border border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20',
    'On Travel':        'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
    'On Leave':         'bg-red-50 text-red-600 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
    'Work from Home':   'bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20',
    'Holiday':          'bg-pink-50 text-pink-600 border border-pink-200 dark:bg-pink-500/10 dark:text-pink-400 dark:border-pink-500/20',
    'Off Set':          'bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20',
    'Work Suspension':  'bg-gray-100 text-gray-600 border border-gray-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
    'Halfday':          'bg-cyan-50 text-cyan-700 border border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20',
};

const TABLE_COLUMNS: { key: SortKey; label: string; className?: string }[] = [
    { key: 'full_name',   label: 'Full Name',   className: 'w-52' },
    { key: 'fromDate',    label: 'From Date',   className: 'w-44' },
    { key: 'toDate',      label: 'To Date',     className: 'w-44' },
    { key: 'status',      label: 'Status',      className: 'w-44' },
    { key: 'description', label: 'Description', className: 'w-60' },
];

const SortIcon = ({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey | null; sortDir: SortDir }) => {
    if (sortKey !== col) return <ChevronsUpDown className="w-3 h-3 opacity-50 shrink-0" />;
    if (sortDir === 'asc') return <ChevronUp className="w-3 h-3 text-white shrink-0" />;
    return <ChevronDown className="w-3 h-3 text-white shrink-0" />;
};

const UserEmployeeStatusTable = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [data, setData]             = useState([]);
    const [sortKey, setSortKey]       = useState<SortKey | null>(null);
    const [sortDir, setSortDir]       = useState<SortDir>(null);

    const [isAddDialogOpen, setIsAddDialogOpen]       = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [activityToDelete, setActivityToDelete]     = useState<any>(null);

    const [activity,    setActivity]    = useState('');
    const [period,      setPeriod]      = useState('');
    const [fromDate,    setFromDate]    = useState('');
    const [toDate,      setToDate]      = useState('');
    const [description, setDescription] = useState('');

    const userJson   = localStorage.getItem("user");
    const userObject = userJson ? JSON.parse(userJson) : null;

    /* ── Sort handler ── */
    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            if (sortDir === 'asc') { setSortDir('desc'); }
            else                   { setSortKey(null); setSortDir(null); }
        } else {
            setSortKey(key);
            setSortDir('asc');
        }
    };

    /* ── Data fetching ── */
    const fetchData = useCallback(async () => {
        try {
            const res = await axios.get('activity/', {
                headers: {
                    Authorization: `Token ${localStorage.getItem("accessToken")}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });
            setData(res.data);
        } catch (err: any) {
            console.error('Fetch error:', err.response ?? err.message);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const addActivity = async () => {
        try {
            await axios.post('activity/', {
                USERID: userObject?.uid,
                fromDate, toDate, description,
                status: activity,
                period: period || 1,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem("accessToken")}`,
                }
            });
            Swal.fire({ icon: "success", title: "Updated Successfully...", showConfirmButton: false, timer: 2000 });
            setIsAddDialogOpen(false);
            fetchData();
            setActivity(''); setPeriod(''); setFromDate(''); setToDate(''); setDescription('');
        } catch (err: any) {
            Swal.fire({ icon: "error", title: "Oops...", text: err.response?.data?.non_field_errors?.[0], showConfirmButton: false });
        }
    };

    const deleteActivity = async () => {
        try {
            await axios.delete(`activity/delete/${activityToDelete.activity_id}/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem("accessToken")}`,
                }
            });
            Swal.fire({ icon: "success", title: "Deleted Successfully...", showConfirmButton: false, timer: 2000 });
            setIsDeleteDialogOpen(false);
            fetchData();
        } catch (err: any) {
            Swal.fire({ icon: "error", title: "Oops...", text: err.response?.data?.non_field_errors?.[0], showConfirmButton: false });
        }
    };

    /* ── Filtered + sorted rows ── */
    const processed = [...data]
        .filter((item: any) => {
            const status = convertStatus(item?.status) ?? '';
            const matchSearch =
                item.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                status.toLowerCase().includes(searchTerm.toLowerCase());
            const matchFilter = filterType === 'All' || status === filterType;
            return matchSearch && matchFilter;
        })
        .sort((a: any, b: any) => {
            if (!sortKey || !sortDir) return 0;
            let va = sortKey === 'status' ? convertStatus(a[sortKey]) : (a[sortKey] ?? '');
            let vb = sortKey === 'status' ? convertStatus(b[sortKey]) : (b[sortKey] ?? '');
            if (typeof va === 'string') va = va.toLowerCase();
            if (typeof vb === 'string') vb = vb.toLowerCase();
            if (va < vb) return sortDir === 'asc' ? -1 : 1;
            if (va > vb) return sortDir === 'asc' ?  1 : -1;
            return 0;
        });

    /* ══════════════════════════════════════════════ */
    return (
        /**
         * Key layout strategy:
         * - flex-col + h-full so this component fills whatever height its parent gives it
         * - The parent (UserEmployeeStatus) already has flex-1 + h-full + overflow-auto,
         *   so we do NOT add overflow here — only the table body scrolls independently.
         */
        <div className="flex flex-col h-full w-full bg-white dark:bg-slate-950 overflow-hidden">

            {/* ── Header ── */}
            <div
                className="flex items-center justify-between px-6 py-4 shrink-0 bg-gradient-to-br from-blue-800 via-blue-600 to-blue-500 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-b border-transparent dark:border-slate-800"
            >
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 rounded-lg p-2">
                        <Activity className="text-white w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-blue-200 text-[10px] font-semibold uppercase tracking-widest leading-none">Employee</p>
                        <p className="text-white text-xl font-bold leading-tight mt-0.5">My Activities</p>
                    </div>
                </div>

                <Button
                    onClick={() => setIsAddDialogOpen(true)}
                    className="bg-white text-blue-700 hover:bg-blue-50 dark:bg-slate-800 dark:text-blue-400 dark:hover:bg-slate-700 font-semibold text-sm px-4 py-2 rounded-lg flex items-center gap-2 shadow-md dark:border dark:border-slate-700"
                >
                    <PlusSquareIcon className="w-4 h-4" />
                    Add Activity
                </Button>
            </div>

            {/* ── Search + filter chips ── */}
            <div className="px-6 pt-4 pb-3 border-b border-gray-100 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-950">
                <div className="flex items-center gap-3 mb-3">
                    <div className="relative w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 w-4 h-4 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search by name, status, or description..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-slate-800 rounded-lg bg-gray-50 dark:bg-slate-900
                                       text-gray-700 dark:text-slate-300 placeholder-gray-400 dark:placeholder-slate-500
                                       outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 dark:focus:ring-blue-500 transition"
                        />
                    </div>
                    <span className="ml-auto text-xs text-gray-400 dark:text-slate-500 font-medium tabular-nums">
                        {processed.length} record{processed.length !== 1 ? 's' : ''}
                    </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                    {STATUS_FILTERS.map(f => (
                        <button
                            key={f.value}
                            onClick={() => setFilterType(f.value)}
                            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all whitespace-nowrap
                                ${filterType === f.value
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm dark:bg-blue-600/20 dark:text-blue-400 dark:border-blue-500/30'
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-600 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-700 dark:hover:border-slate-500 dark:hover:text-slate-200'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Table — takes all remaining vertical space and scrolls internally ── */}
            <div className="flex-1 overflow-auto">
                <Table className="w-full min-w-full">
                    <TableHeader>
                        <TableRow className="border-0">
                            {TABLE_COLUMNS.map(col => (
                                <TableHead
                                    key={col.key}
                                    onClick={() => handleSort(col.key)}
                                    className={`
                                        ${col.className ?? ''}
                                        px-5 py-3 text-xs font-semibold tracking-wider uppercase
                                        text-white bg-blue-600 dark:bg-slate-900
                                        sticky top-0 z-10
                                        border-r border-blue-500/30 dark:border-slate-800 last:border-r-0
                                        cursor-pointer select-none
                                        hover:bg-blue-500 dark:hover:bg-slate-800 transition-colors
                                    `}
                                >
                                    <div className="flex items-center gap-1.5">
                                        {col.label}
                                        <SortIcon col={col.key} sortKey={sortKey} sortDir={sortDir} />
                                    </div>
                                </TableHead>
                            ))}
                            <TableHead className="w-16 px-5 py-3 text-xs font-semibold tracking-wider uppercase text-white bg-blue-600 dark:bg-slate-900 sticky top-0 z-10 select-none border-blue-500/30 dark:border-slate-800">
                                Action
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {processed.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-24 text-gray-400 dark:text-slate-500 text-sm">
                                    <div className="flex flex-col items-center gap-2">
                                        <Activity className="w-8 h-8 opacity-25" />
                                        <span>No activities found</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : processed.map((item: any, idx) => {
                            const statusLabel = convertStatus(item?.status);
                            const badgeClass  = STATUS_COLORS[statusLabel] ?? 'bg-gray-100 text-gray-600 border border-gray-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
                            return (
                                <TableRow
                                    key={idx}
                                    className="border-b border-gray-50 dark:border-slate-800/50 hover:bg-blue-50/40 dark:hover:bg-slate-900/50 transition-colors"
                                >
                                    <TableCell className="px-5 py-3 font-medium text-gray-800 dark:text-slate-200 text-sm whitespace-nowrap">
                                        {item?.full_name}
                                    </TableCell>
                                    <TableCell className="px-5 py-3 text-gray-500 dark:text-slate-400 text-sm whitespace-nowrap">
                                        {convertDate(item?.fromDate).customLongDateFormat}
                                    </TableCell>
                                    <TableCell className="px-5 py-3 text-gray-500 dark:text-slate-400 text-sm whitespace-nowrap">
                                        {convertDate(item?.toDate).customLongDateFormat}
                                    </TableCell>
                                    <TableCell className="px-5 py-3">
                                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${badgeClass}`}>
                                            {statusLabel}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-5 py-3 text-gray-500 dark:text-slate-400 text-sm">
                                        {item?.description}
                                    </TableCell>
                                    <TableCell className="px-5 py-3">
                                        <button
                                            title="Delete"
                                            onClick={() => { setActivityToDelete(item); setIsDeleteDialogOpen(true); }}
                                            className="p-1.5 rounded-lg text-gray-300 dark:text-slate-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* ══════════ ADD DIALOG ══════════ */}
            {/* ══════════ ADD DIALOG ══════════ */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="w-[420px] rounded-xl p-0 overflow-hidden border-0 shadow-2xl dark:bg-slate-900">
                    <div className="px-6 py-5 bg-gradient-to-br from-blue-800 via-blue-600 to-blue-500 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900">
                        <DialogTitle className="text-white text-lg font-bold">Add Activity</DialogTitle>
                        <DialogDescription className="text-blue-200 dark:text-slate-400 text-sm mt-0.5">
                            Fill in the details to log a new activity.
                        </DialogDescription>
                    </div>

                    <div className="px-6 py-5 flex flex-col gap-4 bg-white dark:bg-slate-900">
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <label className="text-xs text-gray-500 dark:text-slate-400 font-medium mb-1 block">Activity Type</label>
                                <Select value={activity} onValueChange={setActivity}>
                                    <SelectTrigger className="text-gray-700 dark:text-slate-300 dark:bg-slate-800 dark:border-slate-700 w-full">
                                        <SelectValue placeholder="Select Activity" />
                                    </SelectTrigger>
                                    <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                                        {[
                                            ['1','In Office'],['2','Out of Office'],['3','On Travel'],
                                            ['4','On Leave'],['5','Work from Home'],['6','Holiday'],
                                            ['7','Off Set'],['8','Work Suspension'],['9','Halfday'],
                                        ].map(([v, l]) => <SelectItem key={v} value={v} className="dark:text-slate-300 dark:focus:bg-slate-700">{l}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex-1">
                                <label className="text-xs text-gray-500 dark:text-slate-400 font-medium mb-1 block">Time Period</label>
                                <Select value={period} onValueChange={setPeriod}>
                                    <SelectTrigger className="text-gray-700 dark:text-slate-300 dark:bg-slate-800 dark:border-slate-700 w-full">
                                        <SelectValue placeholder="Select Period" />
                                    </SelectTrigger>
                                    <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                                        <SelectItem value="1" className="dark:text-slate-300 dark:focus:bg-slate-700">Whole Day</SelectItem>
                                        <SelectItem value="2" className="dark:text-slate-300 dark:focus:bg-slate-700">AM</SelectItem>
                                        <SelectItem value="3" className="dark:text-slate-300 dark:focus:bg-slate-700">PM</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="flex-1">
                                <label className="text-xs text-gray-500 dark:text-slate-400 font-medium mb-1 block">From</label>
                                <InputText2
                                    value={fromDate}
                                    onChange={(e: any) => setFromDate(e.target.value)}
                                    className="text-gray-700 dark:text-slate-300 dark:bg-slate-800 dark:border-slate-700 w-full [color-scheme:light] dark:[color-scheme:dark]"
                                    type="date"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-xs text-gray-500 dark:text-slate-400 font-medium mb-1 block">To</label>
                                <InputText2
                                    value={toDate}
                                    onChange={(e: any) => setToDate(e.target.value)}
                                    className="text-gray-700 dark:text-slate-300 dark:bg-slate-800 dark:border-slate-700 w-full [color-scheme:light] dark:[color-scheme:dark]"
                                    type="date"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 dark:text-slate-400 font-medium mb-1 block">Description</label>
                            <Textarea
                                placeholder="Optional notes..."
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="text-sm text-gray-700 dark:text-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:placeholder-slate-500 resize-none"
                                rows={3}
                            />
                        </div>
                    </div>

                    <DialogFooter className="px-6 pb-5 bg-white dark:bg-slate-900 flex gap-2">
                        <Button variant="outline" className="text-gray-600 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 flex-1" onClick={() => setIsAddDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white flex-1" onClick={addActivity}>
                            Submit
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ══════════ DELETE DIALOG ══════════ */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="w-[380px] rounded-xl p-0 overflow-hidden border-0 shadow-2xl dark:bg-slate-900">
                    <div className="px-6 py-5 bg-gradient-to-r from-red-600 to-red-500 dark:from-red-900/50 dark:to-red-800/50">
                        <DialogTitle className="text-white text-lg font-bold">Confirm Deletion</DialogTitle>
                        <DialogDescription className="text-red-100 dark:text-red-300 text-sm mt-0.5">
                            This action cannot be undone.
                        </DialogDescription>
                    </div>
                    <div className="px-6 py-5 text-sm text-gray-600 dark:text-slate-300 bg-white dark:bg-slate-900">
                        Are you sure you want to delete this activity?
                    </div>
                    <DialogFooter className="px-6 pb-5 bg-white dark:bg-slate-900 flex gap-2">
                        <Button variant="outline" className="text-gray-600 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 flex-1" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white flex-1" onClick={deleteActivity}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UserEmployeeStatusTable;