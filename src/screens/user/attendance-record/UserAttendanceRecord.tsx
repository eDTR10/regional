import ReportTable from './table/ReportTable'
 
/**
 * Full-screen layout — mirrors UserEmployeeStatus exactly:
 * - pt-[72px] clears the fixed top navbar (adjust if your navbar height differs)
 * - flex-1 + overflow-hidden lets ReportTable own its own internal scroll
 */
const UserAttendanceRecord = () => {
    return (
        <div className="flex flex-col h-full w-full overflow-hidden pt-[72px]">
            <div className="flex-1 overflow-hidden animate__animated animate__slideInRight">
                <ReportTable />
            </div>
        </div>
    )
}
 
export default UserAttendanceRecord