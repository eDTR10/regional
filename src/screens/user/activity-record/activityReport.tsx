import { useState, useEffect, useRef } from 'react';
import axios from './../../../plugin/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Page, Text, View, Document, StyleSheet, Font, Image, pdf } from '@react-pdf/renderer';
import { FileDown, ChevronDown, KeyRoundIcon, LoaderIcon, ShieldCheckIcon, List, ListOrdered, Type, Minus } from 'lucide-react';

import DICT from './../../../assets/dict.png';
import { getDepartmentName } from '@/helper/department';
import { usePNPKI, signPdfWithPNPKI } from '../attendance-record/printDTR/usePNPKI';
import PNPKISetup from '../attendance-record/printDTR/PNPKISetup';

// Register Palatino font for PDF
Font.register({
  family: 'Palatino',
  fonts: [
    { src: `${import.meta.env.VITE_LINK}/palatino-linotype-family/palatinolinotype_regular.ttf` },
    { src: `${import.meta.env.VITE_LINK}/palatino-linotype-family/palatinolinotype_italic.ttf`, fontStyle: 'italic' },
    { src: `${import.meta.env.VITE_LINK}/palatino-linotype-family/palatinolinotype_bold.ttf`, fontWeight: 'bold' }
  ]
});

// PDF styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: '0.5in',
    paddingBottom: '1.3in', // <--- IMPORTANT CHANGE: Increased bottom padding to make space for the fixed footer
    fontFamily: 'Palatino',
    fontSize: 10
  },
  // *** STYLES FOR FIXED WATERMARK FOOTER ***
  watermarkFooter: {
    position: 'absolute', // Fixed position relative to the page
    bottom: '0.5in', // Positioned from the bottom
    left: '0.5in',
    right: '0.5in',
    borderTopWidth: 1, // The line shown in the image is now on top
    borderTopColor: '#00008b',
    paddingTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between', // Distribute items horizontally
    color: '#00008b', // Dark blue text color
    fontSize: 9,
  },
  footerLeft: {
    textAlign: 'left' as const,
    width: '40%',
  },
  footerCenter: {
    textAlign: 'center' as const,
    alignSelf: 'flex-end' as const,
    flex: 1,
    fontSize: 7,
    fontStyle: 'italic' as const,
    color: '#00008b',
  },
  footerRight: {
    textAlign: 'right' as const,
    width: '40%',
  },
  footerLink: {
    // Styling for the DICT link/contact part
    marginBottom: 2,
    fontSize: 10,
    fontWeight: 'normal',
    color: '#00008b',
  },
  footerPageInfo: {
    // Styling for the "Accomplishment Report | Page 1 of 1" part
    marginTop: 15, // Push it down slightly
    fontStyle: 'italic',
    fontSize: 9,
    color: '#00008b',
  },
  // *** END NEW STYLES ***
  headerSection: {
    alignItems: 'center'
  },
  headerText: {
    fontSize: 10,
    marginBottom: 2,
    textAlign: 'center',
    fontFamily: 'Palatino'
  },
  title: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 4,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  dateRange: {
    fontSize: 10,
    textAlign: 'center',
    fontWeight: "bold",
    marginBottom: 15,
    transform: 'translate(0, -5)'
  },
  infoSection: {
    marginBottom: 15
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'flex-end'
  },
  label: {
    fontSize: 10,
    marginRight: 10,
    fontStyle: 'bold',
    minWidth: 60
  },
  infoValue: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    fontStyle: 'bold',
    borderStyle: 'dotted',
    flex: 1,
    fontSize: 10
  },
  table: {
    marginTop: 0,
    width: '100%'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#000',
    borderStyle: 'dotted',
    minHeight: 20
  },
  tableHeader: {
    borderTopWidth: 1,
    borderTopColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderStyle: 'solid',
    backgroundColor: '#fff',
    fontWeight: 'bold'
  },
  dutiesCells: {
    width: '50%',
    padding: 8,
    fontSize: 10,
    borderRightWidth: 1,
    borderRightColor: '#000',
    borderStyle: 'dashed',
    transform: 'translate(0, 3)',
    textAlign: 'center'
  },
  dutiesCell: {
    width: '50%',
    padding: 8,
    fontSize: 8,
    borderRightWidth: 1,
    borderRightColor: '#000',
    borderStyle: 'dashed',
    textAlign: 'left'
  },
  activityCells: {
    width: '50%',
    padding: 2,
    fontSize: 10,
    transform: 'translate(0, 3)',
    paddingLeft: 10,
    textAlign: 'center'
  },

  activityCell: {
    width: '50%',
    padding: 8,
    fontSize: 8,
    paddingLeft: 10
  },
  activityItem: {
    fontSize: 8,
    marginBottom: 2
  },
  signatureSection: {
    marginTop: 30,
    left: '0.5in',
    right: '0.5in',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  signatureBox: {
    width: '45%'
  },
  signatureLabel: {
    fontSize: 10,
    marginBottom: 40
  },
  signatureLine: {
    fontSize: 10,
    fontWeight: 'bold'
  },
  signatureTitle: {
    fontSize: 10,
    fontStyle: 'italic'
  },
  afpCode: {
    position: 'absolute',
    transform: 'translate(0, -13)',
    top: 30,
    right: 30,
    fontSize: 8,
    fontStyle: 'italic',
    color: '#000',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 8,
    bottom: 30,
    right: 30,
    textAlign: 'right',
    color: 'grey',
  },
  footer: {
    marginTop: 40,
    textAlign: 'center',
  },
  footerText: {
    fontStyle: 'italic',
    fontSize: 10
  }
});

