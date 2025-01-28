import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";
import { PenIcon } from "lucide-react";
import { Input } from "@/components/ui/input"
import {  useState } from "react";
import axios from '../../../plugin/axios';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import Swal from 'sweetalert2'


function EditProfile({employee, getAllUsers, departments}:any) {

    const [dialogOpen, setDialogOpen] = useState(false); // State to control the dialog visibility
    const [employees, setEmployees] = useState<any>({
      
    })

    const convertDate1 = (date:any) => {
      if (!date) return '';
      const d = new Date(date);
      const month = (`0${d.getMonth() + 1}`).slice(-2);
      const day = (`0${d.getDate()}`).slice(-2);
      const year = d.getFullYear();
      return `${year}-${month}-${day}`;
    };
  
   
   function updateUser() {
    axios.put(`users/update/${employees.uid}/`,{
      birthday: employees.birthday,
      city: employees.city,
      deptid: employees.deptid,
      email: employees.email,
      email2: employees.email2,
      full_name: employees.full_name,
      hiredday:  employees.hiredday,
      job_title: employees.job_title,
      ophone: employees.ophone,
      sex: employees.sex,
      state:employees.state,
      status: employees.status,
      street:employees.street,
      zip: employees.zip
    },{
      headers: {
          Authorization: `Token ${localStorage.getItem("accessToken")}`,
      },
      }).then((_e:any)=>{
          setDialogOpen(false);
          Swal.fire({
            icon: "success",
            title: "Updated Successfully...",
            showConfirmButton: false,
            timer: 2000
          });
          getAllUsers();
          
    }).catch((error:any)=>{

  console.log(error.response.data.non_field_errors[0])
      Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.response.data.non_field_errors[0],
          showConfirmButton: false,
        });
  
})
   }
  return (

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                
                    <PenIcon onClick={()=>{
                  setEmployees(employee)
                }}  className="h-4 w-4 text-primary cursor-pointer"/>
              
            </DialogTrigger>
            <DialogContent className="sm:w-[90%] xxs:w-[90%] rounded-md ">
              <DialogHeader>
                <DialogTitle className="text-start text-primary" >Edit profile</DialogTitle>
                    {/* <DialogDescription className="text-start">
                    Make changes to your profile here. Click save when you're done.
                    </DialogDescription> */}
              </DialogHeader>
              
              <form className={cn("grid items-start grid-cols-2 w-full p-2 flex-row gap-4 text-primary")} onSubmit={(e)=>{e.preventDefault()
               updateUser()}}>
                <div className="grid gap-2">
                    <Label htmlFor="email ">Email</Label>
                    <Input type="email" id="email" value={employees.email}onChange={(e:any)=>{
                    setEmployees({...employees,email:e.target.value})
                }} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="fullname">Full name</Label>
                    <Input id="fullname" value={employees.full_name}onChange={(e:any)=>{
                    setEmployees({...employees,full_name:e.target.value})
                }} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="address">Address street</Label>
                    <Input id="address" value={employees.street}onChange={(e:any)=>{
                    setEmployees({...employees,street:e.target.value} )
                }} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="city">City or Municipality</Label>
                    <Input id="city" value={employees.city}onChange={(e:any)=>{
                    setEmployees({...employees,city:e.target.value} )
                }} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="zip">Zip code</Label>
                    <Input id="zip" value={employees.zip}onChange={(e:any)=>{
                    setEmployees({...employees,zip:e.target.value} )
                }} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="sex">Sex</Label>
                      <Select
                        value={employees.sex}
                        onValueChange={(e) => {
                          setEmployees({ ...employees, sex: e });
                        }}
                      >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                </div>

                
                <div className="grid gap-2">
                    <Label htmlFor="office">Office</Label>
                    <Select value={employees.deptid} onValueChange={(value) => { 
                      setEmployees({...employees,deptid:parseInt(value)}) }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select office" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((department: any) => (
                        <SelectItem key={department.deptid} value={department.deptid}>
                          {department.dept_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="position">Position</Label>
                    <Input id="position" value={employees.job_title}onChange={(e:any)=>{
                    setEmployees({...employees,job_title:e.target.value} )
                }} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="birthday">Birthday</Label>
                    <Input 
                      id="birthday" 
                      type="date" 
                      value={convertDate1(employees.birthday)} 
                      onChange={(e) => {
                        setEmployees({ ...employees, birthday: e.target.value });
                      }} 
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="mobile">Mobile</Label>
                    <Input id="mobile" value={employees.ophone}onChange={(e:any)=>{
                    setEmployees({...employees,ophone:e.target.value} )
                }} />
                </div>

                {/* <div className="grid gap-2 ">
                    <Label htmlFor="photos">Photos</Label>
                    <Input type="file" id="photos" value={employees.photos}onChange={(e:any)=>{
                    setEmployees({...employees,photos:e.target.value} )
                }} />
                </div> */}

               
                <Button className="gap-2 col-span-2">Save changes</Button>
                </form>

            </DialogContent>
          </Dialog>
 
  )
}

export default EditProfile