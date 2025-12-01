import { useState, useEffect } from 'react';
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
import { Page, Text, View, Document, StyleSheet, Font, PDFDownloadLink, Image } from '@react-pdf/renderer';
import { Plus, X, FileDown, ChevronDown } from 'lucide-react';

import DICT from './../../../assets/dict.png';
import { getDepartmentName } from '@/helper/department';

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
    textAlign: 'left',
    width: '40%',
  },
  footerRight: {
    textAlign: 'right',
    width: '60%',
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
                  <Text style={styles.infoValue}>{getDepartmentName(JSON.parse(localStorage.getItem('user') || "{}").deptid)}</Text>
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
                      <Text key={i} style={styles.activityItem}>• {act}</Text>
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
                      <Text key={i} style={styles.activityItem}>• {act}</Text>
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

              <View style={styles.footer}>
                <Text style={styles.footerText}>--- This is a system-generated file.---</Text>
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

  const isPersonalInfoComplete = () => {
    return !!userData.name && !!userData.position && !!userData.duties;
  };

  const isAdditionalDetailsComplete = () => {
    return !!verifiedBy.name && !!verifiedBy.designation;
  };
  
  const [_attendanceData, setAttendanceData] = useState<any>(null);
  const [activities, setActivities] = useState<Array<{
    date: string;
    day: string;
    activities: string[];
    remarks: string;
  }>>([]);
  const [newActivity, setNewActivity] = useState('');
  const [currentEditingDay, setCurrentEditingDay] = useState<number | null>(null);
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem('userDAR');
    return saved ? JSON.parse(saved) : {
      name: '',
      position: '',
      project: '',
      duties: ''
    };
  });
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
    localStorage.setItem('additionalDetailsExpanded', JSON.stringify(isAdditionalDetailsExpanded));
  }, [isAdditionalDetailsExpanded]);

  const fetchAttendanceData = async (fromDate: string, toDate: string) => {
    try {
      console.log('Fetching attendance data for:', { fromDate, toDate });
      const response = await axios.post(
        `checkinoutregion/user_filter_by_user_date/`,
        { fromDate, toDate },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      console.log('Attendance API response:', response.data);
      setAttendanceData(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      return null;
    }
  };

  const initializePeriodActivities = async (period: string, month: string, year: string) => {
    if (!period || !month || !year) return;
    
    console.log('Initializing activities for:', { period, month, year });
    
    const monthIndex = parseInt(month) - 1;
    const yearInt = parseInt(year);
    const newActivities = [];
    
    let startDay = 1;
    let endDay = 15;
    
    if (period === '16-31') {
      startDay = 16;
      endDay = new Date(yearInt, monthIndex + 1, 0).getDate();
    }

    const fromDate = `${yearInt}-${(monthIndex + 1).toString().padStart(2, '0')}-${startDay.toString().padStart(2, '0')}`;
    const toDate = `${yearInt}-${(monthIndex + 1).toString().padStart(2, '0')}-${endDay.toString().padStart(2, '0')}`;
    
    const data = await fetchAttendanceData(fromDate, toDate);
    
    for (let i = startDay; i <= endDay; i++) {
      const date = new Date(yearInt, monthIndex, i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const currentDate = `${yearInt}-${(monthIndex + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
      
      const activities = [];
      
      const holiday = data?.holidays?.find((h:any) => h.fromDate === currentDate);
      if (holiday) {
        activities.push(`Holiday: ${holiday.description}`);
      }
      
      const activity = data?.activities?.find((a:any) => a.fromDate === currentDate);
      if (activity && !holiday) {
        activities.push(`${activity.description}`);
      }
      
      newActivities.push({
        date: i.toString(),
        day: dayName,
        activities: activities,
        remarks: holiday || activity ? 'Official Holiday/Activity' : ''
      });
    }
    
    console.log('Setting activities:', newActivities);
    setActivities(newActivities);
  };

  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
    if (selectedMonth && selectedYear) {
      initializePeriodActivities(value, selectedMonth, selectedYear);
    }
  };

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
    if (selectedPeriod && selectedYear) {
      initializePeriodActivities(selectedPeriod, value, selectedYear);
    }
  };

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
    if (selectedPeriod && selectedMonth) {
      initializePeriodActivities(selectedPeriod, selectedMonth, value);
    }
  };

  const addActivity = (dayIndex: number) => {
    if (!newActivity.trim()) return;

    const updatedActivities = [...activities];
    const activityLines = newActivity
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    updatedActivities[dayIndex].activities.push(...activityLines);
    setActivities(updatedActivities);
    setNewActivity('');
  };

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    const updatedActivities = [...activities];
    updatedActivities[dayIndex].activities.splice(activityIndex, 1);
    setActivities(updatedActivities);
  };

  const getDateRange = () => {
    if (!selectedMonth || !selectedYear || !selectedPeriod) return '';
    const monthName = new Date(2000, parseInt(selectedMonth) - 1).toLocaleString('default', { month: 'long' });
    return `${monthName} ${selectedPeriod},  ${selectedYear}`;
  };

  const getPaginatedActivities = () => {
    const allActivities = activities.flatMap(day => day.activities);
    const ITEMS_PER_PAGE = 30;
    const pages: string[][] = [];
    
    for (let i = 0; i < allActivities.length; i += ITEMS_PER_PAGE) {
      pages.push(allActivities.slice(i, i + ITEMS_PER_PAGE));
    }
    
    return pages.length > 0 ? pages : [[]];
  };

  const paginatedActivities = getPaginatedActivities();
  const totalPages = paginatedActivities.length;

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-y-auto">
      <div className="container mx-auto p-3 sm:p-6 max-w-[1200px]">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 mb-6">
          <div className="flex items-center justify-between mb-6 border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-800">Accomplishment Report</h2>
            <div className="text-sm text-gray-500">
              {getDateRange() && `Current Period: ${getDateRange()}`}
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Report Period</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">Period</label>
                <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-15">1-15</SelectItem>
                    <SelectItem value="16-31">16-31</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">Month</label>
                <Select value={selectedMonth} onValueChange={handleMonthChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Month" />
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
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">Year</label>
                <Select value={selectedYear} onValueChange={handleYearChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className={`flex items-center justify-between border rounded-lg p-3 transition-colors cursor-pointer ${isPersonalInfoComplete() ? 'bg-green-50 hover:bg-green-100' : 'bg-red-50 hover:bg-red-100'}`}
              onClick={() => setIsPersonalInfoExpanded(!isPersonalInfoExpanded)}
            >
              <div className="flex items-center gap-2">
                <h3 className={`text-lg font-semibold ${isPersonalInfoComplete() ? 'text-green-700' : 'text-red-700'}`}>Personal Information</h3>
                <span className="text-xs text-gray-500">{isPersonalInfoExpanded ? '(Click to collapse)' : '(Click to expand)'}</span>
              </div>
              <button 
                className={`p-2 rounded-full bg-white border shadow-sm hover:bg-gray-50 transition-all transform ${isPersonalInfoExpanded ? 'rotate-180' : 'rotate-0'}`}
                aria-label={isPersonalInfoExpanded ? 'Collapse section' : 'Expand section'}
              >
                <ChevronDown className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className={`mt-4 transition-all duration-300 ease-in-out overflow-hidden ${isPersonalInfoExpanded ? 'opacity-100 max-h-[1000px]' : 'opacity-0 max-h-0'}`}>
              <div className="grid grid-cols-4 sm:grid-cols-1 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-600">Name</label>
                  <Input 
                    className="w-full"
                    placeholder="[Surname, First Name, MI]"
                    value={userData.name}
                    onChange={(e) => setUserData({...userData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-600">Position</label>
                  <Input 
                    className="w-full"
                    placeholder="[Do not abbreviate position]"
                    value={userData.position}
                    onChange={(e) => setUserData({...userData, position: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-600">Project</label>
                  <Input 
                    className="w-full"
                    placeholder="Project (if applicable)"
                    value={userData.project}
                    onChange={(e) => setUserData({...userData, project: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">Duties and Responsibilities</label>
                <textarea 
                  className="w-full p-4 border rounded-md text-sm text-left"
                  placeholder="Enter your duties and responsibilities"
                  rows={4}
                  value={userData.duties}
                  onChange={(e) => setUserData({...userData, duties: e.target.value})}
                  style={{ textAlign: 'left' }}
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className={`flex items-center justify-between border rounded-lg p-3 transition-colors cursor-pointer ${isAdditionalDetailsComplete() ? 'bg-green-50 hover:bg-green-100' : 'bg-red-50 hover:bg-red-100'}`}
              onClick={() => setIsAdditionalDetailsExpanded(!isAdditionalDetailsExpanded)}
            >
              <div className="flex items-center gap-2">
                <h3 className={`text-lg font-semibold ${isAdditionalDetailsComplete() ? 'text-green-700' : 'text-red-700'}`}>Additional Details</h3>
                <span className="text-xs text-gray-500">{isAdditionalDetailsExpanded ? '(Click to collapse)' : '(Click to expand)'}</span>
              </div>
              <button 
                className={`p-2 rounded-full bg-white border shadow-sm hover:bg-gray-50 transition-all transform ${isAdditionalDetailsExpanded ? 'rotate-180' : 'rotate-0'}`}
                aria-label={isAdditionalDetailsExpanded ? 'Collapse section' : 'Expand section'}
              >
                <ChevronDown className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className={`mt-4 transition-all duration-300 ease-in-out overflow-hidden ${isAdditionalDetailsExpanded ? 'opacity-100 max-h-[1000px]' : 'opacity-0 max-h-0'}`}>
              <div className="grid grid-cols-3 sm:grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-600">Verified by (Name)</label>
                  <Input 
                    className="w-full"
                    placeholder="[Name of Immediate Supervisor]"
                    value={verifiedBy.name}
                    onChange={(e) => setVerifiedBy({...verifiedBy, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-600">Verified by (Designation)</label>
                  <Input 
                    className="w-full"
                    placeholder="Designation"
                    value={verifiedBy.designation}
                    onChange={(e) => setVerifiedBy({...verifiedBy, designation: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {selectedPeriod && selectedMonth && selectedYear && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Report Preview</h2>
                <p className="text-sm text-gray-500 mt-1">Live preview - {totalPages} page{totalPages > 1 ? 's' : ''}</p>
              </div>
              {activities.length > 0 && (
                <PDFDownloadLink
                  document={
                    <DARDocument
                      activities={activities}
                      dateRange={getDateRange()}
                      name={userData.name}
                      position={userData.position}
                      project={userData.project}
                      duties={userData.duties}
                      verifiedBy={verifiedBy}
                    />
                  }
                  fileName={`${userData.name.split(',')[0] || 'Report'}-AR_${new Date(2000, parseInt(selectedMonth) - 1).toLocaleString('default', { month: 'long' })}_${selectedPeriod}_${selectedYear}.pdf`}
                  className="no-underline"
                >
                  <Button>
                    <FileDown className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </PDFDownloadLink>
              )}
            </div>

            {paginatedActivities.map((pageActivities, pageIndex) => (
              <div key={pageIndex} className="mb-8 border-2 border-gray-300 bg-white p-8 relative" style={{ minHeight: '11in', width: '8.5in', margin: '0 auto' }}>
                <div className="absolute top-8 right-8 text-xs italic text-gray-600">
                  AFD-HRM-AHR-009/r0/24Nov2025
                </div>

                {pageIndex === 0 ? (
                  <>
                    <div className="text-center flex justify-center flex-col mb-6 border-b pb-4">
                      <img src={DICT} className='h-[120px] mt-5 object-contain justify-center self-center' alt="" />
                      <h1 className="text-xl font-bold mt-2">Accomplishment Report</h1>
                      <p className="text-sm mt-1">{getDateRange()}</p>
                    </div>

                    <div className="mb-6 text-sm">
                      <div className="grid grid-cols-2 gap-4 mb-2">
                        <div className='  w-full flex gap-4  justify-start'>
                          <span className="font-bold  ">Name</span>
                        <span className=" w-full border-b font-bold border-dotted border-black pb-1">
                          {userData.name || ''}
                        </span>
                        </div>

                        <div className='  w-full flex gap-4  justify-start'>
                          <span className="font-bold  ">Office</span>
                        <span className=" w-full border-b font-bold border-dotted border-black pb-1">
                          {getDepartmentName(JSON.parse(localStorage.getItem('user')||"{}").deptid)}
                        </span>
                        </div>
                        
                        <div className='  w-full flex gap-4  justify-start'>
                          <span className="font-bold  ">Position</span>
                        <span className=" w-full border-b font-bold border-dotted border-black pb-1">
                          {userData.position || ''}
                        </span>
                        </div>
                        
                        
                        <div className='  w-full flex gap-4  justify-start'>
                          <span className="font-bold  ">Project</span>
                        <span className=" w-full border-b font-bold border-dotted border-black pb-1">
                          {userData.project || ''}
                        </span>


                        </div>
                        
                       
                      </div>
                    </div>

                    <div className="border border-black">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-black">
                            <th className="border-r border-black px-2 py-2 text-left w-1/2">Duties and Responsibilities</th>
                            <th className="px-2 py-2 text-left w-1/2">Actual Deliverables</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-dotted border-gray-400">
                            <td className="border-r border-dotted border-gray-400 px-4 py-4 whitespace-pre-wrap text-sm text-left align-top">
                              {userData.duties || '(Consistent with the approved and submitted Terms of Reference)'}
                            </td>   
                            <td className="px-2 py-2">
                              <div className="min-h-[30px]">
                                {pageActivities.map((activity, actIndex) => (
                                  <div key={actIndex} className="flex items-start gap-2 group mb-1">
                                    <span>• {activity}</span>
                                    <button
                                      onClick={() => {
                                        
                                        const globalIndex = actIndex;
                                        let currentCount = 0;
                                        for (let i = 0; i < activities.length; i++) {
                                          for (let j = 0; j < activities[i].activities.length; j++) {
                                            if (currentCount === globalIndex) {
                                              removeActivity(i, j);
                                              return;
                                            }
                                            currentCount++;
                                          }
                                        }
                                      }}
                                      className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                                {pageIndex === 0 && (
                                  <button
                                    onClick={() => setCurrentEditingDay(0)}
                                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs mt-1"
                                  >
                                    <Plus className="w-3 h-3" />
                                    Add activity
                                  </button>
                                )}
                                {currentEditingDay === 0 && (
                                  <div className="flex gap-1 mt-1">
                                    <textarea
                                      value={newActivity}
                                      onChange={(e) => setNewActivity(e.target.value)}
                                      placeholder="Type or paste multiple activities (each line will be a separate bullet point)"
                                      className="flex-1 text-xs px-2 py-1 border rounded min-h-[100px]"
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter' && e.ctrlKey) {
                                          e.preventDefault();
                                          addActivity(0);
                                        }
                                      }}
                                    />
                                    <button 
                                      onClick={() => addActivity(0)}
                                      className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                                    >
                                      Add
                                    </button>
                                    <button 
                                      onClick={() => {
                                        setCurrentEditingDay(null);
                                        setNewActivity('');
                                      }}
                                      className="px-2 py-1 border rounded text-xs"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center mb-6 border-b pb-4">
                      <h1 className="text-xl font-bold">Accomplishment Report (Continued)</h1>
                      <p className="text-sm mt-1">{getDateRange()}</p>
                    </div>

                    <div className="border border-black">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-black">
                            <th className="border-r border-black px-2 py-2 text-left w-1/2">Duties and Responsibilities</th>
                            <th className="px-2 py-2 text-left w-1/2">Actual Deliverables</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-dotted border-gray-400">
                            <td className="border-r border-dotted border-gray-400 px-4 py-4 whitespace-pre-wrap text-sm text-left align-top">
                              {userData.duties || '(Consistent with the approved and submitted Terms of Reference)'}
                            </td>   
                            <td className="px-2 py-2">
                              <div className="min-h-[30px]">
                                {pageActivities.map((activity, actIndex) => (
                                  <div key={actIndex} className="flex items-start gap-2 group mb-1">
                                    <span>• {activity}</span>
                                    <button
                                      onClick={() => {
                                        const globalIndex = (pageIndex * 30) + actIndex;
                                        let currentCount = 0;
                                        for (let i = 0; i < activities.length; i++) {
                                          for (let j = 0; j < activities[i].activities.length; j++) {
                                            if (currentCount === globalIndex) {
                                              removeActivity(i, j);
                                              return;
                                            }
                                            currentCount++;
                                          }
                                        }
                                      }}
                                      className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                {pageIndex === totalPages - 1 && (
                  <>
                    <div className="mt-12 flex justify-between text-sm">
                      <div>
                        <p className="mb-8">Prepared by:</p>
                        <div className="border-b border-black w-64 mb-1"></div>
                        <p className="font-bold">{userData.name || '[Surname, First Name, MI]'}</p>
                        <p className="italic text-xs">{userData.position || '[Do not abbreviate position]'}</p>
                      </div>
                      <div>
                        <p className="mb-8">Verified by:</p>
                        <div className="border-b border-black w-64 mb-1"></div>
                        <p className="font-bold">{verifiedBy.name || '[Name of Immediate Supervisor]'}</p>
                        <p className="italic text-xs">{verifiedBy.designation || 'Designation'}</p>
                      </div>
                    </div>

                    <div className="mt-10 text-center">
                      <p className="italic text-xs">--- This is a system-generated file.---</p>
                    </div>
                  </>
                )}

                <div className="absolute bottom-8 right-8 text-xs text-gray-600">
                  Page {pageIndex + 1} of {totalPages}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ActivityReport