import UserEmployeeStatusTable from './employee-status-body/UserEmployeeStatusTable'
 
/**
 * Full-screen layout:
 * - flex-col so children stack vertically
 * - h-screen (or h-full if a parent already constrains height) minus the top navbar height
 * - overflow-hidden here; the table component handles its own internal scroll
 */
const UserEmployeeStatus = () => {
    return (
        <div className="flex flex-col h-full w-full overflow-hidden pt-[72px]">
            {/* pt-[72px] pushes content below the fixed top navbar — adjust if your navbar height differs */}
            <div className="flex-1 overflow-hidden animate__animated animate__slideInRight">
                <UserEmployeeStatusTable />
            </div>
        </div>
    )
}
 
export default UserEmployeeStatus