// PDF Document Component with pagination
const DARDocument = ({ activities, dateRange, name, position, project, verifiedBy, duties }: any) => {
  const allActivities = activities.flatMap((day: any) => day.activities);
  const ITEMS_PER_PAGE = 28;

  const activityPages: string[][] = [];
  for (let i = 0; i < allActivities.length; i += ITEMS_PER_PAGE) {
    activityPages.push(allActivities.slice(i, i + ITEMS_PER_PAGE));
  }

  if (activityPages.length === 0) {
    activityPages.push([]);
  }

  const totalPages = activityPages.length;

  return (
    <Document>
      {activityPages.map((pageActivities, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>

          <Text style={styles.afpCode}>AFD-HRM-AHR-009/r0/24Nov2025</Text>

          {/* Page Content */}
          {true ? (
            <>
              {/* ... First Page Header Content ... */}
              <View style={styles.headerSection}>
                <Image src={DICT} style={{ width: "100%", transform: 'translate(0, -13)', marginTop: 10, objectFit: 'contain', alignSelf: 'center', marginBottom: 5 }} />
                <Text style={styles.title}>Accomplishment Report</Text>
                <Text style={styles.dateRange}>{dateRange}</Text>
              </View>

              <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Name</Text>
                  <Text style={styles.infoValue}>{name || '[Surname, First Name, MI]'}</Text>
                  <Text style={[styles.label, { marginLeft: 20 }]}>Office</Text>
                  <Text style={styles.infoValue}>{getDepartmentName((() => { try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; } })().deptid)}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Position</Text>
                  <Text style={styles.infoValue}>{position || '[Do not abbreviate position]'}</Text>
                  <Text style={[styles.label, { marginLeft: 20 }]}>Project</Text>
                  <Text style={styles.infoValue}>{project || ''}</Text>
                </View>
              </View>

              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={styles.dutiesCells}>Duties and Responsibilities</Text>
                  <Text style={styles.activityCells}>Actual Deliverables</Text>
                </View>

                <View style={styles.tableRow}>
                  <Text style={styles.dutiesCell}>{duties || '(Consistent with the approved and submitted Terms of Reference)'}</Text>
                  <View style={styles.activityCell}>
                    {pageActivities.map((act: string, i: number) => (
                      <Text key={i} style={styles.activityItem}>{act}</Text>
                    ))}
                  </View>
                </View>
              </View>
            </>
          ) : (
            <>
              {/* ... Subsequent Page Header Content ... */}
              <View style={styles.headerSection}>
                <Text style={styles.title}>Accomplishment Report (Continued)</Text>
                <Text style={styles.dateRange}>{dateRange}</Text>
              </View>

              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={styles.dutiesCells}>Duties and Responsibilities</Text>
                  <Text style={styles.activityCells}>Actual Deliverables</Text>
                </View>

                <View style={styles.tableRow}>
                  <Text style={styles.dutiesCell}>{duties || '(Consistent with the approved and submitted Terms of Reference)'}</Text>
                  <View style={styles.activityCell}>
                    {pageActivities.map((act: string, i: number) => (
                      <Text key={i} style={styles.activityItem}>{act}</Text>
                    ))}
                  </View>
                </View>
              </View>
            </>
          )}

          {/* --- Footer Content that should ONLY be on the LAST page --- */}
          {pageIndex === totalPages - 1 && (
            <>
              <View style={styles.signatureSection}>
                <View style={styles.signatureBox}>
                  <Text style={styles.signatureLabel}>Prepared by:</Text>
                  <Text style={styles.signatureLine}>{name || '[Surname, First Name, MI]'}</Text>
                  <Text style={styles.signatureTitle}>{position || '[Do not abbreviate position]'}</Text>
                </View>
                <View style={styles.signatureBox}>
                  <Text style={styles.signatureLabel}>Verified by:</Text>
                  <Text style={styles.signatureLine}>{verifiedBy.name || '[Name of Immediate Supervisor]'}</Text>
                  <Text style={styles.signatureTitle}>{verifiedBy.designation || 'Designation'}</Text>
                </View>
              </View>
            </>
          )}

          {/* --- FIXED WATERMARK FOOTER IMPLEMENTATION (on every page) --- */}
          <View style={styles.watermarkFooter} fixed>
            <View style={styles.footerLeft}>
              <Text>DICT Regional Office X,</Text>
              <Text>Carmen, Cagayan de Oro City 9000</Text>
              <Text>Philippines</Text>
            </View>
            <View style={styles.footerCenter}>
              <Text>--- This is a system-generated file. ---</Text>
            </View>
            <View style={styles.footerRight}>
              <Text style={styles.footerLink}>https://www.dict.gov.ph</Text>
              <Text style={styles.footerLink}>+63 (088) 567-1769</Text>
              {/* Page Numbering integrated into the fixed footer */}
              <Text style={styles.footerPageInfo} render={({ pageNumber, totalPages }) => (
                `Accomplishment Report | Page ${pageNumber} of ${totalPages}`
              )} />
            </View>
          </View>
          {/* --- END FIXED WATERMARK FOOTER --- */}

        </Page>
      ))}
    </Document>
  );
};
function ActivityReport() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

  // ── PNPKI ─────────────────────────────────────────────────────────────────
  // Credentials (P12, password, signer name, image) are shared with DTR via
  // 'pnpki_config'.  Only placement coords are stored in 'pnpki_config_dar'.
  const { config: pnpkiBaseConfig, saveConfig: saveBaseConfig, clearConfig: clearBaseConfig } = usePNPKI('pnpki_config');
  const { config: pnpkiDarConfig, saveConfig: saveDarConfig, clearConfig: clearDarConfig } = usePNPKI(
    'pnpki_config_dar',
    { xRatio: 0.55, yRatio: 0.85, wRatio: 0.38, hRatio: 0.07 }
  );

  // Merged config used for signing and the setup dialog preview
  const pnpkiMergedConfig = {
    ...pnpkiBaseConfig,
    xRatio: pnpkiDarConfig.xRatio,
    yRatio: pnpkiDarConfig.yRatio,
    wRatio: pnpkiDarConfig.wRatio,
    hRatio: pnpkiDarConfig.hRatio,
    page:   pnpkiDarConfig.page,
  };

  /** On save: push all non-position fields to shared store, coords to DAR store */
  const handleSavePNPKIDar = async (cfg: typeof pnpkiBaseConfig) => {
    const { xRatio, yRatio, wRatio, hRatio, page, ...rest } = cfg;
    await saveBaseConfig({ ...pnpkiBaseConfig, ...rest });
    await saveDarConfig({ ...pnpkiDarConfig, xRatio, yRatio, wRatio, hRatio, page });
  };

  const handleClearPNPKIDar = () => { clearBaseConfig(); clearDarConfig(); };

  // ── Textarea helpers ──────────────────────────────────────────────
  const dutiesRef = useRef<HTMLTextAreaElement>(null);
  const [dutiesFontSize, setDutiesFontSize] = useState(13);
  const deliverableRef = useRef<HTMLTextAreaElement>(null);
  const [deliverablesFontSize, setDeliverablesFontSize] = useState(13);

  const autoGrowDeliverable = () => {
    const ta = deliverableRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = ta.scrollHeight + 'px';
  };

  const insertAtDeliverableLines = (prefix: (i: number, line: string) => string) => {
    const ta = deliverableRef.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e, value: text } = ta;
    if (s === e) {
      const lineStart = text.lastIndexOf('\n', s - 1) + 1;
      const lineText = text.slice(lineStart);
      const applied = prefix(0, '');
      if (lineText.startsWith(applied)) {
        setUserData((d: typeof userData) => ({ ...d, deliverables: text.slice(0, lineStart) + lineText.slice(applied.length) }));
      } else {
        setUserData((d: typeof userData) => ({ ...d, deliverables: text.slice(0, lineStart) + applied + lineText }));
      }
    } else {
      const selected = text.slice(s, e);
      const lines = selected.split('\n');
      const allHavePrefix = lines.every((line, i) => line.startsWith(prefix(i, '')));
      const replaced = allHavePrefix
        ? lines.map((line, i) => line.slice(prefix(i, '').length)).join('\n')
        : lines.map((line, i) => line.startsWith(prefix(i, '')) ? line : prefix(i, '') + line).join('\n');
      setUserData((d: typeof userData) => ({ ...d, deliverables: text.slice(0, s) + replaced + text.slice(e) }));
    }
    setTimeout(() => ta.focus(), 0);
  };

  const insertAtLines = (prefix: (i: number, line: string) => string) => {
    const ta = dutiesRef.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e, value: text } = ta;

    if (s === e) {
      // Single line — toggle
      const lineStart = text.lastIndexOf('\n', s - 1) + 1;
      const lineText = text.slice(lineStart);
      const applied = prefix(0, '');
      if (lineText.startsWith(applied)) {
        // Remove prefix
        const newText = text.slice(0, lineStart) + lineText.slice(applied.length);
        setUserData((d: typeof userData) => ({ ...d, duties: newText }));
      } else {
        // Add prefix
        const newText = text.slice(0, lineStart) + applied + lineText;
        setUserData((d: typeof userData) => ({ ...d, duties: newText }));
      }
    } else {
      const selected = text.slice(s, e);
      const lines = selected.split('\n');
      // If ALL lines already have the prefix → remove; otherwise add
      const allHavePrefix = lines.every((line, i) => line.startsWith(prefix(i, '')));
      const replaced = allHavePrefix
        ? lines.map((line, i) => line.slice(prefix(i, '').length)).join('\n')
        : lines.map((line, i) => line.startsWith(prefix(i, '')) ? line : prefix(i, '') + line).join('\n');
      const newText = text.slice(0, s) + replaced + text.slice(e);
      setUserData((d: typeof userData) => ({ ...d, duties: newText }));
    }
    setTimeout(() => ta.focus(), 0);
  };

  const [pnpkiOpen, setPnpkiOpen] = useState(false);
  const [signing, setSigning] = useState(false);
  const [previewPdfBlob, setPreviewPdfBlob] = useState<Blob | null>(null);
  const pnpkiReady = pnpkiBaseConfig.enabled && !!pnpkiBaseConfig.p12Base64;

  const isPersonalInfoComplete = () => {
    return !!userData.name && !!userData.position && !!userData.duties;
  };

  const isDeliverablesComplete = () => !!userData.deliverables;

  const isAdditionalDetailsComplete = () => {
    return !!verifiedBy.name && !!verifiedBy.designation;
  };
  
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem('userDAR');
    return saved ? JSON.parse(saved) : {
      name: '',
      position: '',
      project: '',
      duties: '',
      deliverables: ''
    };
  });

  const autoGrowDuties = () => {
    const ta = dutiesRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = ta.scrollHeight + 'px';
  };

  // Auto-grow textareas whenever content or font size changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { autoGrowDuties(); }, [userData.duties, dutiesFontSize]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { autoGrowDeliverable(); }, [userData.deliverables, deliverablesFontSize]);
  const [verifiedBy, setVerifiedBy] = useState(() => {
    const saved = localStorage.getItem('verifierDAR');
    return saved ? JSON.parse(saved) : {
      name: '',
      designation: ''
    };
  });

  const [isPersonalInfoExpanded, setIsPersonalInfoExpanded] = useState(() => {
    const saved = localStorage.getItem('personalInfoExpanded');
    return saved ? JSON.parse(saved) : true;
  });

  const [isDeliverablesExpanded, setIsDeliverablesExpanded] = useState(() => {
    const saved = localStorage.getItem('deliverablesExpanded');
    return saved ? JSON.parse(saved) : true;
  });

  const [isAdditionalDetailsExpanded, setIsAdditionalDetailsExpanded] = useState(() => {
    const saved = localStorage.getItem('additionalDetailsExpanded');
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('userDAR', JSON.stringify(userData));
  }, [userData]);

  useEffect(() => {
    localStorage.setItem('verifierDAR', JSON.stringify(verifiedBy));
  }, [verifiedBy]);

  useEffect(() => {
    localStorage.setItem('personalInfoExpanded', JSON.stringify(isPersonalInfoExpanded));
  }, [isPersonalInfoExpanded]);

  useEffect(() => {
    localStorage.setItem('deliverablesExpanded', JSON.stringify(isDeliverablesExpanded));
  }, [isDeliverablesExpanded]);

  useEffect(() => {
    localStorage.setItem('additionalDetailsExpanded', JSON.stringify(isAdditionalDetailsExpanded));
  }, [isAdditionalDetailsExpanded]);

  const fetchAndPopulateDeliverables = async (period: string, month: string, year: string) => {
    if (!period || !month || !year) return;
    const monthIndex = parseInt(month) - 1;
    const yearInt = parseInt(year);
    let startDay = 1;
    let endDay = 15;
    if (period === '16-31') {
      startDay = 16;
      endDay = new Date(yearInt, monthIndex + 1, 0).getDate();
    }
    const pad = (n: number) => n.toString().padStart(2, '0');
    const fromDate = `${yearInt}-${pad(monthIndex + 1)}-${pad(startDay)}`;
    const toDate = `${yearInt}-${pad(monthIndex + 1)}-${pad(endDay)}`;
    try {
      const response = await axios.post(
        `checkinoutregion/user_filter_by_user_date/`,
        { fromDate, toDate },
        { headers: { Authorization: `Token ${localStorage.getItem('accessToken')}` } }
      );
      const data = response.data;
      const lines: string[] = [];
      for (let i = startDay; i <= endDay; i++) {
        const currentDate = `${yearInt}-${pad(monthIndex + 1)}-${pad(i)}`;
        const holiday = data?.holidays?.find((h: any) => h.fromDate === currentDate);
        if (holiday) { lines.push(`• Holiday: ${holiday.description}`); continue; }
        const activity = data?.activities?.find((a: any) => a.fromDate === currentDate);
        if (activity) { lines.push(`• ${activity.description}`); }
      }
      if (lines.length > 0) {
        setUserData((d: typeof userData) => ({ ...d, deliverables: lines.join('\n') }));
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
    if (selectedMonth && selectedYear) fetchAndPopulateDeliverables(value, selectedMonth, selectedYear);
  };
  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
    if (selectedPeriod && selectedYear) fetchAndPopulateDeliverables(selectedPeriod, value, selectedYear);
  };
  const handleYearChange = (value: string) => {
    setSelectedYear(value);
    if (selectedPeriod && selectedMonth) fetchAndPopulateDeliverables(selectedPeriod, selectedMonth, value);
  };

  const getDateRange = () => {
    if (!selectedMonth || !selectedYear || !selectedPeriod) return '';
    const monthName = new Date(2000, parseInt(selectedMonth) - 1).toLocaleString('default', { month: 'long' });
    return `${monthName} ${selectedPeriod},  ${selectedYear}`;
  };

  const deliverableLines = (userData.deliverables || '').split('\n').filter((l: string) => l.trim());

  const getDARDoc = () => (
    <DARDocument
      activities={[{ date: '1', day: 'Mon', activities: deliverableLines, remarks: '' }]}
      dateRange={getDateRange()}
      name={userData.name}
      position={userData.position}
      project={userData.project}
      duties={userData.duties}
      verifiedBy={verifiedBy}
    />
  );

  const getDARFileName = () =>
    `${userData.name.split(',')[0] || 'Report'}-AR_${
      new Date(2000, parseInt(selectedMonth) - 1).toLocaleString('default', { month: 'long' })
    }_${selectedPeriod}_${selectedYear}.pdf`;

  const openPNPKISetup = async () => {
    try {
      const asPdf = pdf();
      asPdf.updateContainer(getDARDoc());
      setPreviewPdfBlob(await asPdf.toBlob());
    } catch {
      setPreviewPdfBlob(null);
    }
    setPnpkiOpen(true);
  };

  const handleDARDownload = async () => {
    if (signing) return;
    const asPdf = pdf();
    asPdf.updateContainer(getDARDoc());
    let finalBlob: Blob = await asPdf.toBlob();
    const baseName = getDARFileName();
    let downloadName = baseName;

    if (pnpkiReady) {
      setSigning(true);
      try {
        finalBlob = await signPdfWithPNPKI(finalBlob, pnpkiMergedConfig, baseName);
        downloadName = baseName.replace('.pdf', '_SIGNED.pdf');
      } catch (err) {
        alert(`PNPKI signing failed:\n\n${(err as Error).message}\n\nMake sure the PNPKI server is running at ${pnpkiMergedConfig.serverUrl}.`);
        setSigning(false);
        return;
      } finally {
        setSigning(false);
      }
    }

    const objectUrl = URL.createObjectURL(finalBlob);
    try {
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = downloadName;
      link.click();
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  };

  const getPaginatedActivities = () => {
    const ITEMS_PER_PAGE = 30;
    const pages: string[][] = [];
    for (let i = 0; i < deliverableLines.length; i += ITEMS_PER_PAGE) {
      pages.push(deliverableLines.slice(i, i + ITEMS_PER_PAGE));
    }
    return pages.length > 0 ? pages : [[]];
  };

  const paginatedActivities = getPaginatedActivities();
  const totalPages = paginatedActivities.length;

  // helper: collapsible section header
  const SectionHeader = ({
    title, complete, expanded, onToggle, badge,
  }: { title: string; complete: boolean; expanded: boolean; onToggle: () => void; badge?: string }) => (
    <button
      type="button"
      onClick={onToggle}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-colors text-left ${
        complete
          ? 'border-green-200 bg-green-50 hover:bg-green-100'
          : 'border-red-200 bg-red-50 hover:bg-red-100'
      }`}
    >
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full shrink-0 ${complete ? 'bg-green-500' : 'bg-red-400'}`} />
        <span className={`font-semibold text-sm ${complete ? 'text-green-800' : 'text-red-800'}`}>{title}</span>
        {badge && <span className="text-xs text-gray-400 font-normal">{badge}</span>}
      </div>
      <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''} ${complete ? 'text-green-600' : 'text-red-400'}`} />
    </button>
  );

  return (
    <>
    <div className="min-h-screen bg-gray-50 w-full overflow-y-auto">
      <div className="mx-auto px-3 py-5 max-w-[1100px] md:px-2 md:py-3">

        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-800 leading-tight">Accomplishment Report</h1>
        </div>

        {/* ── Settings card ───────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-4">

          {/* Period row */}
          <div className="px-5 pt-5 pb-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Report Period</p>

            <div className="grid grid-cols-3 gap-3 sm:grid-cols-1">
              {/* Period toggle */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-500">Period</label>
                <div className="flex rounded-md border border-input overflow-hidden h-9 text-sm">
                  {(['1-15', '16-31'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handlePeriodChange(p)}
                      className={`flex-1 px-4 font-medium transition-colors ${
                        selectedPeriod === p
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-background text-muted-foreground hover:bg-muted'
                      } ${p === '1-15' ? 'border-r border-input' : ''}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Month */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-500">Month</label>
                <Select value={selectedMonth} onValueChange={handleMonthChange}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                      <SelectItem key={month} value={month.toString()}>
                        {new Date(2000, month - 1).toLocaleString('default', { month: 'long' })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Year */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-500">Year</label>
                <Select value={selectedYear} onValueChange={handleYearChange}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((year) => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Summary badge — shows once all three are selected */}
            {selectedPeriod && selectedMonth && selectedYear && (
              <div className="mt-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                  {getDateRange()}
                </span>
              </div>
            )}
          </div>

          {/* Personal Information */}
          <div className="px-5 py-4 border-b border-gray-100">
            <SectionHeader
              title="Personal Information"
              complete={isPersonalInfoComplete()}
              expanded={isPersonalInfoExpanded}
              onToggle={() => setIsPersonalInfoExpanded(!isPersonalInfoExpanded)}
              badge={isPersonalInfoComplete() ? 'Complete' : 'Incomplete — required'}
            />
            <div className={`transition-all duration-300 ease-in-out ${isPersonalInfoExpanded ? 'max-h-[2000px] opacity-100 mt-4 overflow-visible' : 'max-h-0 opacity-0 overflow-hidden'}`}>
              <div className="grid grid-cols-3 gap-3 mb-3 sm:grid-cols-1">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-500">Name <span className="text-red-400">*</span></label>
                  <Input
                    className="h-9 text-sm"
                    placeholder="Surname, First Name, MI"
                    value={userData.name}
                    onChange={(e) => setUserData({...userData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-500">Position <span className="text-red-400">*</span></label>
                  <Input
                    className="h-9 text-sm"
                    placeholder="Do not abbreviate"
                    value={userData.position}
                    onChange={(e) => setUserData({...userData, position: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-500">Project</label>
                  <Input
                    className="h-9 text-sm"
                    placeholder="If applicable"
                    value={userData.project}
                    onChange={(e) => setUserData({...userData, project: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-500">Duties and Responsibilities <span className="text-red-400">*</span></label>
                <div className="border border-input rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-ring bg-background">
                  {/* Toolbar */}
                  <div className="flex items-center gap-0.5 px-2 py-1 bg-gray-50 border-b border-input">
                    <button type="button" title="Bullet list (• )" onClick={() => insertAtLines(() => '• ')}
                      className="p-1 rounded hover:bg-gray-200 text-gray-600 transition-colors">
                      <List className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" title="Numbered list" onClick={() => insertAtLines((i) => `${i + 1}. `)}
                      className="p-1 rounded hover:bg-gray-200 text-gray-600 transition-colors">
                      <ListOrdered className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" title="Dash list" onClick={() => insertAtLines(() => '- ')}
                      className="p-1 rounded hover:bg-gray-200 text-gray-600 transition-colors">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-px h-4 bg-gray-300 mx-1" />
                    <Type className="w-3 h-3 text-gray-400" />
                    <button type="button" title="Decrease font size"
                      onClick={() => setDutiesFontSize(s => Math.max(10, s - 1))}
                      className="px-1.5 py-0.5 rounded hover:bg-gray-200 text-gray-600 text-xs font-mono leading-none transition-colors">
                      A−
                    </button>
                    <span className="text-[10px] text-gray-400 font-mono w-5 text-center select-none">{dutiesFontSize}</span>
                    <button type="button" title="Increase font size"
                      onClick={() => setDutiesFontSize(s => Math.min(20, s + 1))}
                      className="px-1.5 py-0.5 rounded hover:bg-gray-200 text-gray-600 text-xs font-mono leading-none transition-colors">
                      A+
                    </button>
                  </div>
                  <textarea
                    ref={dutiesRef}
                    className="w-full px-3 py-2 focus:outline-none bg-background overflow-hidden resize-none"
                    style={{ fontSize: dutiesFontSize, minHeight: 80 }}
                    placeholder="Enter your duties and responsibilities (consistent with approved Terms of Reference)"
                    rows={4}
                    value={userData.duties}
                    onChange={(e) => setUserData({...userData, duties: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actual Deliverables */}
          <div className="px-5 py-4 border-b border-gray-100">
            <SectionHeader
              title="Actual Deliverables"
              complete={isDeliverablesComplete()}
              expanded={isDeliverablesExpanded}
              onToggle={() => setIsDeliverablesExpanded(!isDeliverablesExpanded)}
              badge={isDeliverablesComplete() ? 'Complete' : 'Incomplete — required'}
            />
            <div className={`transition-all duration-300 ease-in-out ${isDeliverablesExpanded ? 'max-h-[2000px] opacity-100 mt-4 overflow-visible' : 'max-h-0 opacity-0 overflow-hidden'}`}>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-500">Actual Deliverables <span className="text-red-400">*</span></label>
                <div className="border border-input rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-ring bg-background">
                  {/* Toolbar */}
                  <div className="flex items-center gap-0.5 px-2 py-1 bg-gray-50 border-b border-input">
                    <button type="button" title="Bullet list (• )" onClick={() => insertAtDeliverableLines(() => '• ')}
                      className="p-1 rounded hover:bg-gray-200 text-gray-600 transition-colors">
                      <List className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" title="Numbered list" onClick={() => insertAtDeliverableLines((i) => `${i + 1}. `)}
                      className="p-1 rounded hover:bg-gray-200 text-gray-600 transition-colors">
                      <ListOrdered className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" title="Dash list" onClick={() => insertAtDeliverableLines(() => '- ')}
                      className="p-1 rounded hover:bg-gray-200 text-gray-600 transition-colors">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-px h-4 bg-gray-300 mx-1" />
                    <Type className="w-3 h-3 text-gray-400" />
                    <button type="button" title="Decrease font size"
                      onClick={() => setDeliverablesFontSize(s => Math.max(10, s - 1))}
                      className="px-1.5 py-0.5 rounded hover:bg-gray-200 text-gray-600 text-xs font-mono leading-none transition-colors">
                      A−
                    </button>
                    <span className="text-[10px] text-gray-400 font-mono w-5 text-center select-none">{deliverablesFontSize}</span>
                    <button type="button" title="Increase font size"
                      onClick={() => setDeliverablesFontSize(s => Math.min(20, s + 1))}
                      className="px-1.5 py-0.5 rounded hover:bg-gray-200 text-gray-600 text-xs font-mono leading-none transition-colors">
                      A+
                    </button>
                  </div>
                  <textarea
                    ref={deliverableRef}
                    className="w-full px-3 py-2 focus:outline-none bg-background overflow-hidden resize-none"
                    style={{ fontSize: deliverablesFontSize, minHeight: 80 }}
                    placeholder="Enter your actual deliverables — each line becomes a separate item in the report"
                    rows={4}
                    value={userData.deliverables || ''}
                    onChange={(e) => setUserData({...userData, deliverables: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Verifier Details */}
          <div className="px-5 py-4">
            <SectionHeader
              title="Verifier Details"
              complete={isAdditionalDetailsComplete()}
              expanded={isAdditionalDetailsExpanded}
              onToggle={() => setIsAdditionalDetailsExpanded(!isAdditionalDetailsExpanded)}
              badge={isAdditionalDetailsComplete() ? 'Complete' : 'Incomplete — required'}
            />
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isAdditionalDetailsExpanded ? 'max-h-[300px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-500">Verified by — Name <span className="text-red-400">*</span></label>
                  <Input
                    className="h-9 text-sm"
                    placeholder="Name of Immediate Supervisor"
                    value={verifiedBy.name}
                    onChange={(e) => setVerifiedBy({...verifiedBy, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-500">Verified by — Designation <span className="text-red-400">*</span></label>
                  <Input
                    className="h-9 text-sm"
                    placeholder="e.g. Regional Director"
                    value={verifiedBy.designation}
                    onChange={(e) => setVerifiedBy({...verifiedBy, designation: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Report Preview ───────────────────────────────────────── */}
        {selectedPeriod && selectedMonth && selectedYear && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            {/* Preview header */}
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 sm:flex-col sm:items-start">
              <div>
                <h2 className="font-semibold text-gray-800 text-sm">Report Preview</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {totalPages} page{totalPages > 1 ? 's' : ''} · live
                </p>
              </div>
              {true && (
                <div className="flex gap-2 sm:w-full">
                  <Button
                    onClick={openPNPKISetup}
                    variant={pnpkiReady ? 'default' : 'outline'}
                    size="sm"
                    className="gap-1.5 sm:flex-1"
                    title={pnpkiReady ? `PNPKI configured — ${pnpkiBaseConfig.fileName}` : 'Set up PNPKI digital signature'}
                  >
                    {pnpkiReady
                      ? <><ShieldCheckIcon className="h-3.5 w-3.5 text-green-300" /> PNPKI ✓</>
                      : <><KeyRoundIcon className="h-3.5 w-3.5 animate-bounce" /> PNPKI</>}
                  </Button>
                  <Button
                    onClick={handleDARDownload}
                    disabled={signing}
                    size="sm"
                    className="gap-1.5 sm:flex-1"
                  >
                    {signing
                      ? <><LoaderIcon className="w-3.5 h-3.5 animate-spin" /> Signing…</>
                      : <><FileDown className="w-3.5 h-3.5" />{pnpkiReady ? 'Save + Sign' : 'Download PDF'}</>}
                  </Button>
                </div>
              )}
            </div>

            {/* Paper pages */}
            <div className="p-4 bg-gray-100 overflow-x-auto">
              {paginatedActivities.map((pageActivities, pageIndex) => (
                <div
                  key={pageIndex}
                  className="mb-6 bg-white shadow-md relative"
                  style={{ width: '8.5in', minHeight: '11in', margin: '0 auto', padding: '0.75in 0.75in 1.2in' }}
                >
                  {/* AFP code */}
                  <div className="absolute top-6 right-6 text-[10px] italic text-gray-400">
                    AFD-HRM-AHR-009/r0/24Nov2025
                  </div>

                  {pageIndex === 0 ? (
                    <>
                      <div className="text-center flex flex-col items-center mb-5 pb-4 border-b border-gray-300">
                        <img src={DICT} className="h-[110px] object-contain" alt="DICT" />
                        <h1 className="text-lg font-bold mt-2">Accomplishment Report</h1>
                        <p className="text-sm text-gray-600 mt-0.5">{getDateRange()}</p>
                      </div>

                      <div className="mb-5 text-sm">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                          {[
                            ['Name', userData.name],
                            ['Office', getDepartmentName((() => { try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; } })().deptid)],
                            ['Position', userData.position],
                            ['Project', userData.project],
                          ].map(([label, value]) => (
                            <div key={label} className="flex gap-3 items-end">
                              <span className="font-bold shrink-0 w-16">{label}</span>
                              <span className="flex-1 border-b border-dotted border-black pb-0.5 font-semibold min-w-0 truncate">{value || ''}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border border-black">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-black bg-gray-50">
                              <th className="border-r border-black px-3 py-2 text-left w-1/2 font-semibold">Duties and Responsibilities</th>
                              <th className="px-3 py-2 text-left w-1/2 font-semibold">Actual Deliverables</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border-r border-dashed border-gray-400 px-3 py-3 whitespace-pre-wrap align-top" style={{ fontSize: dutiesFontSize }}>
                                {userData.duties || '(Consistent with the approved and submitted Terms of Reference)'}
                              </td>
                              <td className="px-3 py-3 align-top">
                                <div className="min-h-[40px]">
                                  {pageActivities.map((activity, actIndex) => (
                                    <div key={actIndex} className="mb-1">
                                      <span style={{ fontSize: deliverablesFontSize }}>{activity}</span>
                                    </div>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-center mb-5 pb-4 border-b border-gray-300">
                        <h1 className="text-lg font-bold">Accomplishment Report (Continued)</h1>
                        <p className="text-sm text-gray-600 mt-0.5">{getDateRange()}</p>
                      </div>
                      <div className="border border-black">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-black bg-gray-50">
                              <th className="border-r border-black px-3 py-2 text-left w-1/2 font-semibold">Duties and Responsibilities</th>
                              <th className="px-3 py-2 text-left w-1/2 font-semibold">Actual Deliverables</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border-r border-dashed border-gray-400 px-3 py-3 whitespace-pre-wrap align-top" style={{ fontSize: dutiesFontSize }}>
                                {userData.duties || '(Consistent with the approved and submitted Terms of Reference)'}
                              </td>
                              <td className="px-3 py-3 align-top">
                                {pageActivities.map((activity, actIndex) => (
                                  <div key={actIndex} className="mb-1">
                                    <span style={{ fontSize: deliverablesFontSize }}>{activity}</span>
                                  </div>
                                ))}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}

                  {/* Signatures — last page only */}
                  {pageIndex === totalPages - 1 && (
                    <>
                      <div className="mt-10 flex justify-between text-sm gap-4">
                        <div>
                          <p className="mb-8 text-gray-600">Prepared by:</p>
                          <div className="border-b border-black w-56 mb-1" />
                          <p className="font-bold">{userData.name || '[Surname, First Name, MI]'}</p>
                          <p className="italic text-xs text-gray-600">{userData.position || '[Position]'}</p>
                        </div>
                        <div>
                          <p className="mb-8 text-gray-600">Verified by:</p>
                          <div className="border-b border-black w-56 mb-1" />
                          <p className="font-bold">{verifiedBy.name || '[Supervisor Name]'}</p>
                          <p className="italic text-xs text-gray-600">{verifiedBy.designation || 'Designation'}</p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Page footer — always visible */}
                  <div className="absolute bottom-6 left-0 right-0 px-6 flex items-end justify-between text-[10px] text-gray-400">
                    <span className="italic">— This is a system-generated file. —</span>
                    <span>Page {pageIndex + 1} of {totalPages}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>

    <PNPKISetup
      open={pnpkiOpen}
      onClose={() => setPnpkiOpen(false)}
      config={pnpkiMergedConfig}
      onSave={handleSavePNPKIDar}
      onClear={handleClearPNPKIDar}
      pdfBlob={previewPdfBlob}
      totalPages={totalPages}
    />
    </>
  );
}

export default ActivityReport