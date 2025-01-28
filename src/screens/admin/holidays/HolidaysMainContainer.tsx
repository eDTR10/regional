import HolidayTable from "./holiday-body/HolidayTable"

function HolidaysMainContainer() {
  return (
    <div className="flex-1 h-full overflow-auto">
      <div className="flex items-center mt-20 justify-between">
      </div>
      <div className="animate__animated animate__slideInRight">
        <HolidayTable />
      </div>
    </div>
  )
}

export default HolidaysMainContainer