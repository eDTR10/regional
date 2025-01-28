import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Cake, Search } from "lucide-react";
import { convertDate } from "@/helper/date-time";
import Confetti from "react-confetti";
import './App.css'
const DashboardTableBirthday = ({ data }: { data: any }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, _setFilterType] = useState("All");
  const [selectedCelebrant, setSelectedCelebrant] = useState<any>(null); // State for selected celebrant

  const birthdayCelebrants = data?.birthday_celebrants || [];

  const filteredCheckData:any = birthdayCelebrants.filter((celebrant: any) => {
    const matchesSearchTerm =
      celebrant.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(celebrant.birthday)
        .toLocaleDateString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesFilterType =
      filterType === "All" ||
      convertDate(celebrant?.birthday).customLongDateFormat === filterType;

    return matchesSearchTerm && matchesFilterType;
  });

  const handleCelebrantClick = (celebrant: any) => {
    setSelectedCelebrant(celebrant);
    // Remove confetti and cake after 3 seconds
  };

  useEffect(()=>{
    if (localStorage.getItem('birthday')=='1') {
        handleCelebrantClick("name")
    }

  
  },[])



  

  return (
    <div className="w-xl p-2 m-4 bg-primary-foreground border border-border h-[430px] relative">
      <div className="flex p-4 justify-between items-center bg-primary mb-2">
        <p className="text-white">BIRTHDAY CELEBRANTS</p>
        <Cake className={selectedCelebrant?"animate-bounce text-6xl text-white":" text-6xl text-white"} />
      </div>

      <div className="flex items-center content-center py-4">
        <Search className="text-primary mr-2" />
        <input
          type="text"
          placeholder=" Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="outline-none focus:outline-primary pl-2 h-8 border border-border text-foreground bg-primary-foreground rounded w-1/2"
        />
      </div>

      <div className="overflow-auto max-h-full bg-primary-foreground" >
        <Table tableName="birthday">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[170px] border border-border text-white sticky top-0 bg-primary">
                FULL NAME
              </TableHead>
              <TableHead className="text-white border border-border text-md sticky top-0 bg-primary">
                BIRTHDAY
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>

            {filteredCheckData.map((celebrant: any, index: number) => (
                
              <TableRow
                key={index}
                className="border border-border cursor-pointer relative"
                onClick={() => handleCelebrantClick(celebrant)}
              >
                <TableCell className="font-small">
                  {celebrant?.full_name}
                  
                </TableCell>
                <TableCell>
                  {convertDate(celebrant?.birthday).customLongDateFormat}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Confetti Effect */}
      {selectedCelebrant && <Confetti className={filteredCheckData.length !=0?"block":" hidden"} />}
    </div>
  );
};

export default DashboardTableBirthday;
