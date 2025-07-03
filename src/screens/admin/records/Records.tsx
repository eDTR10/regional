import { Button } from '@/components/ui/button';
import axios from './../../../plugin/axios';
import  { useEffect, useState } from 'react'
import Select from 'react-select'
import Swal from 'sweetalert2';

// Define the options type
interface Option {
  value: string;
  label: string;
}

// Sample options

function Records() {
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([])
  const [selectedDate, setSelectedDate] = useState('')
  const [timeIn, setTimeIn] = useState('')
  const [timeOut, setTimeOut] = useState('')
  const [isTimeInEnabled, setIsTimeInEnabled] = useState(false)
  const [isTimeOutEnabled, setIsTimeOutEnabled] = useState(false)
  const [employees, setEmployees] = useState<any>([]);
  const handleChange = (selected: any) => {
    setSelectedOptions(selected)
  }


    function usersAll() {
        axios.get('users/all-users/', {
            headers: {
                Authorization: `Token ${localStorage.getItem("accessToken")}`,
            },
        }).then((e:any) => {
            console.log(e.data);
            setEmployees(e.data);
        });
    }


     useEffect(() => {
            usersAll()
            
        }, []);


       
  return (
    <div className="animate__animated animate__slideInRight flex flex-col w-full mt-16 sm:mt-20 overflow-hidden min-h-screen">
      <div className='relative p-4 flex flex-col gap-4 w-xl m-4 border border-border bg-primary-foreground rounded-md min-h-[130px]'>
        

        <h1>Select single or multple email here:</h1>
        
        
        {/* Existing Select component */}
        <Select
          isMulti
          name="options"
          options={employees}
          getOptionLabel={(option:any) => option?.email}
          getOptionValue={(option:any)=>option?.uid} // Assuming full_name is the field to display
          className="basic-multi-select"
          classNamePrefix="select"
          value={selectedOptions}
          onChange={handleChange}
          placeholder="Select options..."
        />
        
        {/* Display selected values */}
        <div className="mt-4">
          <h3 className="text-sm font-medium">Selected User:</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedOptions.map((option:any) => (
              <span 
                key={option.uid }
                className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
              >
                {option.email}
              </span>
            ))}
          </div>
        </div>
        
        
        
        
        
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-4">
          {/* Date Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Date</label>
            <input 
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border rounded-md p-2"
            />
          </div>

          {/* Time Inputs Container */}
          <div className="flex gap-4">
            {/* Time In */}
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  checked={isTimeInEnabled}
                  onChange={(e) => setIsTimeInEnabled(e.target.checked)}
                  className="w-4 h-4"
                />
                <label className="text-sm font-medium">Time In</label>
              </div>
              <input 
                type="time"
                value={timeIn}
                onChange={(e) => setTimeIn(e.target.value)}
                disabled={!isTimeInEnabled}
                className={`border rounded-md p-2 ${!isTimeInEnabled ? 'bg-gray-100' : ''}`}
              />
            </div>

            {/* Time Out */}
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  checked={isTimeOutEnabled}
                  onChange={(e) => setIsTimeOutEnabled(e.target.checked)}
                  className="w-4 h-4"
                />
                <label className="text-sm font-medium">Time Out</label>
              </div>
              <input 
                type="time"
                value={timeOut}
                onChange={(e) => setTimeOut(e.target.value)}
                disabled={!isTimeOutEnabled}
                className={`border rounded-md p-2 ${!isTimeOutEnabled ? 'bg-gray-100' : ''}`}
              />
            </div>
          </div>
        </div>

        <Button onClick={()=>{

             let data:any = []


             selectedOptions.map((employee:any) => {

             

                 if (timeIn) {
                    const timeInDateTime = `${selectedDate}T${timeIn}:00`;
      data = [...data, {
        "USERID": employee.uid,
        "CHECKTIME": timeInDateTime,
        "CHECKTYPE": "I",
        "VERIFYCODE": 1,
        "SENSORID": 1
      }]
                    
                 }
                 
                 if (timeOut) {

                    const timeOutDateTime = `${selectedDate}T${timeOut}:00`;
      data = [...data, {
        "USERID": employee.uid,
        "CHECKTIME": timeOutDateTime,
        "CHECKTYPE": "o",
        "VERIFYCODE": 1,
        "SENSORID": 1
      }]
                 }


        
        } )


        console.log("Data to be sent:", data);



        Swal.fire({
    title: 'Confirm Record Addition',
    text: `Are you sure you want to add attendance records for ${selectedOptions.length} employee(s)?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, proceed',
    cancelButtonText: 'No, cancel',
    reverseButtons: true,
    // Add custom button styles
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    customClass: {
      confirmButton: 'swal2-confirm',
      cancelButton: 'swal2-cancel'}
  }).then((result) => {
    if (result.isConfirmed) {
      // Proceed with the axios request
      axios.post('checkinoutregion/bulk/', data, {
        headers: {
          Authorization: `Token ${localStorage.getItem("accessToken")}`,
        },
      }).then((response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Records Added Successfully',
          text: 'The attendance records have been added successfully.',
        });

        setSelectedOptions([]);
        setSelectedDate('');
        setTimeIn('');
        setTimeOut('');
        setIsTimeInEnabled(false);
        setIsTimeOutEnabled(false);
        console.log("Response:", response.data);
      }).catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to add attendance records. Please try again.',
        });
        console.error("Error:", error);
      });
    }
  });
           

            

        }}
        >Add Records</Button>

        
      </div>
    </div>
  )
}

export default Records