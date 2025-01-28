

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

import { ComboboxDemo } from "../inputs/dropdown";
import axios from "./../../../../plugin/axios";

import { convertCheckType } from "@/helper/check-type";
import InputText2 from "@/components/input/InputText2";
import { Button } from "@/components/ui/button";
import { convertDate } from "@/helper/date-time";
import Swal from "sweetalert2";
import PrintButton from "../printDTR/PrintDTR";
import { Skeleton } from "@/components/ui/skeleton";
import { StickyNote } from "lucide-react";

function ReportTable() {
  const [inputData, setInputData] = useState({
    "userId": null,
    "fromDate": "",
    "toDate": ""
  })
  const getMonthAndYear = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1; // Months are zero-indexed, so add 1
    const year = date.getFullYear();
  
    return { month, year };
  };


  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)



  const [data, setData] = useState<any>([])
  const [printableData, setPrintableData] = useState([])
  const [users, setUsers] = useState<any>([])


  function getAttendace() {
    axios.get(`${import.meta.env.VITE_POINT}/all`, {
      headers: {
        Authorization: `Token ${localStorage.getItem('accessToken')}`,
      },
    }).then((e) => {
      setData(e.data)
    })
  }

  function getAttendaceCon() {
    axios.post(`${import.meta.env.VITE_POINT}/filter_by_user_date/`, {
      "userId": localStorage.getItem('selectedID'),
      "fromDate": inputData.fromDate,
      "toDate": inputData.toDate
    }

      , {
        headers: {
          Authorization: `Token ${localStorage.getItem('accessToken')}`,
        },
      }).then((e) => {
        setData(e.data)
        setPrintableData(e.data)
        setShow(true)
        Swal.fire({
          icon: "success",
          title: "Table updated",
          showConfirmButton: false,
          timer: 2000
        });
      })
  }

  function getNextAttendace(url: any) {
    axios.get(`${url}`, {
      headers: {
        Authorization: `Token ${localStorage.getItem('accessToken')}`,
      },
    }).then((e) => {
      setData(e.data)
    })
  }





  function getUsers() {
    setLoading(true)
    axios.get(`users/all-users/`, {
      headers: {
        Authorization: `Token ${localStorage.getItem('accessToken')}`,
      },
    }).then((e) => {
      setUsers(e.data)
      setTimeout(() => {

        setLoading(false)
      }, 500)

    })

  }


  useEffect(() => {
    let isMounted = true; // To ensure it only runs once

    if (isMounted) {
      localStorage.setItem('selectedName', '')
      getAttendace();
      getUsers();
    }

    return () => {
      isMounted = false; // Clean up
    };
  }, []);




  function removeBaseUrl(fullUrl: string): string {
    const baseUrl =  `${import.meta.env.VITE_URL}/api/v1/`;

    // If the full URL starts with the base URL, remove it
    if (fullUrl.startsWith(baseUrl)) {
      return fullUrl.replace(baseUrl, "");
    }

    // If the base URL is not found, return the original URL
    return fullUrl;
  }

  const [sortConfig, setSortConfig] = useState<{ key: string, direction: string }>({
    key: 'CHECKTIME', // default sorting by 'full_name'
    direction: 'descingding', // default sorting direction
  });

  // Sorting function
  const sortedData = data?.results?.sort((a: any, b: any) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  // Function to request a new sort
  const requestSort = (key: string) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  function formatDateRange(fromDate: any, toDate: any) {
    const from = new Date(fromDate);
    const to = new Date(toDate);

    // Extracting parts of the date
    const fromDay = from.getDate();
    const toDay = to.getDate();
    const month = from.toLocaleString('en-US', { month: 'long' });
    const year = from.getFullYear();

    // Formatting the output
    return `${month} ${fromDay}-${toDay}, ${year}`;
  }




  return (
    <div id="printss" className='  relative flex flex-col gap-4  mt-20 w-xl p-2 m-4 border border-border bg-primary-foreground rounded-md min-h-[130px]'>
      <div className='flex p-4 justify-between items-center bg-primary mb-2'>
                <p className='text-white '>LIST OF ATTENDANCE</p>
                <StickyNote className='text-6xl text-white' />
            </div>
      <form onSubmit={(e) => {
        e.preventDefault()
        if (localStorage.getItem('selectedName')) {
          getAttendaceCon()
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: 'Employee\'s name is blank...',
            showConfirmButton: false,

          });
        }

      }} className=" flex sm:flex-col items-end gap-2">

        <ComboboxDemo users={users} inputData={inputData.userId} setInputData={setInputData} />
        <div className=" flex  sm:flex gap-2 w-full">

          <InputText2 label="From:" value={inputData.fromDate} onChange={(e: any) => {
            setInputData({ ...inputData, fromDate: e.target.value })
          }} className=" text-foreground flex justify-between" type="date" />

          <InputText2
            className=" text-foreground "
            value={inputData.toDate} onChange={(e: any) => {
              setInputData({ ...inputData, toDate: e.target.value })
            }}
            label="To:" type="date" />



        </div>

        <Button className=" sm:w-full">
          Filter
        </Button>
        <div className={show ? " sm:w-full w-[400px]" : " sm:w-full w-[400px]  cursor-not-allowed "}>
          <PrintButton name={localStorage.getItem('selectedName')}
            data={printableData}
            selectedYear={getMonthAndYear(inputData.fromDate).year}
                selectedMonth={getMonthAndYear(inputData.fromDate).month}
            show={show}
            date={formatDateRange(inputData.fromDate, inputData.toDate)}
          />

        </div>


      </form >

      <div className="overflow-auto bg-primary-foreground max-h-full">
        <Table >
          <TableHeader>
            <TableRow>


              <TableHead
                className="w-[170px] border border-border text-white sticky top-0 bg-primary cursor-pointer"
                onClick={() => requestSort('full_name')}
              >
                Employee name {sortConfig.key === 'full_name' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
              </TableHead>

              <TableHead
                className="text-white border border-border text-md sticky top-0 bg-primary cursor-pointer"
                onClick={() => requestSort('CHECKTIME')}
              >
                Checked date {sortConfig.key === 'CHECKTIME' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
              </TableHead>

              <TableHead
                className="text-white border border-border text-md sticky top-0 bg-primary cursor-pointer"
                onClick={() => requestSort('CHECKTIME')}
              >
                Checked time {sortConfig.key === 'CHECKTIME' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
              </TableHead>

              <TableHead
                className="text-white border border-border text-md sticky top-0 bg-primary cursor-pointer"
                onClick={() => requestSort('CHECKTYPE')}
              >
                Checked type {sortConfig.key === 'CHECKTYPE' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
              </TableHead>
            </TableRow>
          </TableHeader>
          {loading ?
            <TableBody>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((e: any) => (
                <TableRow key={e} className="border border-border">
                  <TableCell colSpan={4}>
                    <Skeleton className=" w-full h-[30px] py-3" />
                  </TableCell>
                </TableRow>
              ))}



            </TableBody>

            :
            <TableBody>
              {sortedData ? sortedData.map((item: any, index: any) => (
                <TableRow key={index} className="border border-border">
                  <TableCell className="font-small">{item?.full_name}</TableCell>
                  <TableCell>{convertDate(item.CHECKTIME).customLongDateFormat}</TableCell>
                  <TableCell>{convertDate(item?.CHECKTIME).localeTime12HourFormat}</TableCell>
                  <TableCell>{convertCheckType(item?.CHECKTYPE)}</TableCell>
                </TableRow>
              )) : ""}
            </TableBody>





          }

        </Table>
      </div>

      <div className=" flex gap-5">
        <Button className={data.previous ? "" : " bg-card text-foreground"} variant={data.previous ? "default" : "ghost"} onClick={() => {
          data.previous ? getNextAttendace(removeBaseUrl(data.previous)) : ""
        }}>
          Prev
        </Button>
        <Button onClick={() => {

          console.log(removeBaseUrl(data.next)[0] == "c")

          if (removeBaseUrl(data.next)[0] == "c") {
            data.next ? getNextAttendace(removeBaseUrl(data.next)) : ""

          }


        }}>Next
        </Button>
      </div>
    </div>
  )
}

export default ReportTable