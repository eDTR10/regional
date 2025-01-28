import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import { EyeIcon,} from "lucide-react";
import { useState } from "react";
import axios from '../../../plugin/axios';
import { Card } from "@/components/ui/card";
import { getDepartmentName } from "@/helper/department";
import { getActivities } from "@/helper/activities";
import { convertStatus } from "@/helper/convert-status";


function ViewButton({ activityId, employee}:any) {
    const [activities, employeeActivities] = useState([]);
   
    const [employees, setEmployees] = useState<any>({
      
    })

    function getEmployeeActivites() {
        axios.get(`activity/${activityId}`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("accessToken")}`,
          },
        }).then((response) => {
            employeeActivities(response.data);
           console.log(response.data)
        }).catch(error => {
          console.error("There was an error fetching the departments!", error);
        });
      };
  return (
    <div>
        <Dialog>
            <DialogTrigger asChild>
             
            <EyeIcon
            className="h-4 w-4 cursor-pointer"
            onClick={() => {
                getEmployeeActivites();
                setEmployees(employee);
            }}
            />

               
            </DialogTrigger>
                <DialogContent className="border border-border rounded-md sm:w-[90%] ">
                    <DialogHeader>
                        <div>
                            <Card className="bg-white rounded-md p-4 mt-5 mb-10 flex gap-3 items-center  sm:w-[90%] xxs:w-[50%]">
                                <div className="w-40 h-40 rounded overflow-hidden">
                                    <img
                                    src={employees?.photos ? `${import.meta.env.VITE_URL}${employees?.photos}` : "https://github.com/shadcn.png"} 
                                    alt="Profile Picture"
                                    className="w-full h-full object-cover"
                                    />
                                </div>
                                    <div className=" text-start">
                                    <div className=" text-xs text-white bg-primary p-1 rounded-lg text-center">
                                            {convertStatus(employees?.status)}
                                        </div>
                                        <h2 className="text-start font-semibold text-primary font-small"><span className="font-small text-lg ">{employees?.full_name}</span>
                                    </h2><h2 className="text-sm text-gray-500 text-primary">{getDepartmentName(employees?.deptid)}</h2>
                                        
                                    </div>
                                    

                               
                            </Card>

                        </div>
                        <DialogTitle className="text-start text-primary">Employee Activities</DialogTitle>
                        <DialogDescription>
                            <div className="overflow-auto bg-primary-foreground max-h-full sm:w-[90%] xxs:w-[90%]">
                                <Table tableName="attendance">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-white sticky top-0 bg-primary border border-border">Activity</TableHead>
                                            <TableHead className="text-white border border-border text-md sticky top-0 bg-primary">Date from</TableHead>
                                            <TableHead className='text-white border border-border text-md sticky top-0 bg-primary'>Date to</TableHead>
                                            <TableHead className='text-white border border-border text-md sticky top-0 bg-primary'>Description</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {activities.length  != 0 ?
                                        activities.map((activity: any,) => (


                                        <TableRow className='border border-border'>
                                            <TableCell className="font-small">{getActivities(activity.status)}</TableCell>
                                            <TableCell className="font-small">{activity.fromDate}</TableCell>
                                            <TableCell className="font-small">{activity.toDate}</TableCell>
                                            <TableCell className="font-small">{activity.description}</TableCell>
                                        </TableRow>
                                         )): 
                                            <TableRow>
                                                <TableCell className="text-center border border-border" colSpan={4}>No activity found</TableCell>
                                            </TableRow>
                                        }
                                    </TableBody>
                                </Table>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
        </Dialog>
    </div>
  )
}

export default ViewButton