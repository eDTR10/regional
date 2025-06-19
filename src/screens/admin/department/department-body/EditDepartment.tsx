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
import { Edit2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

// Update the interface to handle array of office names
interface DepartmentData {
  deptid: number;
  dept_name: string;
  office: string[];  // Changed to string array
  updatedAt?: string;
}

function EditDepartment({ deptData, fetchData }: { deptData: DepartmentData; fetchData: () => void }) {
  const [dept, setDept] = useState<DepartmentData>({
    ...deptData,
    office: Array.isArray(deptData.office) ? deptData.office : []  // Ensure office is always an array
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  // Keep dept state in sync if deptData changes
  useEffect(() => {
    setDept(deptData);
  }, [deptData]);

  async function UpdateOffice() {
    axios.put(`department/${dept.deptid}/`, dept, {
      headers: {
        Authorization: `Token ${localStorage.getItem("accessToken")}`,
      },
    }).then((_e: any) => {
      setDialogOpen(false);
      fetchData();
      Swal.fire({
        icon: "success",
        title: "Updated Successfully...",
        showConfirmButton: false,
        timer: 2000
      });
    }).catch((error: any) => {
      console.error("Error updating department:", error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong while updating the data!',
      });
    });
  }

  // Add function to handle adding new office
  const addoffice = () => {
    setDept(prev => ({
      ...prev,
      office: [...prev.office, '']
    }));
  };

  // Add function to handle removing office
  const removeoffice = (index: number) => {
    setDept(prev => ({
      ...prev,
      office: prev.office.filter((_, i) => i !== index)
    }));
  };

  // Add function to update specific office
  const updateoffice = (index: number, value: string) => {
    setDept(prev => ({
      ...prev,
      office: prev.office.map((item, i) => (i === index ? value : item))
    }));
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Edit2Icon
          onClick={() => setDialogOpen(true)} // Open dialog on trigger click
          className=" cursor-pointer w-4 h-4 hover:text-primary/80"
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[90%] text-foreground">
        <DialogHeader>
          <DialogTitle>Edit office</DialogTitle>
          <DialogDescription>
            Make changes to the office here. Click save when you're done.
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
            <p className="text-foreground">Office ID</p>
            <Input
              id="name"
              value={dept.deptid}
              onChange={(e) => setDept({ ...dept, deptid: Number(e.target.value) })}
              className="bg-muted pointer-events-none text-foreground col-span-3"
            />
          </div>
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
          {/* office section */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <p className="text-foreground">office Coordinates</p>
              <Button 
                type="button" 
                variant="outline" 
                onClick={addoffice}
                className="px-2 py-1 h-8"
              >
                Add office
              </Button>
            </div>
            
            {dept.office.map((office, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  value={office}
                  onChange={(e) => updateoffice(index, e.target.value)}
                  className="text-foreground"
                  placeholder="Enter office coordinates"
                />
                <Button 
                  type="button"
                  variant="destructive"
                  onClick={() => removeoffice(index)}
                  className="px-2 py-1 h-8"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          <Button type="submit">Save changes</Button>
        </form>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditDepartment;
