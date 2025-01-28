import  { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {  Search, Sheet, Trash2Icon } from 'lucide-react';
import axios from './../../../../plugin/axios';
import Swal from 'sweetalert2';

import EditDepartment from './EditDepartment';
import AddDepartment from './AddDepartment';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const DepartmentTable = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState<any>({open:false,employee:{}});
    const fetchData = async () => {
         axios.get('department/all/', {
                headers: {
                    Authorization: `Token ${localStorage.getItem("accessToken")}`,
                },
            }).then((response:any)=>{
                setData(response.data);
            }).catch ((error: any)=> {
            console.error('Error fetching data:', error.response ? error.response.data : error.message);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong while fetching the data!',
            });
        })
    };

    useEffect(() => {
        // console.log(localStorage.getItem("accessToken"));
        

        fetchData();
    }, []);


    async function DeleteOffice(id:any) {
  
        axios.delete(`department/${id}/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("accessToken")}`,
          },
        }).then((_e:any)=>{
          fetchData();
          setIsDialogOpen({open:false,employee:{}})
          Swal.fire({
              icon: "success",
              title: "Deleted Successfully...",
              showConfirmButton: false,
              timer: 2000
          });
          
        }).catch((error:any)=>{
          console.error("Error updating department:", error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong while Deleting the data!',
        })}
      
      );
      
    }
    const filteredCheckData = data.filter((item: any) => {
        const matchesSearchTerm = item.dept_name?.toLowerCase().includes(searchTerm.toLowerCase())


        return matchesSearchTerm;
    });


    return (
        <div id="printss" className='  relative flex flex-col gap-4  mt-20 w-xl p-2 m-4 border border-border bg-primary-foreground rounded-md min-h-[130px]'>
            <div className='flex p-4 justify-between items-center bg-primary mb-2'>
                <p className='text-white '>LIST OF OFFICE</p>
                <Sheet className='text-6xl text-white' />
            </div>
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
                

                <AddDepartment fetchData={fetchData} />
            </div>


            

            <div className="overflow-auto bg-primary-foreground max-h-full">
                <Table >
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[40px] border border-border text-white sticky top-0 bg-primary">#</TableHead>
                            <TableHead className='text-white border border-border text-md sticky top-0 bg-primary'>Office</TableHead>
                            <TableHead className='text-white border border-border text-md sticky top-0 bg-primary'>actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredCheckData.map((item: any, index) => (
                            <TableRow key={index} className=' border border-border'>
                                <TableCell className="font-small">{item.deptid}</TableCell>
                                <TableCell>{item.dept_name}</TableCell>
                                <TableCell>
                                    <div className=' flex items-center justify-center gap-5'>
                                        <EditDepartment deptData={item} fetchData={fetchData} />
                                        <Trash2Icon onClick={()=>{
                                            setIsDialogOpen({open:true,employee:item})
                                        }} className=' text-red-600 w-4  h-4 cursor-pointer '/>                                
                                        
                                    
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <Dialog open={isDialogOpen.open} onOpenChange={(e:any)=>{
                                            setIsDialogOpen({...isDialogOpen,open:e})
                                        }}>
                                                <DialogContent className=' z-50 absolute rounded-md'>
                                                    <DialogTitle className='text-foreground'>Confirm Delete Office</DialogTitle>
                                                    <DialogDescription>
                                                        Are you sure you want to delete "{isDialogOpen.employee.dept_name}" Office?
                                                    </DialogDescription>
                                                    <DialogFooter>
                                                        <Button variant="outline" className='text-foreground mt-2' onClick={()=>{
                                            setIsDialogOpen({open:false,employee:{}})
                                        }}>Cancel</Button>
                                                        <Button className='text-white'onClick={()=>{
                                            DeleteOffice(isDialogOpen.employee.deptid)
                                        }}>Confirm</Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>

            
        </div>
    );
};

export default DepartmentTable;