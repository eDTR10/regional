import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import axios from "./../../../../plugin/axios";
import {  PlusSquareIcon } from "lucide-react";
import {useState } from "react";
import Swal from "sweetalert2";



function AddDepartment({fetchData}: any) {
  const [dept, setDept] = useState<any>({deptid:null,dept_name:''});
  const [dialogOpen, setDialogOpen] = useState(false); // State to control the dialog visibility

  // Keep dept state in sync if deptData changes
 

  async function UpdateOffice() {
  
      axios.post(`department/all/`, dept, {
        headers: {
          Authorization: `Token ${localStorage.getItem("accessToken")}`,
        },
      }).then((_e:any)=>{
        setDialogOpen(false);
        fetchData();
        setDept({deptid:null,dept_name:''})
        Swal.fire({
            icon: "success",
            title: "addedd Successfully...",
            showConfirmButton: false,
            timer: 2000
        });
      }).catch((error:any)=>{
        console.error("Error updating department:", error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong while adding the data!',
      })}
    
    );
    
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant='default' className=" text-white flex gap-2 mr-2">
          <p>Add Office</p>
        <PlusSquareIcon
          onClick={() => setDialogOpen(true)} // Open dialog on trigger click
          className=" cursor-pointer w-4 h-4 text-white"
        />
        </Button>
        
      </DialogTrigger>
      <DialogContent className="sm:max-w-[90%] text-foreground">
        <DialogHeader>
          <DialogTitle>Add office</DialogTitle>
          <DialogDescription>
            Add office here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e: any) => {
            e.preventDefault();
            UpdateOffice(); // Call the update function on form submission
          }}
          className="grid gap-4 py-5"
        >
          
          <div className="flex flex-col gap-2">
            <p className="text-foreground">Office name</p>
            <Input
              id="username"
              value={dept.dept_name}
              required
              onChange={(e) => setDept({ ...dept, dept_name: e.target.value })}
              className="text-foreground col-span-3"
            />
          </div>
          <Button type="submit">Save Office</Button>
        </form>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddDepartment;
