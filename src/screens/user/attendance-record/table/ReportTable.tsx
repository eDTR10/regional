import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

import axios from "./../../../../plugin/axios";
import { convertCheckType } from "@/helper/check-type";
import InputText2 from "@/components/input/InputText2";
import { Button } from "@/components/ui/button";
import { convertDate } from "@/helper/date-time";
import Swal from "sweetalert2";
import PrintButton from "./../printDTR/PrintDTR";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ClipboardList,
  LoaderIcon,
  Trash2,
  Search,
  CalendarRange,
} from "lucide-react";

type SortKey = "full_name" | "CHECKTIME" | "CHECKTYPE";
type SortDir = "ascending" | "descending";

const CHECK_TYPE_COLORS: Record<string, string> = {
  "Time-In":    "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  "Time-Out":   "bg-red-50 text-red-600 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
  "Break-In":   "bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  "Break-Out":  "bg-orange-50 text-orange-600 border border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20",
};

const SortIcon = ({
  col,
  sortConfig,
}: {
  col: SortKey;
  sortConfig: { key: string; direction: string };
}) => {
  if (sortConfig.key !== col)
    return <ChevronsUpDown className="w-3 h-3 opacity-50 shrink-0" />;
  if (sortConfig.direction === "ascending")
    return <ChevronUp className="w-3 h-3 text-white shrink-0" />;
  return <ChevronDown className="w-3 h-3 text-white shrink-0" />;
};

const TABLE_COLUMNS: { key: SortKey; label: string; className?: string }[] = [
  { key: "full_name",  label: "Employee Name", className: "w-52" },
  { key: "CHECKTIME",  label: "Checked Date",  className: "w-44" },
  { key: "CHECKTIME",  label: "Checked Time",  className: "w-40" },
  { key: "CHECKTYPE",  label: "Check Type",    className: "w-36" },
];

