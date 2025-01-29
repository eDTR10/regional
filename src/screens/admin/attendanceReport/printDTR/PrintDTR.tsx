import { Button } from '@/components/ui/button';
import { Suspense, useRef, useState, } from 'react'
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
export default function PrintDTR({name,data,date,show,selectedYear, selectedMonth}:any) {
  const [_image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
    // pdfDoc.encrypt({
    //   ownerPassword: 'jelinegwapa143',
    //   userPassword: '',
    //   permissions: {
    //     printing: 'highResolution',
    //     modifying: false,
    //     copying: false,
    //     annotating: false,
    //     fillingForms: false,
    //     contentAccessibility: false,
    //     documentAssembly: false,
    //   },
    // });

    const pdfBytes = await pdfDoc.save();
    const protectedBlob = new Blob([pdfBytes], { type: 'application/pdf' });

    // Create a temporary download link and programmatically click it
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(protectedBlob);
    downloadLink.download = `${name ? name.toUpperCase() : "UNKNOWN"}_DTR_${date}.pdf`;
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
         <Button onClick={handleDownload} value=''>Save DTR  <FileCodeIcon  className=' h-4 w-4 ml-2 animate-bounce'/> </Button>
      ) : (
        <Suspense fallback={<div></div>}>
          <div className=' flex w-full items-center justify-center h-20 gap-10'>
            
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
          <MyDocument name={name ? name.toUpperCase() : "UNKNOWN"} previewUrl={previewUrl} date={date} data={data} selectedYear={selectedYear} selectedMonth={ selectedMonth} />
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