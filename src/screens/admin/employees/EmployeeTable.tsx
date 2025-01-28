import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useEffect, useState } from "react";
import axios from '../../../plugin/axios';
import ViewButton from "./ViewButton";
import EditProfile from "./EditProfile";
import { ListIcon, Search } from "lucide-react";
import { getDepartmentName } from "@/helper/department";
import { convertStatus } from "@/helper/convert-status";

function EmployeeTable() {
    const [employees, setEmployees] = useState<any>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [departments, setDepartments] = useState([]);
   
    function usersAll() {
        axios.get('users/all-users/', {
            headers: {
                Authorization: `Token ${localStorage.getItem("accessToken")}`,
            },
        }).then((e:any) => {
            setEmployees(e.data);
        });
    }
    
  
    const getAllDepartments = async () => {
      axios.get('department/all/', {
        headers: {
          Authorization: `Token ${localStorage.getItem("accessToken")}`,
        },
      }).then((response) => {
        setDepartments(response.data);
      }).catch(error => {
        console.error("There was an error fetching the departments!", error);
      });
    };

   
 

    useEffect(() => {
        usersAll()
        getAllDepartments()
        
    }, []);



    

  

    


    const filteredEmployee = employees? 
    employees.filter((employee: any) => {
        const matchesSearchTerm = employee.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearchTerm;
    }) : [];



    return (
        
        <div id="printss" className='  relative flex flex-col gap-4 w-xl p-2 m-4 border border-border bg-primary-foreground rounded-md min-h-[130px]'>
            <div className='flex p-4 justify-between items-center bg-primary mb-2'>
                <p className='text-white '>LIST OF EMPLOYEE</p>
                <ListIcon className='text-6xl text-white' />
            </div>
            
            {/* <div className="pb-5">
                <p className="font-sans text-primary text-2xl font-semibold">LIST OF OFFICE</p>
            </div> */}

            <div className='flex items-center content-center justify-between py-2 '>
                <div className=' h-8 w-1/2 flex gap-2'>
                  <Search className='text-primary mr-2 ' />
                <input
                    type="text"
                    placeholder=" Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="outline-none  focus:outline-primary  border pl-2 h-full border-border rounded w-full text-foreground bg-primary-foreground"
                />  
                </div>
                

                <div></div>
            </div>
          
            <div className="  ">
                <Table >
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[30px] border border-border text-white sticky top-0 bg-primary text-md ">No.</TableHead>
                            <TableHead className="text-white border border-border text-md sticky top-0 bg-primary cursor-pointer">Employee</TableHead>
                            <TableHead className="text-white border border-border text-md sticky top-0 bg-primary cursor-pointer">Office</TableHead>
                            <TableHead className="text-white border border-border text-md sticky top-0 bg-primary cursor-pointer">Status</TableHead>
                            <TableHead className="text-white border border-border text-md sticky top-0 bg-primary cursor-pointer">Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {filteredEmployee.length  !== 0 ? filteredEmployee.map((employee: any, index: any) => (
                            <TableRow key={index} className="border border-border">
                                <TableCell >{index +1}</TableCell>
                                <TableCell >{employee?.full_name}</TableCell>
                                <TableCell >{getDepartmentName(employee.deptid)}</TableCell>
                                <TableCell >{convertStatus(employee?.status)}</TableCell>
                                <TableCell >
                                <div className="flex items-center justify-center gap-3">
                                    <ViewButton employee={employee} activityId={employee.uid} />
                                    
                                    <EditProfile employee={employee} departments={departments} getAllUsers={usersAll}  />
                                </div>
                                
                                </TableCell>
                            </TableRow>
                        )):
                            <TableRow>
                                <TableCell className="text-center border border-border" colSpan={5}>No employee found</TableCell>
                            </TableRow>
                        }
                    </TableBody>
                </Table>
            </div>

            {/* <div className="flex  gap-4">
                
            
                <Button className={employees.previous?"":" bg-card text-foreground me-1"} variant={employees.previous?"default":"ghost"}  onClick={()=>{
                        employees.previous?getNextAttendace(removeBaseUrl(employees.previous)):""
                    }}>
                        Prev
                </Button>
                <Button onClick={()=>{

                    console.log(removeBaseUrl(employees.next)[0] == "h")

                    if (removeBaseUrl(employees.next)[0] == "h") {
                        employees.next?getNextAttendace(removeBaseUrl(employees.next)):""
                        
                    }else{
                        employees.next?getNextAttendace2(removeBaseUrl(employees.next)):""
                    }


                    }}>Next
                </Button>
               
            </div> */}
        </div>
        
    );
}

export default EmployeeTable;