function ReportTable() {
  const [inputData, setInputData] = useState({
    userId: null,
    fromDate: "",
    toDate: "",
  });

  const getMonthAndYear = (dateString: string) => {
    const date = new Date(dateString);
    return { month: date.getMonth() + 1, year: date.getFullYear() };
  };

  const [show, setShow]                   = useState(false);
  const [loading, setLoading]             = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [data, setData]                   = useState<any>([]);
  const [printableData, setPrintableData] = useState([]);

  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDir }>({
    key: "CHECKTIME",
    direction: "descending",
  });

  const requestSort = (key: SortKey) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  const sortedData = data?.results
    ? [...data.results].sort((a: any, b: any) => {
        const va = a[sortConfig.key] ?? "";
        const vb = b[sortConfig.key] ?? "";
        if (va < vb) return sortConfig.direction === "ascending" ? -1 : 1;
        if (va > vb) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      })
    : [];

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        setDeleteLoading(id);
        await axios.delete(`/checkinoutregion/${id}/`, {
          headers: { Authorization: `Token ${localStorage.getItem("accessToken")}` },
        });
        setDeleteLoading(null);
        Swal.fire({ icon: "success", title: "Deleted!", text: "Record deleted.", timer: 2000, showConfirmButton: false });
        inputData.fromDate && inputData.toDate ? getAttendaceCon() : getAttendace();
      } catch {
        setDeleteLoading(null);
        Swal.fire("Error!", "There was an error deleting the record.", "error");
      }
    }
  };

  function getAttendace() {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_POINT}/by_user/`, {
        headers: { Authorization: `Token ${localStorage.getItem("accessToken")}` },
      })
      .then((e) => { setLoading(false); setData(e.data); });
  }

  function getAttendaceCon() {
    setLoading(true);
    axios
      .post(
        `${import.meta.env.VITE_POINT}/user_filter_by_user_date/`,
        { fromDate: inputData.fromDate, toDate: inputData.toDate },
        { headers: { Authorization: `Token ${localStorage.getItem("accessToken")}` } }
      )
      .then((e) => {
        setData(e.data);
        setPrintableData(e.data);
        setLoading(false);
        setShow(true);
        Swal.fire({ icon: "success", title: "Table updated", showConfirmButton: false, timer: 2000 });
      });
  }

  function removeBaseUrl(fullUrl: string): string {
    const baseUrl = `${import.meta.env.VITE_URL}/api/v1/`;
    return fullUrl?.startsWith(baseUrl) ? fullUrl.replace(baseUrl, "") : fullUrl;
  }

  function getNextAttendace(url: any) {
    axios
      .get(`${url}`, { headers: { Authorization: `Token ${localStorage.getItem("accessToken")}` } })
      .then((e) => setData(e.data));
  }

  function formatDateRange(fromDate: any, toDate: any) {
    const from = new Date(fromDate);
    const to   = new Date(toDate);
    return `${from.toLocaleString("en-US", { month: "long" })} ${from.getDate()}-${to.getDate()}, ${from.getFullYear()}`;
  }

  useEffect(() => {
    localStorage.setItem("selectedName", "");
    getAttendace();
  }, []);

  const hasPrev = Boolean(data.previous);
  const hasNext = Boolean(data.next);

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-slate-950 overflow-hidden">

      {/* ── Blue gradient header ── */}
      <div
        className="flex items-center justify-between px-6 py-4 shrink-0 bg-gradient-to-br from-blue-800 via-blue-600 to-blue-500 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-b border-transparent dark:border-slate-800"
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/20 rounded-lg p-2">
            <ClipboardList className="text-white w-5 h-5" />
          </div>
          <div>
            <p className="text-blue-200 text-[10px] font-semibold uppercase tracking-widest leading-none">Attendance</p>
            <p className="text-white text-xl font-bold leading-tight mt-0.5">Biometric Records</p>
          </div>
        </div>

        {/* Record label badge */}
        <div className="bg-white/15 rounded-lg px-3 py-1.5 text-white text-xs font-medium">
          Attendance Records
        </div>
      </div>

{/* ── Filter toolbar ── */}
{/* ── Filter toolbar ── */}
<div className="px-4 py-3 pb-0 border-b border-gray-100 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-950">
  <form
    onSubmit={(e) => {
      e.preventDefault();
      if (localStorage.getItem("accessToken")) {
        getAttendaceCon();
      } else {
        Swal.fire({ icon: "error", title: "Oops...", text: "Not authenticated.", showConfirmButton: false });
      }
    }}
    className="flex flex-row items-center gap-3 md:flex-col md:gap-2"
  >
    {/* ── Date inputs row ── */}
    <div className="flex items-center gap-2 flex-1 md:w-full md:flex-none">
      {/* FROM */}
      <div className="flex-1 flex items-center gap-1.5 h-10 px-3 rounded-lg border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 min-w-0">
        <CalendarRange className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500 shrink-0" />
        <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest whitespace-nowrap select-none">
          From
        </span>
        <input
          type="date"
          value={inputData.fromDate}
          onChange={(e) => setInputData({ ...inputData, fromDate: e.target.value })}
          className="flex-1 min-w-0 text-gray-700 dark:text-slate-300 text-sm bg-transparent outline-none border-none cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
        />
      </div>

      {/* Arrow */}
      <span className="text-gray-300 dark:text-slate-600 text-sm shrink-0">→</span>

      {/* TO */}
      <div className="flex-1 flex items-center gap-1.5 h-10 px-3 rounded-lg border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 min-w-0">
        <CalendarRange className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500 shrink-0" />
        <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest whitespace-nowrap select-none">
          To
        </span>
        <input
          type="date"
          value={inputData.toDate}
          onChange={(e) => setInputData({ ...inputData, toDate: e.target.value })}
          className="flex-1 min-w-0 text-gray-700 dark:text-slate-300 text-sm bg-transparent outline-none border-none cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
        />
      </div>
    </div>

    {/* ── Action buttons row ── */}
    <div className="flex items-center gap-2 shrink-0 md:w-full">
      {/* Filter button */}
      <Button
        type="submit"
        disabled={loading}
        className="h-10 px-5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-sm
                   rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-all md:flex-1"
      >
        {loading
          ? <LoaderIcon className="w-3.5 h-3.5 animate-spin" />
          : <Search className="w-3.5 h-3.5" />
        }
        {loading ? "Loading..." : "Filter"}
      </Button>

      {/* Divider */}
      <div className="h-5 w-px bg-gray-200 dark:bg-slate-800 shrink-0" />

      {/* Print / PDF button */}
      <div
        className={`shrink-0 transition-opacity duration-200 ${show ? "opacity-100" : "opacity-30 pointer-events-none"}`}
        title={show ? "Download PDF" : "Apply a date filter first"}
      >
        <PrintButton
          name={JSON.parse(localStorage.getItem("user") || "{}").full_name}
          data={printableData}
          selectedYear={getMonthAndYear(inputData.fromDate).year}
          selectedMonth={getMonthAndYear(inputData.fromDate).month}
          show={show}
          date={formatDateRange(inputData.fromDate, inputData.toDate)}
        />
      </div>

      {/* Record count */}
      {sortedData.length > 0 && (
        <span className="text-xs text-gray-400 dark:text-slate-500 font-medium tabular-nums shrink-0 md:hidden">
          {sortedData.length} rec{sortedData.length !== 1 ? "s" : ""}
        </span>
      )}
    </div>
  </form>
</div>

      {/* ── Scrollable table ── */}
      <div className="flex-1 overflow-auto">
        <Table className="w-full min-w-full">
          <TableHeader>
            <TableRow className="border-0">
              {TABLE_COLUMNS.map((col, i) => (
                <TableHead
                  key={`${col.key}-${i}`}
                  onClick={() => requestSort(col.key)}
                  className={`
                    ${col.className ?? ""}
                    px-5 py-3 text-xs font-semibold tracking-wider uppercase
                    text-white bg-blue-600 dark:bg-slate-900 sticky top-0 z-10
                    border-r border-blue-500/30 dark:border-slate-800
                    cursor-pointer select-none
                    hover:bg-blue-500 dark:hover:bg-slate-800 transition-colors
                  `}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    <SortIcon col={col.key} sortConfig={sortConfig} />
                  </div>
                </TableHead>
              ))}
              <TableHead className="w-16 px-5 py-3 text-xs font-semibold tracking-wider uppercase text-white bg-blue-600 dark:bg-slate-900 sticky top-0 z-10 select-none">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          {loading ? (
            <TableBody>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <TableRow key={n} className="border-b border-gray-50 dark:border-slate-800/50">
                  <TableCell colSpan={5} className="px-5 py-3">
                    <Skeleton className="w-full h-7 rounded-lg dark:bg-slate-800" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody>
              {sortedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-24 text-gray-400 dark:text-slate-500 text-sm">
                    <div className="flex flex-col items-center gap-2">
                      <ClipboardList className="w-8 h-8 opacity-25" />
                      <span>No records found. Use the filter above to load data.</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                sortedData.map((item: any, index: any) => {
                  const checkTypeLabel = convertCheckType(item?.CHECKTYPE);
                  const badgeClass = CHECK_TYPE_COLORS[checkTypeLabel] ?? "bg-gray-100 text-gray-600 border border-gray-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700";
                  return (
                    <TableRow
                      key={index}
                      className="border-b border-gray-50 dark:border-slate-800/50 hover:bg-blue-50/40 dark:hover:bg-slate-900/50 transition-colors"
                    >
                      <TableCell className="px-5 py-3 font-medium text-gray-800 dark:text-slate-200 text-sm whitespace-nowrap">
                        {item?.full_name}
                      </TableCell>
                      <TableCell className="px-5 py-3 text-gray-500 dark:text-slate-400 text-sm whitespace-nowrap">
                        {convertDate(item.CHECKTIME).customLongDateFormat}
                      </TableCell>
                      <TableCell className="px-5 py-3 text-gray-500 dark:text-slate-400 text-sm whitespace-nowrap">
                        {convertDate(item?.CHECKTIME).localeTime12HourFormat}
                      </TableCell>
                      <TableCell className="px-5 py-3">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${badgeClass}`}>
                          {checkTypeLabel}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-3">
                        <button
                          title="Delete"
                          onClick={() => handleDelete(item.attendance_number)}
                          disabled={deleteLoading === item.attendance_number}
                          className="p-1.5 rounded-lg text-gray-300 dark:text-slate-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-50"
                        >
                          {deleteLoading === item.attendance_number
                            ? <LoaderIcon className="w-4 h-4 animate-spin text-red-400" />
                            : <Trash2 className="w-4 h-4" />
                          }
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          )}
        </Table>
      </div>

      {/* ── Pagination ── */}
      {(hasPrev || hasNext) && (
        <div className="px-6 py-3 border-t border-gray-100 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-950 flex items-center justify-between">
          <Button
            variant="outline"
            disabled={!hasPrev}
            onClick={() => hasPrev && getNextAttendace(removeBaseUrl(data.previous))}
            className="text-sm font-medium text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 hover:border-blue-300 dark:hover:border-slate-600 hover:text-blue-600 dark:hover:text-white disabled:opacity-40"
          >
            ← Previous
          </Button>
          <Button
            disabled={!hasNext}
            onClick={() => {
              const next = removeBaseUrl(data.next);
              if (next?.[0] === "c") getNextAttendace(next);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-40"
          >
            Next →
          </Button>
        </div>
      )}
    </div>
  );
}

export default ReportTable;