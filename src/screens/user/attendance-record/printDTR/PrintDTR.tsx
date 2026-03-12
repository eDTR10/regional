import { Button } from '@/components/ui/button';
import { Suspense, useState, useEffect } from 'react'
import { FileCodeIcon, KeyRoundIcon, LoaderIcon, PrinterIcon, ShieldCheckIcon } from 'lucide-react';
import PNPKISetup from './PNPKISetup';
import { signPdfWithPNPKI, usePNPKI } from './usePNPKI'

import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"


import MyDocument from './PDF';
import { PDFViewer, pdf } from '@react-pdf/renderer';
import { isMobile } from 'react-device-detect'; // To detect mobile devices

import { PDFDocument } from 'pdf-lib-with-encrypt';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
export default function PrintDTR({ name = '', data, date, show, selectedYear, selectedMonth }: any) {




  // Initialize SupervisorsName from localStorage
  const [SupervisorsName, setSupervisorsName] = useState<string>(() => {
    const savedSupervisor = localStorage.getItem('supervisorsName')
    return savedSupervisor || ''
  });

  const [selectedSchedule, setSelectedSchedule] = useState(() => {
    const savedSchedule = localStorage.getItem('selectedSchedule')
    return savedSchedule || "7"
  });

  // Save selectedSchedule to localStorage
  useEffect(() => {
    localStorage.setItem('selectedSchedule', selectedSchedule)
  }, [selectedSchedule])

  // Save SupervisorsName to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('supervisorsName', SupervisorsName)
  }, [SupervisorsName])

  // ── PNPKI ──────────────────────────────────────────────────────────────────
  const { config: pnpkiConfig, saveConfig: savePNPKI, clearConfig: clearPNPKI } = usePNPKI();
  const [pnpkiOpen, setPnpkiOpen] = useState(false);
  const [signing, setSigning] = useState(false);
  const [previewPdfBlob, setPreviewPdfBlob] = useState<Blob | null>(null);
  const pnpkiReady = pnpkiConfig.enabled && !!pnpkiConfig.p12Base64;

  const openPNPKISetup = async () => {
    // Generate a fresh PDF blob so the preview is always up to date
    try {
      const doc = <MyDocument
        name={name?.toUpperCase() || ''}
        previewUrl={null}
        date={date}
        data={data}
        selectedSchedule={selectedSchedule}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        SupervisorsName={SupervisorsName}
      />;
      const asPdf = pdf();
      asPdf.updateContainer(doc);
      const blob = await asPdf.toBlob();
      setPreviewPdfBlob(blob);
    } catch {
      setPreviewPdfBlob(null);
    }
    setPnpkiOpen(true);
  };





  const handleDownload = async () => {
    if (signing) return;

    // Generate the PDF using @react-pdf/renderer
    const doc = <MyDocument
      name={name?.toUpperCase() || ''}
      previewUrl={null}
      date={date}
      data={data}
      selectedSchedule={selectedSchedule}
      selectedYear={selectedYear}
      selectedMonth={selectedMonth}
      SupervisorsName={SupervisorsName}
    />;
    const asPdf = pdf();
    asPdf.updateContainer(doc);
    const blob = await asPdf.toBlob();

    // Load the generated PDF into pdf-lib
    const pdfDoc = await PDFDocument.load(await blob.arrayBuffer());
    const pdfBytes: any = await pdfDoc.save();
    let finalBlob: Blob = new Blob([pdfBytes], { type: 'application/pdf' });

    const baseFileName = `${name.toUpperCase()}_DTR_${date}`;
    let downloadName = `${baseFileName}.pdf`;

    // ── PNPKI signing ──────────────────────────────────────────────────────
    if (pnpkiReady) {
      setSigning(true);
      try {
        finalBlob = await signPdfWithPNPKI(finalBlob, pnpkiConfig, downloadName);
        downloadName = `${baseFileName}_SIGNED.pdf`;
      } catch (err) {
        alert(`PNPKI signing failed:\n\n${(err as Error).message}\n\nMake sure the PNPKI server is running at ${pnpkiConfig.serverUrl}.`);
        setSigning(false);
        return;
      } finally {
        setSigning(false);
      }
    }

    // Trigger download
    const objectUrl = URL.createObjectURL(finalBlob);
    try {
      const downloadLink = document.createElement('a');
      downloadLink.href = objectUrl;
      downloadLink.download = downloadName;
      downloadLink.click();
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  };


  return (
    <>
      <Drawer >
        <DrawerTrigger className={show ? '  z-20 w-full flex gap-2 ' : ' flex gap-2 text-foreground z-20 w-full pointer-events-none  '}>
          <Button type='button' variant={show ? "default" : "outline"} className={show ? '  z-20 w-full flex gap-2 ' : ' flex gap-2 text-foreground z-20 w-full pointer-events-none '} >Show PDF <PrinterIcon className={show ? ' w-4 h-4 animate-bounce' : ' w-4 h-4 '} /> </Button>
        </DrawerTrigger>

        <DrawerContent title="DTR"
          description="Optional Description">
          <div className='h-[55vh] sm:h-[92vh] w-full bg-white flex flex-col overflow-hidden'>


            {isMobile ? (




              <div className='flex w-full items-center md:flex-col justify-center gap-5 p-3 overflow-y-auto'>
                <Select value={selectedSchedule} onValueChange={(value) => {
                  setSelectedSchedule(value)
                }}>
                  <p>Schedule:</p>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="13">4D Work Week</SelectItem>
                    <SelectItem value="14">On Fasting</SelectItem>
                    <SelectItem value="4">6:00-6:00</SelectItem>
                    <SelectItem value="5">7:00-4:00</SelectItem>
                    <SelectItem value="6">7:30-4:30</SelectItem>
                    <SelectItem value="7">8:00-5:00</SelectItem>
                    <SelectItem value="8">8:30-5:30</SelectItem>
                    <SelectItem value="9">9:00-6:00</SelectItem>
                    <SelectItem value="10">9:30-6:30</SelectItem>
                    <SelectItem value="11">10:00-7:00</SelectItem>
                    <SelectItem value="12">6:00-6:00 Night Shift</SelectItem>

                  </SelectContent>
                </Select>

                <input type="text" className='border border-gray-300 rounded-md p-2 outline-none'
                  value={SupervisorsName} onChange={(e) => setSupervisorsName(e.target.value)}
                  placeholder="Supervisors Name Here " />
                <Button onClick={handleDownload} value='' disabled={signing} className='gap-1'>
                  {signing
                    ? <><LoaderIcon className='h-4 w-4 animate-spin' /> Signing…</>
                    : <>{pnpkiReady ? <ShieldCheckIcon className='h-4 w-4' /> : <FileCodeIcon className='h-4 w-4' />} Save DTR{pnpkiReady ? ' + PNPKI' : ''}</>}
                </Button>

                <Button
                  onClick={openPNPKISetup}
                  value=''
                  variant={pnpkiReady ? 'default' : 'outline'}
                  className='gap-1'
                  title={pnpkiReady ? `PNPKI configured — ${pnpkiConfig.fileName}` : 'Set up PNPKI digital signature'}
                >
                  {pnpkiReady
                    ? <><ShieldCheckIcon className='h-4 w-4 text-green-300' /> PNPKI ✓</>
                    : <><KeyRoundIcon className='h-4 w-4 animate-bounce' /> PNPKI</>}
                </Button>
              </div>


            ) : (
              <Suspense fallback={<div></div>}>
                <div className='flex w-full items-center justify-center h-20 gap-5 shrink-0'>
                  <Select value={selectedSchedule} onValueChange={(value) => {
                    setSelectedSchedule(value)
                  }}>
                    <p>Schedule:</p>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="13">4D Work Week</SelectItem>
                      <SelectItem value="14">On Fasting</SelectItem>
                      <SelectItem value="4">6:00-6:00</SelectItem>
                      <SelectItem value="5">7:00-4:00</SelectItem>
                      <SelectItem value="6">7:30-4:30</SelectItem>
                      <SelectItem value="7">8:00-5:00</SelectItem>
                      <SelectItem value="8">8:30-5:30</SelectItem>
                      <SelectItem value="9">9:00-6:00</SelectItem>
                      <SelectItem value="10">9:30-6:30</SelectItem>
                      <SelectItem value="11">10:00-7:00</SelectItem>
                      <SelectItem value="12">6:00-6:00 Night Shift</SelectItem>



                    </SelectContent>
                  </Select>
                  <Button onClick={handleDownload} value='' disabled={signing} className='gap-1'>
                    {signing
                      ? <><LoaderIcon className='h-4 w-4 animate-spin' /> Signing…</>
                      : <>{pnpkiReady ? <ShieldCheckIcon className='h-4 w-4' /> : <FileCodeIcon className='h-4 w-4' />} Save DTR{pnpkiReady ? ' + PNPKI' : ''}</>}
                  </Button>

                  <Button
                    onClick={openPNPKISetup}
                    value=''
                    variant={pnpkiReady ? 'default' : 'outline'}
                    className='gap-1'
                    title={pnpkiReady ? `PNPKI configured — ${pnpkiConfig.fileName}` : 'Set up PNPKI digital signature'}
                  >
                    {pnpkiReady
                      ? <><ShieldCheckIcon className='h-4 w-4 text-green-300' /> PNPKI ✓</>
                      : <><KeyRoundIcon className='h-4 w-4 animate-bounce' /> PNPKI</>}
                  </Button>



                  {/* <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={fileInputRef}
        className="hidden"
      /> */}

                  {/* Button to trigger file input */}

                  <input type="text" className='border border-gray-300 rounded-md p-2 outline-none'
                    value={SupervisorsName} onChange={(e) => setSupervisorsName(e.target.value)}
                    placeholder="Supervisors Name Here " />


                </div>

                <div className='flex-1 min-h-0 w-full'>
                  <PDFViewer className="w-full h-full" >
                    <MyDocument
                      name={name?.toUpperCase() || ''}
                      previewUrl={null}
                      selectedSchedule={selectedSchedule}
                      date={date}
                      data={data}
                      selectedYear={selectedYear}
                      selectedMonth={selectedMonth}
                      SupervisorsName={SupervisorsName}
                    />
                  </PDFViewer>
                </div>
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

      <PNPKISetup
        open={pnpkiOpen}
        onClose={() => setPnpkiOpen(false)}
        config={pnpkiConfig}
        onSave={savePNPKI}
        onClear={clearPNPKI}
        pdfBlob={previewPdfBlob}
      />
    </>
  )
}