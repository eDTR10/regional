import { Button } from '@/components/ui/button';
import { Suspense, useRef, useState, useEffect } from 'react'
import { FileCodeIcon,  FileSignature,  PrinterIcon } from 'lucide-react';

import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"

 
import MyDocument from './PDF';
import { PDFViewer,pdf } from '@react-pdf/renderer';
import { isMobile } from 'react-device-detect'; // To detect mobile devices
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { PDFDocument } from 'pdf-lib-with-encrypt';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
export default function PrintDTR({name,data,date,show,selectedYear, selectedMonth}:any) {
  const [_image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState(() => {
    const savedSchedule = localStorage.getItem('selectedSchedule')
    return savedSchedule || "7"
  });

  useEffect(() => {
    localStorage.setItem('selectedSchedule', selectedSchedule)
  }, [selectedSchedule])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const openFileExplorer = () => {
    fileInputRef.current?.click();
  };

  const  handleDownload = async () => {
    // Generate the PDF using @react-pdf/renderer
    const doc = <MyDocument name={name} previewUrl={previewUrl} date={date} data={data} selectedYear={selectedYear} selectedMonth={selectedMonth} />;
    const asPdf = pdf();
    asPdf.updateContainer(doc);
    const blob = await asPdf.toBlob();

    // Load the generated PDF into pdf-lib and secure it
    const pdfDoc = await PDFDocument.load(await blob.arrayBuffer());
  

    const pdfBytes = await pdfDoc.save();
    const protectedBlob = new Blob([pdfBytes], { type: 'application/pdf' });

    // Create a temporary download link and programmatically click it
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(protectedBlob);
    downloadLink.download = `${name.toUpperCase()}_DTR_${date}.pdf`;
    downloadLink.click();

    // Clean up the URL object after download
    URL.revokeObjectURL(downloadLink.href);
  };
  
  
  return (
    <Drawer >
      <DrawerTrigger className={show?'  z-20 w-full flex gap-2 ':' flex gap-2 text-foreground z-20 w-full pointer-events-none  '}>
        <Button type='button' variant={show?"default":"outline"} className={show?'  z-20 w-full flex gap-2 ':' flex gap-2 text-foreground z-20 w-full pointer-events-none '} >Show PDF <PrinterIcon className={show?' w-4 h-4 animate-bounce':' w-4 h-4 '}/> </Button>
      </DrawerTrigger>

      <DrawerContent  title="DTR" 
  description="Optional Description">
    <div className='h-[70vh] sm:h-[30vh]   w-full overflow-y-scroll sm:overflow-hidden  bg-white '>

    
    {isMobile ? (
      <div className=' flex w-full items-center justify-center h-20 gap-5'>
        <Select value={selectedSchedule} onValueChange={(value) => {
    setSelectedSchedule(value)
  }}>
              <p>Schedule:</p>
                <SelectTrigger className="w-[100px]">
                  <SelectValue  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">5:00-2:00</SelectItem>
                  <SelectItem value="2">5:30-2:30</SelectItem>
                  <SelectItem value="3">6:00-3:00</SelectItem>
                  <SelectItem value="4">6:30-3:30</SelectItem>
                  <SelectItem value="5">7:00-4:00</SelectItem>
                  <SelectItem value="6">7:30-4:30</SelectItem>
                  <SelectItem value="7">8:00-5:00</SelectItem>
                  <SelectItem value="8">8:30-5:30</SelectItem>
                  <SelectItem value="9">9:00-6:00</SelectItem>
                  <SelectItem value="10">9:30-6:30</SelectItem>
                  <SelectItem value="11">10:00-7:00</SelectItem>
                </SelectContent>
              </Select>
         <Button onClick={handleDownload} value=''>Save DTR  <FileCodeIcon  className=' h-4 w-4 ml-2 animate-bounce'/> </Button>
         
      
      </div>
        ) : (
        <Suspense fallback={<div></div>}>
          <div className=' flex w-full items-center justify-center h-20 gap-5'>
            <Select value={selectedSchedule} onValueChange={(value) => {
    setSelectedSchedule(value)
  }}>
          <p>Schedule:</p>
                <SelectTrigger className="w-[100px]">
                  <SelectValue  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">5:00-2:00</SelectItem>
                  <SelectItem value="2">5:30-2:30</SelectItem>
                  <SelectItem value="3">6:00-3:00</SelectItem>
                  <SelectItem value="4">6:30-3:30</SelectItem>
                  <SelectItem value="5">7:00-4:00</SelectItem>
                  <SelectItem value="6">7:30-4:30</SelectItem>
                  <SelectItem value="7">8:00-5:00</SelectItem>
                  <SelectItem value="8">8:30-5:30</SelectItem>
                  <SelectItem value="9">9:00-6:00</SelectItem>
                  <SelectItem value="10">9:30-6:30</SelectItem>
                  <SelectItem value="11">10:00-7:00</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleDownload} value=''>Save DTR  <FileCodeIcon  className=' h-4 w-4 ml-2 animate-bounce'/> </Button>

              

            <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={fileInputRef}
        className="hidden"
      />

      {/* Button to trigger file input */}

      <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
        <Button onClick={openFileExplorer} variant="outline">Add Signature <FileSignature  className=' h-4 w-4 ml-2'/> </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>image size 789x579</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
      
   
           
          </div>
          
          <PDFViewer className="w-full h-full" >
          <MyDocument name={name.toUpperCase()} previewUrl={previewUrl} date={date} data={data} selectedYear={selectedYear} selectedMonth={ selectedMonth} />
        </PDFViewer>
        </Suspense>
        
      )}
      </div>
    {/* <DrawerFooter>
      <Button onClick={handlePrint}>Save as PDF</Button>
    </DrawerFooter> */}
  </DrawerContent>
            
      {/* Component to be printed */}
      

      {/* Button to trigger the print action */}

    </Drawer>
  )
}