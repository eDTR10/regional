import { Page, Text, View, Document, Image, Font } from '@react-pdf/renderer';
import { convertDate } from '@/helper/date-time';
import DICT from './../../../../assets/dict.png';
import { convertStatus } from '@/helper/convert-status';

Font.register({
  family: 'Palatino',
  fonts: [
    { src: `/${import.meta.env.VITE_LINK}/palatino-linotype-family/palatinolinotype_regular.ttf` }, // normal
    { src: `/${import.meta.env.VITE_LINK}/palatino-linotype-family/palatinolinotype_italic.ttf`, fontStyle: 'italic' }, // italic
    { src: `/${import.meta.env.VITE_LINK}/palatino-linotype-family/palatinolinotype_bold.ttf`, fontStyle: 'bold' } // bold
  ]
});

const MyDocument = ({ name, date, data,selectedYear, selectedMonth,previewUrl,selectedSchedule }: any) => {
  const getDateFromChecktime = (checktime: any) => new Date(checktime).getUTCDate();


  let groupedData: any = {};

  data.results?.forEach((item: any) => {
    const date = getDateFromChecktime(item.CHECKTIME);
    if (!groupedData[date]) {
      groupedData[date] = { I: [], O: [], i: [], o: [] };
    }
  
    const timeString = convertDate(item.CHECKTIME).localeTime12HourFormat;
  
    // Check the time conditions
    if (item.CHECKTYPE === 'I') {
      groupedData[date].I.push(timeString.replace(/ AM| PM/, ''));
    } else if (item.CHECKTYPE === 'o') {
      groupedData[date].O.push(timeString.replace(/ AM| PM/, ''));
    } else if (item.CHECKTYPE === '0') {
      groupedData[date].i.push(timeString.replace(/ AM| PM/, '') || '12:00');
    } else if (item.CHECKTYPE === 'i') {
      groupedData[date].o.push(timeString.replace(/ AM| PM/, ''));
    }
  });
  
  // Helper function to convert 12-hour time to 24-hour time format
  

  const activitiesByDate: any = {};
  data.activities?.forEach((activity: any) => {
    const fromDate = new Date(activity.fromDate);
    const toDate = new Date(activity.toDate);
    
    for (let d = new Date(fromDate); d <= toDate; d.setDate(d.getDate() + 1)) {
        const date = d.getDate();
        
        if (!activitiesByDate[date]) {
            activitiesByDate[date] = [];
        }
        
        activitiesByDate[date].push({
            activity_id: activity.activity_id,
            description:  `${convertStatus(activity.status)} - ${activity.description}`,
            status: activity.status,
            period: activity.period,
        });
    }
});


const renderCheckinText = (data:any) => {

  let lenghtData = data.length;
  switch (lenghtData) {
    case 6:
      return data[lenghtData -1];
    case 5:
      return data[lenghtData -1];
    case 4:
      return data[lenghtData -1];
    case 3:
      return data[lenghtData -1];
    case 2:
      return data[lenghtData -1];
    case 1:
      return data[lenghtData -1];
    default:
      return '';
  }
};
const renderCheckOutText = (data:any) => {
  switch (data.length) {
    case 4:
      return data[0];
    case 3:
      return data[0];
    case 2:
      return data[0];
    case 1:
      return data[0];
    default:
      return '';
  }
};

const renderAmDepartureText = (outTime:any,inTime:any) => {
     
      switch (outTime.length) {
        case 3:
          if (inTime.length !=0 && outTime.length !=2) {
            return "12:00"
          }else{
            return outTime[0]
          }
    
          
        case 2:
          if (inTime.length !=0 && outTime.length !=2) {
            return "12:00"
          }else{
            return outTime[0]
          }
        case 1:
          if (inTime.length !=0 && outTime.length !=1) {
            return "12:00"
          }else{
            return outTime[0]
          }
          
          
      
    
          
        default:
          if (inTime.length !=0) {
            return "12:00"
          }else{
            return '';
          }
          
      }

    
    
  

  
  
};

const renderPMArivalText = (inTime:any,outTime:any) => {
 
    switch (inTime.length) {
      case 3:
        if (outTime.length !=0  && outTime.length !=3) {
          return "01:00"
        }else{
        return inTime[0]
      }
  
        
      case 2:
        if (outTime.length !=0  && outTime.length !=2) {
          return "01:00"
        }else{
        return inTime[0]
      }
      case 1:
        if (outTime.length !=0  && outTime.length !=1) {
          return "01:00"
        }else{
        return inTime[0]
      }
        
    
  
        
      default:
        if (outTime.length !=0) {
          return "01:00"
        }else{
          return '';
        }
    }

  
  
  
};

const getScheduleTime = (scheduleValue: string): { timeIn: number, timeOut: number } => {
  const schedules: { [key: string]: { timeIn: number, timeOut: number } } = {

    "4": { timeIn: 6 * 60, timeOut: 18 * 60 },  // 6:00-6:00
    "5": { timeIn: 7 * 60, timeOut: 16 * 60 },  // 7:00-4:00
    "6": { timeIn: 7.5 * 60, timeOut: 16.5 * 60 }, // 7:30-4:30
    "7": { timeIn: 8 * 60, timeOut: 17 * 60 },  // 8:00-5:00
    "8": { timeIn: 8.5 * 60, timeOut: 17.5 * 60 }, // 8:30-5:30
    "9": { timeIn: 9 * 60, timeOut: 18 * 60 },  // 9:00-6:00
    "10": { timeIn: 9.5 * 60, timeOut: 18.5 * 60 }, // 9:30-6:30
    "11": { timeIn: 10 * 60, timeOut: 19 * 60 }  // 10:00-7:00
  };
  
  return schedules[scheduleValue] || schedules["7"]; // Default to 8:00-5:00 if invalid
};



const undertimeCalc = (timeIn: string, timeOut: string, day: number): { hours: number | string, minutes: number | string } => {
  // Check if the current day is within the selected date range
  const currentDate = new Date(selectedYear, selectedMonth - 1, day);
  const startDate = new Date(selectedYear, selectedMonth - 1, 1);
  const endDate = new Date(selectedYear, selectedMonth, 0); // Last day of selected month
  
  // If date is outside the selected range, return blank
  if (currentDate < startDate || currentDate > endDate) {
    return { hours: '', minutes: '' };
  }

  // Get selected schedule from localStorage
  const selectedSched = selectedSchedule || "7";
  const schedule = getScheduleTime(selectedSched);

  // Use schedule times instead of hardcoded values
  const expectedTimeIn = schedule.timeIn;
  const expectedTimeOut = schedule.timeOut;

  // If both timeIn and timeOut are blank, return full day undertime based on schedule
  if ((!timeIn || timeIn.trim() === '') && (!timeOut || timeOut.trim() === '')) {
    const totalWorkHours = (expectedTimeOut - expectedTimeIn - 60) / 60; // Subtract 1 hour for lunch
    return { hours: totalWorkHours, minutes: 0 };
  }

  // If no timeOut is provided (empty string or undefined), calculate full afternoon undertime
  if (!timeOut || timeOut.trim() === '') {
    // If there's no checkout time, assume they didn't work the afternoon
    const afternoonHours = (expectedTimeOut - (12 * 60 + 60)) / 60; // From 1:00 PM to expected end time
    return { hours: Math.floor(afternoonHours), minutes: (afternoonHours % 1) * 60 };
  }

  // Convert input times to minutes
  const [inHour, inMinute] = timeIn?timeIn.split(':').map(Number):'12:00'.split(':').map(Number);
  const [outHour, outMinute] = timeOut.split(':').map(Number);
  
  const actualTimeIn = (inHour * 60) + inMinute;
  const actualTimeOut = (outHour * 60) + outMinute;

  // Calculate total undertime minutes
  let undertimeMinutes = 0;

  // Check if came in late
  if (actualTimeIn > expectedTimeIn) {
    undertimeMinutes += actualTimeIn - expectedTimeIn;
  }

  // Check if left early 
  if (actualTimeOut < expectedTimeOut) {
    undertimeMinutes += expectedTimeOut - actualTimeOut;
  }

  // Convert to hours and minutes
  const hours = timeIn || timeOut? Math.floor(undertimeMinutes / 60) : Math.floor((expectedTimeOut - expectedTimeIn - 60) / 60);
  const minutes = undertimeMinutes % 60;

  return { hours, minutes };
};



  return (
    <Document title={`${name?name.toUpperCase():""}_DTR_${date}.pdf`}   >
      <Page size="A4" style={{ fontFamily: 'Palatino', flexDirection: 'row', backgroundColor: '#ffffff', fontSize: 8, padding: 30,gap:10 }}>
      {[1, 2].map((_, index) => (
          <View key={index} style={{ width: '50%', border: 0.5, borderStyle: 'solid', padding: 8 }}>
            <Text style={{ fontSize: 6, marginBottom: 5,fontStyle: 'italic' }}>  Civil Service Form No. 48</Text>
            <Image src={DICT} style={{ height: 60, objectFit: 'contain', alignSelf: 'center', marginBottom: 10 }} />
            <Text style={{ fontSize: 14, fontStyle: 'bold', textAlign: 'center', marginBottom: 3 }}>DAILY TIME RECORD</Text>
            <Text style={{ fontSize: 10, textAlign: 'center', marginBottom: 10 }}></Text>
            <Text style={{ fontSize: 9, textAlign: 'center', textTransform: 'uppercase', borderBottom: 0.5, marginBottom: 1,borderStyle:"dashed",fontStyle:'bold' }}>{name?name.toUpperCase():"JOHN C. DOE"}</Text>
            

            <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 5 }}>
              <View style={{ width: '50%',textAlign:'left', fontStyle: 'italic' }}>
                <Text>For the month of</Text>
                <Text>Official hours for arrival</Text>
                <Text>and departure</Text>
              </View>
              <View style={{ width: '50%' }}>
                <Text style={{ borderBottom: 0.5, marginBottom: 1 , fontStyle: 'bold',textAlign:'center'}}>{date}</Text>
                <View style={{flexDirection: 'row'}}>
                    <Text>Regular days</Text>
                    <View style={{borderBottom: 0.5, marginBottom: 1,marginLeft:22,width: '100%' }}></View>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <Text>Saturdays</Text>
                    <View style={{borderBottom: 0.5, marginBottom: 1,marginLeft:20,width: '100%' }}></View>
                </View>
                
                
              </View>
            </View>

            <View style={{ border: 0.5, marginVertical:10, borderStyle: 'solid', borderTopStyle: 'solid',borderTopColor:"#808080",borderTopWidth:1,borderLeftWidth:0, borderRightWidth:0, borderBottomStyle: 'solid',  }}>
            <View key={index} style={{ flexDirection: 'row', borderBottom: 0.5, alignItems: 'center', height: 12, fontSize: 7, borderBottomStyle: 'solid' }}>
                    <View style={{ width: '8%', borderRight: 0.5, paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center', borderRightStyle: 'solid' }}>
                      <Text>Day</Text>
                    </View>
                    <View style={{ width: '34.5%', borderRight: 0.5, paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center', borderStyle: 'solid' }}>
                      <Text>AM</Text>
                    </View>
                    <View style={{ width: '34.5%', borderRight: 0.5, paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center', borderStyle: 'solid' }}>
                      <Text>PM</Text>
                    </View>
                   
                    <View style={{ width: '23%', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                      <Text>Undertime</Text>
                    </View>
                  </View>
              <View key={index} style={{ flexDirection: 'row', alignItems: 'center', height: 14, fontSize: 7,borderBottom: 1, borderBottomColor:"#808080" , textAlign: 'center', }}>
                    <View style={{ width: '8%', borderRight: 0.5, paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                      <Text></Text>
                    </View>
                    <View style={{ width: '17.25%', borderRight: 0.5, paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                      <Text>Arrival</Text>
                    </View>
                    <View style={{ width: '17.25%', borderRight: 0.5, paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                      <Text>Departure</Text>
                    </View>
                    <View style={{ width: '17.25%', borderRight: 0.5, paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                      <Text>Arrival</Text>
                    </View>
                    <View style={{ width: '17.25%', borderRight: 0.5, paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                      <Text>Departure</Text>
                    </View>
                    <View style={{ width: '10%',borderRight: 0.5, paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                      <Text>Hours</Text>
                    </View>
                    <View style={{ width: '13%', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                      <Text>Minutes</Text>
                    </View>
                  </View>

                  {Array.from({ length: 31 }, (_, index) => {
 const day = index + 1;
 const dayOfWeek = new Date(selectedYear, selectedMonth - 1, day).getDay();
 const dayName = dayOfWeek === 0 ? 'Sunday' : dayOfWeek === 6 ? 'Saturday' : '';
 const checkinTimes = groupedData[day]?.I || [];
 const checkoutTimes = groupedData[day]?.O || [];
 const checkoinTimes2 = groupedData[day]?.i || [];
 const checkoutTimes2 = groupedData[day]?.o || [];
const activities = activitiesByDate[day] || [];

const convertTo24Hour = (time: any): string => {
  // If time is empty, undefined, or not a string
  if (!time || typeof time !== 'string') return '';
  
  const [hours, minutes] = time.split(':').map(Number);
  
  // Check if hours and minutes are valid numbers
  if (isNaN(hours) || isNaN(minutes)) return '';
  
  // Convert 1:00 to 13:00 for afternoon times
  const hours24 = hours >= 1 && hours <= 11 ? hours + 12 : hours;
  
  return `${hours24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};
  

  

  if (dayName || activities.length > 0) {
    // Check if there's any actual attendance data (check-in/out times)
    const hasAttendanceData = (checkinTimes && checkinTimes.length > 0) || 
                             (checkoutTimes && checkoutTimes.length > 0) || 
                             (checkoinTimes2 && checkoinTimes2.length > 0) || 
                             (checkoutTimes2 && checkoutTimes2.length > 0);

    return (
      <View key={index} style={{ flexDirection: 'row', borderBottom: 0.5, alignItems: 'center', height: 12, fontSize: 7, textAlign: 'center' }}>
        <View style={{ width: '8%', borderRight: 0.5, height: '100%', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <Text style={{ textAlign: 'center', marginTop: 2 }}>{day} </Text>
        </View>

        {/* If there's attendance data, prioritize showing actual times over activities/holidays */}
        {hasAttendanceData ? (
          // Show actual check times when employee worked (even on holidays)
          // Use green background if it's a holiday/activity day AND employee worked
          <>
            <View style={{ width: '17.25%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center', backgroundColor: activities.length > 0 || dayName ? "#bff6bf" : "transparent" }}>
              <Text style={{ textAlign: 'center', marginTop: 2 }}>{renderCheckinText(checkinTimes)}</Text>
            </View>
            <View style={{ width: '17.25%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center', backgroundColor: activities.length > 0 || dayName ? "#bff6bf" : "transparent" }}>
              <Text style={{ textAlign: 'center', marginTop: 2 }}>{renderAmDepartureText(checkoinTimes2,checkinTimes)}</Text>
            </View>
            <View style={{ width: '17.25%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center', backgroundColor: activities.length > 0 || dayName ? "#bff6bf" : "transparent" }}>
              <Text style={{ textAlign: 'center', marginTop: 2 }}>{renderPMArivalText(checkoutTimes2,checkoutTimes)}</Text>
            </View>
            <View style={{ width: '17.25%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center', backgroundColor: activities.length > 0 || dayName ? "#bff6bf" : "transparent" }}>
              <Text style={{ textAlign: 'center', marginTop: 2 }}>{renderCheckOutText(checkoutTimes)}</Text>
            </View>
            <View style={{ width: '10%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
              <Text style={{ textAlign: 'center', marginTop: 2 }}>
                {undertimeCalc(renderCheckinText(checkinTimes), convertTo24Hour(renderCheckOutText(checkoutTimes)) || '', day).hours}
              </Text>
            </View>
            <View style={{ width: '10%', paddingLeft: 2, height: '100%', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <Text style={{ textAlign: 'center', marginTop: 2 }}>
                {undertimeCalc(renderCheckinText(checkinTimes), convertTo24Hour(renderCheckOutText(checkoutTimes)) || '', day).minutes}
              </Text>
            </View>
          </>
        ) : activities?.length > 0 ? (
                          activities?.map((activity: any, idx: number) => {
                            if (activity.period === 1) {
                              return (
                                <>
                                <View key={idx} style={{ width: '69%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                                  <Text style={{ textAlign: 'center', marginTop: 2 }}>{ `${activity.description}`}</Text>
                                </View>
                                <View style={{ width: '10%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                      <Text style={{ textAlign: 'center', marginTop: 2 }}>
                    
                      </Text>
                      
                    </View>
                    <View style={{ width: '10%', paddingLeft: 2, height: '100%', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                      <Text style={{ textAlign: 'center', marginTop: 2 }}>

                       
                      </Text>
                    </View>
                                
                                </>
                                
                                
                              );
                            } else if (activity.period === 2) {
                              return (
                                <>
                                  <View key={idx} style={{ width: '34.5%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                                    <Text style={{ textAlign: 'center', marginTop: 2 }}>{ `${activity.description}`}</Text>
                                  </View>
                                  <View style={{ width: '17.25%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                      <Text style={{ textAlign: 'center', marginTop: 2 }}>{renderPMArivalText(checkoutTimes2,checkoutTimes)}</Text>
                    </View>
                    <View style={{ width: '17.25%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                      <Text style={{ textAlign: 'center', marginTop: 2 }}>{renderCheckOutText(checkoutTimes)}</Text>
                    </View>

                      <View style={{ width: '10%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                      <Text style={{ textAlign: 'center', marginTop: 2 }}>

                      {
                      undertimeCalc("12:00", convertTo24Hour(renderCheckOutText(checkoutTimes)) || '', day).hours }
                    
                      </Text>
                      
                    </View>
                    <View style={{ width: '10%', paddingLeft: 2, height: '100%', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                      <Text style={{ textAlign: 'center', marginTop: 2 }}>{
                      undertimeCalc("12:00", convertTo24Hour(renderCheckOutText(checkoutTimes)) || '', day).minutes }

                       
                      </Text>
                    </View>
                                </>
                              );
                            }
                            else if (activity.period === 3) {
                              return (
                                <>
                                <View style={{ width: '17.25%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                      <Text style={{ textAlign: 'center', marginTop: 2 }}>{renderCheckinText(checkinTimes)}</Text>
                    </View>
                    <View style={{ width: '17.25%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                      <Text style={{ textAlign: 'center', marginTop: 2 }}>{renderAmDepartureText(checkoinTimes2,checkinTimes)}</Text>
                    </View>
                                 
                                  <View key={idx} style={{ width: '34.5%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                                    <Text style={{ textAlign: 'center', marginTop: 2 }}>{ `${activity.description}`}</Text>
                                  </View>
                                  <View style={{ width: '10%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                      <Text style={{ textAlign: 'center', marginTop: 2 }}>

                      {
                      undertimeCalc(renderCheckinText(checkinTimes), convertTo24Hour(renderCheckOutText(checkoutTimes)) || '', day).hours }
                    
                      </Text>
                      
                    </View>
                    <View style={{ width: '10%', paddingLeft: 2, height: '100%', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                      <Text style={{ textAlign: 'center', marginTop: 2 }}>{
                      undertimeCalc(renderCheckinText(checkinTimes), convertTo24Hour(renderCheckOutText(checkoutTimes)) || '', day).minutes }

                       
                      </Text>
                    </View>
                                  
                                </>
                              );
                            };
                          })
                        ):
                        dayName?
                        <>
                            <View style={{ width: '69%', borderRight: 0.5, alignItems: 'center', height: '100%', borderStyle:"solid" }}>
                              <Text style={{ textAlign: 'center', marginTop: 2 }}>{dayName}</Text>
                            </View>
                            <View style={{ width: '10%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                              <Text style={{ textAlign: 'center', marginTop: 2 }}></Text>
                            </View>
                            <View style={{ width: '10%', paddingLeft: 2, height: '100%', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                              <Text style={{ textAlign: 'center', marginTop: 2 }}></Text>
                            </View>
                        </>
                          
                          
                          
                          
                          :  ""
                       
                        
                        
                      
                      }
                        
      </View>
    );
  } else {
     return (
                  <View key={index} style={{ flexDirection: 'row', borderBottom: 0.5, alignItems: 'center', height: 12, fontSize: 7, textAlign: 'center', borderStyle: 'dashed' }}>
                    <View style={{ width: '8%', borderRight: 0.5, height: '100%', alignItems: 'center', justifyContent: 'center', textAlign: 'center', borderStyle: 'dashed' }}>
                      <Text style={{ textAlign: 'center', marginTop: 2 }}>{day} {dayName && `(${dayName})`}</Text>
                    </View>
                    <View style={{ width: '17.25%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                      <Text style={{ textAlign: 'center', marginTop: 2 }}>{renderCheckinText(checkinTimes)}</Text>
                    </View>
                    <View style={{ width: '17.25%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                      <Text style={{ textAlign: 'center', marginTop: 2 }}>{renderAmDepartureText(checkoinTimes2,checkinTimes)}</Text>
                    </View>
                    <View style={{ width: '17.25%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                      <Text style={{ textAlign: 'center', marginTop: 2 }}>{renderPMArivalText(checkoutTimes2,checkoutTimes)}</Text>
                    </View>
                    <View style={{ width: '17.25%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                      <Text style={{ textAlign: 'center', marginTop: 2 }}>{renderCheckOutText(checkoutTimes)}</Text>
                    </View>
                    <View style={{ width: '10%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                      <Text style={{ textAlign: 'center', marginTop: 2 }}>

                      {undertimeCalc(renderCheckinText(checkinTimes), convertTo24Hour(renderCheckOutText(checkoutTimes)) || '', day).hours}
                    
                      </Text>
                      
                    </View>
                    <View style={{ width: '10%', paddingLeft: 2, height: '100%', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                      <Text style={{ textAlign: 'center', marginTop: 2 }}>{undertimeCalc(renderCheckinText(checkinTimes), convertTo24Hour(renderCheckOutText(checkoutTimes)) || '', day).minutes}

                       
                      </Text>
                    </View>
                  </View>
                )
  }
})}


              
<View style={{ flexDirection: 'row', borderBottom: 'none', alignItems: 'center', height: 12 }}>
                <View style={{ width: '60%', height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                 
                </View>
                <View style={{ width: '17%',  height: '100%', justifyContent: 'center', textAlign: 'center', marginTop:5}}>
                  <Text style={{fontStyle:'bold'}} >Total</Text>
                </View>
                <View style={{ width: '10%', borderRight: 0.5,borderLeft:0.5, paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}></View>
                <View style={{ width: '13%', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}></View>
              </View>

            </View>

            <Text style={{ fontSize: 8, marginTop: 5, textAlign: 'justify', fontStyle: 'italic',fontWeight:400 }}>
              I CERTIFY on my honor that the above is a true and correct report of the hours of work performed, record of which was made daily at the time of arrival and departure from office.
            </Text>

            <View style={{ fontSize: 8, textAlign: 'center', marginTop: 20 }}>
            {previewUrl && (
           
              <Image
                src={previewUrl}
                style={{width:"80px",position:"absolute", alignSelf:"center",objectFit:"contain",transform: 'translateY(-30px)',zIndex:100}}
              />
           
          )}
              <Text style={{ borderBottom: 0.5, paddingTop: 2 ,fontStyle:'bold' }}>{name?name.toUpperCase():""}</Text>
            </View>

            <Text style={{ fontSize: 7, marginTop: 10, textAlign: 'justify',fontStyle: 'italic',fontWeight:100 }}>
              VERIFIED as to the prescribed office hours.
            </Text>

            <View style={{ fontSize: 8, textAlign: 'center', marginTop: 30 }}>
              <Text style={{ borderBottom: 0.5, paddingTop: 2,fontStyle:'bold' }}>{
              
              JSON.parse(localStorage.getItem('user')||'').deptid  == 4 && name.toUpperCase() != "NIDELIZA FE O. NACILLA" ?  ` NIDELIZA FE O. NACILLA`:""
              }</Text>
              <Text style={{ fontSize: 7 ,fontStyle:'italic',marginTop:2}}>Name and Signature of Immediate Supervisor</Text>
            </View>

            
            
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default MyDocument;