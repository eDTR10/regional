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
import { Plus, X, FileDown } from 'lucide-react';

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
    fontFamily: 'Palatino',
    fontSize: 10
  },
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
    marginTop: 8,
    marginBottom: 5,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  dateRange: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 15
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
    fontStyle:'bold',
    minWidth: 60
  },
  infoValue: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    fontStyle:'bold',
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
  dutiesCell: {
    width: '50%',
    padding: 8,
    fontSize: 8,
    borderRightWidth: 1,
    borderRightColor: '#000',
    borderStyle: 'dashed',
    textAlign: 'left'
  },
  activityCell: {
    width: '50%',
    padding: 2,
    fontSize: 8,
    paddingLeft: 10
  },
  activityItem: {
    fontSize: 8
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
    top: 30,
    right: 30,
    fontSize: 8,
    fontStyle: 'italic'
  }
});

// PDF Document Component
const DARDocument = ({ activities, dateRange, name, position, project, verifiedBy, duties }: any) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.afpCode}>AFD-HR-T-005/r0/{dateRange}</Text>
      
      <View style={styles.headerSection}>
       
         <Image src={DICT} style={{  width:290, objectFit: 'contain', alignSelf: 'center', marginBottom: 5 }} />
       
        <Text style={styles.title}>Accomplishment Report</Text>
        <Text style={styles.dateRange}>{dateRange}</Text>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.infoValue}>{name || '[Surname, First Name, MI]'}</Text>
          <Text style={[styles.label, { marginLeft: 20 }]}>Office</Text>
          <Text style={styles.infoValue}>{getDepartmentName(JSON.parse(localStorage.getItem('user')||"").deptid)}</Text>
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
          <Text style={styles.dutiesCell}>Duties and Responsibilities</Text>
          <Text style={styles.activityCell}>Actual Deliverables</Text>
        </View>
        
        <View style={styles.tableRow}>
          <Text style={styles.dutiesCell}>{duties || '(Consistent with the approved and submitted Terms of Reference)'}</Text>
          <View style={styles.activityCell}>
            {activities.flatMap((activity: { activities: string[] }) => 
              activity.activities.map((act: string, i: number) => (
                <Text key={i} style={styles.activityItem}>• {act}</Text>
              ))
            )}
          </View>
        </View>
      </View>

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

      <View style={{marginTop:40,textAlign:'center',}}>
        <Text style={{fontStyle: 'italic', fontSize: 10}}>--- This is a system-generated file.---</Text>
      </View>
    </Page>
  </Document>
);

function ActivityReport() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
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

  // Save to localStorage whenever the data changes
  useEffect(() => {
    localStorage.setItem('userDAR', JSON.stringify(userData));
  }, [userData]);

  useEffect(() => {
    localStorage.setItem('verifierDAR', JSON.stringify(verifiedBy));
  }, [verifiedBy]);

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

  // Initialize activities for the selected period
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

    // Format dates for API call
    const fromDate = `${yearInt}-${(monthIndex + 1).toString().padStart(2, '0')}-${startDay.toString().padStart(2, '0')}`;
    const toDate = `${yearInt}-${(monthIndex + 1).toString().padStart(2, '0')}-${endDay.toString().padStart(2, '0')}`;
    
    // Fetch attendance data
    const data = await fetchAttendanceData(fromDate, toDate);
    
    for (let i = startDay; i <= endDay; i++) {
      const date = new Date(yearInt, monthIndex, i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const currentDate = `${yearInt}-${(monthIndex + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
      
      const activities = [];
      
      // Check for holidays
      const holiday = data?.holidays?.find((h:any) => h.fromDate === currentDate);
      if (holiday) {
        activities.push(`Holiday: ${holiday.description}`);
      }
      
      // Check for activities
      const activity = data?.activities?.find((a:any) => a.fromDate === currentDate);
      if (activity && !holiday) { // Don't add activity if it's the same as holiday
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
    // Split the text by newlines and filter out empty lines
    const activityLines = newActivity
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    // Add each line as a separate activity
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

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-y-auto">
      <div className="container mx-auto p-3 sm:p-6 max-w-[1200px]">
        {/* Control Panel */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 mb-6">
          <div className="flex items-center justify-between mb-6 border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-800">Accomplishment Report</h2>
            <div className="text-sm text-gray-500">
              {getDateRange() && `Current Period: ${getDateRange()}`}
            </div>
          </div>
          
          {/* Date Selection Section */}
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

          {/* Personal Information Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Personal Information</h3>
            <div className="grid grid-cols-3 sm:grid-cols-1 gap-6 mb-6">
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

          {/* Additional Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Additional Details</h3>
            <div className="grid grid-cols-3 gap-6">
             
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

        {/* Live Preview */}
        {selectedPeriod && selectedMonth && selectedYear && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Report Preview</h2>
                <p className="text-sm text-gray-500 mt-1">Live preview of your activity report</p>
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
                  fileName={`${userData.name.split(',')[0]}-AR_${new Date(2000, parseInt(selectedMonth) - 1).toLocaleString('default', { month: 'long' })}_${selectedPeriod}_${selectedYear}.pdf`}
                  className="no-underline"
                >
                  <Button>
                    <FileDown className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </PDFDownloadLink>
              )}
            </div>

            {/* Report Header */}
            <div className="text-center flex justify-center flex-col mb-6 border-b pb-4">
              <img src={DICT} className=' h-[120px] object-contain justify-center self-center' alt="" />
              <h1 className="text-x; font-bold mt-2">Daily Accomplishment Report</h1>
              <p className="text-sm mt-1">{getDateRange()}</p>
            </div>

            {/* User Info */}
            {/* <div className="mb-4 text-sm">
              <div className="flex gap-8 mb-2">
                <div className="flex flex-1">
                  <span className="font-medium mr-2">Name:</span>
                  <span className="border-b border-dotted border-gray-400 flex-1 px-1">
                    {userData.name || '[Surname, First Name, MI]'}
                  </span>
                </div>
                <div className="flex flex-1">
                  <span className="font-medium mr-2">Office:</span>
                  <span className="border-b border-dotted border-gray-400 flex-1 px-1">
                    Regional Office
                  </span>
                </div>
              </div>
              <div className="flex gap-8">
                <div className="flex flex-1">
                  <span className="font-medium mr-2">Position:</span>
                  <span className="border-b border-dotted border-gray-400 flex-1 px-1">
                    {userData.position || '[Do not abbreviate position]'}
                  </span>
                </div>
                <div className="flex flex-1">
                  <span className="font-medium mr-2">Project:</span>
                  <span className="border-b border-dotted border-gray-400 flex-1 px-1">
                    {userData.project || ''}
                  </span>
                </div>
              </div>
            </div> */}

            {/* Activity Table */}
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
                        {activities.flatMap((day, dayIndex) => 
                          day.activities.map((activity, activityIndex) => (
                            <div key={`${dayIndex}-${activityIndex}`} className="flex items-start gap-2 group mb-1">
                              <span>• {activity}</span>
                              <button
                                onClick={() => removeActivity(dayIndex, activityIndex)}
                                className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))
                        )}
                        <button
                          onClick={() => setCurrentEditingDay(0)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs mt-1"
                        >
                          <Plus className="w-3 h-3" />
                          Add activity
                        </button>
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

            {/* Signature Section */}
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
          </div>
        )}
      </div>
    </div>
  );
}

export default ActivityReport;