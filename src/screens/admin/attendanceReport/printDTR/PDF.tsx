import { Page, Text, View, Document, Image, Font } from '@react-pdf/renderer';
import { convertDate } from '@/helper/date-time';
import DICT from './../../../../assets/dict2.png';
import { convertStatus } from '@/helper/convert-status';

Font.register({
  family: 'Palatino',
  fonts: [
    { src: `${import.meta.env.VITE_LINK}/palatino-linotype-family/palatinolinotype_regular.ttf` }, // normal
    { src: `${import.meta.env.VITE_LINK}/palatino-linotype-family/palatinolinotype_italic.ttf`, fontStyle: 'italic' }, // italic
    { src: `${import.meta.env.VITE_LINK}/palatino-linotype-family/palatinolinotype_bold.ttf`, fontStyle: 'bold' } // bold
  ]
});

const MyDocument = ({ name, date, data, selectedYear, selectedMonth, previewUrl, selectedSchedule, SupervisorsName }: any) => {
  console.log(date)
  const getDateFromChecktime = (checktime: any) => new Date(checktime).getUTCDate();

  const dateRangeParts = (date || '').split('-');
  let startDay = 1;
  let endDay = new Date(selectedYear, selectedMonth || 1, 0).getDate();

  if (dateRangeParts.length > 1) {
    const firstPart = dateRangeParts[0].trim().split(' ');
    const secondPart = dateRangeParts[1].trim().split(',')[0];

    const parsedStart = parseInt(firstPart[firstPart.length - 1]);
    const parsedEnd = parseInt(secondPart);
    if (!isNaN(parsedStart)) startDay = parsedStart;
    if (!isNaN(parsedEnd)) endDay = parsedEnd;
  }

  let groupedData: any = {};

  data.results?.forEach((item: any) => {
    const date = getDateFromChecktime(item.CHECKTIME);
    if (!groupedData[date]) {
      groupedData[date] = { I: [], O: [], i: [], o: [] };
    }

    const timeString = convertDate(item.CHECKTIME).localeTime12HourFormat;

    // Check the time conditions
    if (item.CHECKTYPE === 'I') {
      groupedData[date].I.push(timeString);
    } else if (item.CHECKTYPE === 'o') {
      groupedData[date].O.push(timeString);
    } else if (item.CHECKTYPE === '0') {
      groupedData[date].i.push(timeString || '12:00 PM');
    } else if (item.CHECKTYPE === 'i') {
      groupedData[date].o.push(timeString);
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
        description: `${convertStatus(activity.status)} - ${activity.description}`,
        status: activity.status,
        period: activity.period,
      });
    }
  });


  const getCheckinRaw = (data: any) => {
    let lenghtData = data.length;
    switch (lenghtData) {
      case 6: return data[lenghtData - 1];
      case 5: return data[lenghtData - 1];
      case 4: return data[lenghtData - 1];
      case 3: return data[lenghtData - 1];
      case 2: return data[lenghtData - 1];
      case 1: return data[lenghtData - 1];
      default: return '';
    }
  };
  const renderCheckinText = (data: any) => getCheckinRaw(data).replace(/ AM| PM| am| pm/g, '');

  const getCheckOutRaw = (data: any) => {
    switch (data.length) {
      case 4: return data[0];
      case 3: return data[0];
      case 2: return data[0];
      case 1: return data[0];
      default: return '';
    }
  };
  const renderCheckOutText = (data: any) => getCheckOutRaw(data).replace(/ AM| PM| am| pm/g, '');

  const getAmDepartureRaw = (outTime: any, inTime: any, selectedSched?: string) => {
    switch (outTime.length) {
      case 3:
        if (inTime.length != 0 && outTime.length != 2) return selectedSched === "14" ? "12:59 PM" : "12:00 PM";
        else return outTime[0];
      case 2:
        if (inTime.length != 0 && outTime.length != 2) return selectedSched === "14" ? "12:59 PM" : "12:00 PM";
        else return outTime[0];
      case 1:
        if (inTime.length != 0 && outTime.length != 1) return selectedSched === "14" ? "12:59 PM" : "12:00 PM";
        else return outTime[0];
      default:
        if (inTime.length != 0) return selectedSched === "14" ? "12:59 PM" : "12:00 PM";
        else return '';
    }
  };
  const renderAmDepartureText = (o: any, i: any, s: any) => getAmDepartureRaw(o, i, s).replace(/ AM| PM| am| pm/g, '');

  const getPMArivalRaw = (inTime: any, outTime: any, selectedSched?: string) => {
    switch (inTime.length) {
      case 3:
        if (outTime.length != 0 && outTime.length != 3) return selectedSched === "14" ? "01:00 PM" : "01:00 PM";
        else return inTime[0];
      case 2:
        if (outTime.length != 0 && outTime.length != 2) return selectedSched === "14" ? "01:00 PM" : "01:00 PM";
        else return inTime[0];
      case 1:
        if (outTime.length != 0 && outTime.length != 1) return selectedSched === "14" ? "01:00 PM" : "01:00 PM";
        else return inTime[0];
      default:
        if (outTime.length != 0) return selectedSched === "14" ? "01:00 PM" : "01:00 PM";
        else return '';
    }
  };
  const renderPMArivalText = (i: any, o: any, s: any) => getPMArivalRaw(i, o, s).replace(/ AM| PM| am| pm/g, '');

  const getScheduleTime = (scheduleValue: string): { timeIn: number, timeOut: number } => {
    const schedules: { [key: string]: { timeIn: number, timeOut: number } } = {
      "4": { timeIn: 6 * 60, timeOut: 18 * 60 },  // 6:00-6:00
      "5": { timeIn: 7 * 60, timeOut: 16 * 60 },  // 7:00-4:00
      "6": { timeIn: 7.5 * 60, timeOut: 16.5 * 60 }, // 7:30-4:30
      "7": { timeIn: 8 * 60, timeOut: 17 * 60 },  // 8:00-5:00
      "8": { timeIn: 8.5 * 60, timeOut: 17.5 * 60 }, // 8:30-5:30
      "9": { timeIn: 9 * 60, timeOut: 18 * 60 },  // 9:00-6:00
      "10": { timeIn: 9.5 * 60, timeOut: 18.5 * 60 }, // 9:30-6:30
      "11": { timeIn: 10 * 60, timeOut: 19 * 60 },  // 10:00-7:00
      "13": { timeIn: 7 * 60, timeOut: 18 * 60 },  // NEW Normal placeholder
      "14": { timeIn: 7 * 60, timeOut: 17 * 60 }   // On Fasting placeholder
    };

    return schedules[scheduleValue] || schedules["7"]; // Default to 8:00-5:00 if invalid
  };

  const convertScheduleToTimeRange = (scheduleValue: string): string => {
    const scheduleRanges: { [key: string]: string } = {
      "4": "6:00-6:00",
      "5": "7:00-4:00",
      "6": "7:30-4:30",
      "7": "8:00-5:00",
      "8": "8:30-5:30",
      "9": "9:00-6:00",
      "10": "9:30-6:30",
      "11": "10:00-7:00",
      "12": "6:00-6:00 NS",
      "13": "NEW Normal",
      "14": "On Fasting"
    };

    return scheduleRanges[scheduleValue] || "8:00-5:00"; // Default to 8:00-5:00 if invalid
  };

  const parseTimeToMinutes = (time: string): number => {
    if (!time) return 0;
    const isPM = time.toUpperCase().includes('PM');
    const isAM = time.toUpperCase().includes('AM');
    const cleanTime = time.replace(/ AM| PM| am| pm/g, '').trim();
    const [hoursStr, minutesStr] = cleanTime.split(':');
    let hours = Number(hoursStr);
    const minutes = Number(minutesStr);
    if (isNaN(hours) || isNaN(minutes)) return 0;

    if (isPM && hours !== 12) hours += 12;
    else if (isAM && hours === 12) hours = 0;
    else if (!isPM && !isAM && hours >= 1 && hours <= 6) {
      // Basic fallback for unformatted PM afternoon
      hours += 12;
    }

    return (hours * 60) + minutes;
  };

  const undertimeCalc = (timeIn: string, timeOut: string, day: number): { hours: number | string, minutes: number | string } => {
    // Check if the current day is within the selected date range
    if (day < startDay || day > endDay) {
      return { hours: '', minutes: '' };
    }

    const currentDate = new Date(selectedYear, selectedMonth - 1, day);

    // Check day of week
    const dayOfWeek = currentDate.getDay();
    const isFridayNoDuty = (selectedSchedule === "13" || selectedSchedule === "14") && dayOfWeek === 5;
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6 || isFridayNoDuty;

    // Get the last day of the selected month
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

    // If day is beyond the days in the selected month, return blank
    if (day > daysInMonth) {
      return { hours: '', minutes: '' };
    }

    // Check if the day has any activities or holidays
    const activities = activitiesByDate[day] || [];
    const hasFullDayActivity = activities.some((activity: any) => activity.period === 1);
    const hasAMActivity = activities.some((activity: any) => activity.period === 2);
    const hasPMActivity = activities.some((activity: any) => activity.period === 3);

    // If it's a full day activity/holiday, return 0 undertime
    if (hasFullDayActivity) {
      return { hours: 0, minutes: 0 };
    }

    // Check if there's any attendance data
    const hasAttendanceData = timeIn || timeOut;

    // If it's a weekend without attendance, return blank (no undertime)
    if (isWeekend && !hasAttendanceData) {
      return { hours: '', minutes: '' };
    }

    // If it's a weekend with attendance, return 0 undertime (they're working on their day off)
    if (isWeekend && hasAttendanceData) {
      return { hours: 0, minutes: 0 };
    }

    // Get selected schedule from localStorage
    const selectedSched = selectedSchedule || "7";

    // If schedule is 12 (5:00-6:00), always return 0 undertime
    if (selectedSched === "12") {
      return { hours: 0, minutes: 0 };
    }

    if (selectedSched === "13" || selectedSched === "14") {
      const REQUIRED_MINUTES = 600; // 10 hours * 60 minutes

      if (!timeIn && !timeOut) {
        if (hasAMActivity && hasPMActivity) return { hours: 0, minutes: 0 };
        if (hasAMActivity || hasPMActivity) return { hours: 5, minutes: 0 };
        return { hours: 10, minutes: 0 };
      }

      let actualTimeIn = timeIn ? parseTimeToMinutes(timeIn) : 12 * 60; // default to noon if no time in
      let actualTimeOut = timeOut ? parseTimeToMinutes(timeOut) : 13 * 60; // default to 1 pm if no time out

      if (actualTimeIn < 420) actualTimeIn = 420;

      let totalMinutes = actualTimeOut - actualTimeIn;
      // Deduct 1 hour for lunch if time span covers 12:00 to 13:00 AND not fasting
      if (selectedSched !== "14" && actualTimeIn <= 12 * 60 && actualTimeOut >= 13 * 60) {
        totalMinutes -= 60;
      }

      if (hasAMActivity) totalMinutes += 5 * 60;
      if (hasPMActivity) totalMinutes += 5 * 60;

      let undertimeMinutes = REQUIRED_MINUTES - totalMinutes;
      if (undertimeMinutes < 0) undertimeMinutes = 0;

      return { hours: Math.floor(undertimeMinutes / 60), minutes: undertimeMinutes % 60 };
    }

    const schedule = getScheduleTime(selectedSched);

    // Use schedule times instead of hardcoded values
    const expectedTimeIn = schedule.timeIn;
    const expectedTimeOut = schedule.timeOut;

    // Special case: If it's a regular day with no times at all
    if (!timeIn && !timeOut) {
      if (hasAMActivity && hasPMActivity) return { hours: 0, minutes: 0 };
      if (hasAMActivity) return { hours: Math.floor((expectedTimeOut - (13 * 60)) / 60), minutes: 0 };
      if (hasPMActivity) return { hours: Math.floor((12 * 60 - expectedTimeIn) / 60), minutes: 0 };
      const totalWorkMinutes = expectedTimeOut - expectedTimeIn - 60; // Full day minus lunch
      return { hours: Math.floor(totalWorkMinutes / 60), minutes: totalWorkMinutes % 60 };
    }

    let undertimeMinutes = 0;

    // Handle morning undertime (blank or late arrival)
    if (!hasAMActivity) {
      if (!timeIn) {
        // If no time-in, count full morning as undertime
        undertimeMinutes += (12 * 60) - expectedTimeIn;
      } else {
        const actualTimeIn = parseTimeToMinutes(timeIn);
        if (actualTimeIn > expectedTimeIn) {
          undertimeMinutes += actualTimeIn - expectedTimeIn;
        }
      }
    }

    // Handle afternoon undertime (blank or early departure)
    if (!hasPMActivity) {
      if (!timeOut) {
        // If no time-out, count full afternoon as undertime
        undertimeMinutes += expectedTimeOut - (13 * 60);
      } else {
        const actualTimeOut = parseTimeToMinutes(timeOut);
        if (actualTimeOut < expectedTimeOut) {
          undertimeMinutes += expectedTimeOut - actualTimeOut;
        }
      }
    }

    // Convert to hours and minutes
    const hours = Math.floor(undertimeMinutes / 60);
    const minutes = undertimeMinutes % 60;

    return { hours, minutes };
  };

  // Calculate total undertime for the entire month
  const calculateTotalUndertime = (): { totalHours: number, totalMinutes: number } => {
    let totalMinutes = 0;

    // Get the last day of the selected month
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const checkinTimes = groupedData[day]?.I || [];
      const checkoutTimes = groupedData[day]?.O || [];

      const timeIn = getCheckinRaw(checkinTimes);
      const timeOut = getCheckOutRaw(checkoutTimes);

      const undertime = undertimeCalc(timeIn, timeOut, day);

      if (typeof undertime.hours === 'number' && typeof undertime.minutes === 'number') {
        totalMinutes += (undertime.hours * 60) + undertime.minutes;
      }
    }

    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    return { totalHours, totalMinutes: remainingMinutes };
  };



  return (
    <Document title={`${name ? name.toUpperCase() : ""}_DTR_${date}.pdf`}   >
      <Page size="A4" style={{ fontFamily: 'Palatino', flexDirection: 'row', backgroundColor: '#ffffff', fontSize: 8, padding: 30, gap: 10, alignContent: 'center', justifyContent: 'center' }}>
        {[1].map((_, index) => (
          <View key={index} style={{ width: '50%', border: 0.5, borderStyle: 'solid', padding: 1 }}>
            <View key={index} style={{ width: '100%', border: 0.5, borderStyle: 'solid', padding: 8, paddingBottom: 30 }}>
              <Text style={{ fontSize: 6, marginBottom: 5, fontStyle: 'italic', fontWeight: 'bold', alignSelf: "flex-end" }}>Civil Service Form No. 48 - RX</Text>
              <Image src={DICT} style={{ height: 50, objectFit: 'contain', alignSelf: 'center', marginBottom: 5 }} />
              <Text style={{ fontSize: 14, fontStyle: 'bold', textAlign: 'center', marginBottom: 3 }}>DAILY TIME RECORD</Text>
              <Text style={{ fontSize: 10, textAlign: 'center', marginBottom: 5 }}></Text>
              <View style={{ marginBottom: 1 }}>
                <Text style={{
                  fontSize: 9,
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  fontStyle: 'bold',
                  borderBottom: .7,
                  borderBottomStyle: 'dashed',
                }}>
                  {name ? name.toUpperCase() : "JOHN C. DOE"}
                </Text>
              </View>


              <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 2, padding: 2 }}>
                <View style={{ width: '50%', textAlign: 'left', fontStyle: 'italic' }}>
                  <Text>For the month of</Text>
                  <Text>Official hours for arrival</Text>
                  <Text>and departure</Text>
                </View>
                <View style={{ width: '50%' }}>
                  <Text style={{ borderBottom: 0.5, borderStyle: 'dashed', marginBottom: 2, fontStyle: 'bold', textAlign: 'center' }}>{date}</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ marginTop: 2 }}>Regular days</Text>
                    <View style={{ borderBottom: 0.5, borderStyle: 'dashed', marginBottom: 1, marginLeft: 22, width: '100%' }}>
                      <Text style={{ marginTop: 2, fontStyle: 'bold', textAlign: 'center' }}>{convertScheduleToTimeRange(selectedSchedule || "8:00-5:00")}</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <Text>Saturdays</Text>
                    <View style={{ borderBottom: 0.5, borderStyle: 'dashed', marginLeft: 20, width: '100%', }}><Text style={{ fontStyle: 'bold', marginLeft: 20, marginTop: 2, fontSize: 7 }}>As Required</Text></View>
                  </View>


                </View>
              </View>

              <View style={{ border: 0, marginTop: 8, marginBottom: 15, borderStyle: 'solid', borderTopStyle: 'solid', borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0, borderBottomStyle: 'solid', borderBottomWidth: 1 }}>


                <View key={index} style={{ flexDirection: 'row', borderBottom: 0.5, alignItems: 'center', height: 16, fontSize: 7, borderBottomStyle: 'solid', justifyContent: 'center', textAlign: 'center', borderTopWidth: 1, borderTopColor: '#1b1b1b' }}>
                  <View style={{ width: '8%', borderRight: 0.5, paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center', borderRightStyle: 'solid' }}>
                    <Text style={{ marginTop: 4, fontStyle: 'bold' }}>Day</Text>
                  </View>
                  <View style={{ width: '34.5%', borderRight: 0.5, paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center', borderStyle: 'solid' }}>
                    <Text style={{ marginTop: 4, fontStyle: 'bold' }}>AM</Text>
                  </View>
                  <View style={{ width: '34.5%', borderRight: 0.5, paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center', borderStyle: 'solid' }}>
                    <Text style={{ marginTop: 4, fontStyle: 'bold' }}>PM</Text>
                  </View>

                  <View style={{ width: '23%', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                    <Text style={{ marginTop: 4, fontStyle: 'bold' }}>Undertime</Text>
                  </View>
                </View>
                <View key={index} style={{ flexDirection: 'row', borderBottom: 1, alignItems: 'center', height: 15, fontSize: 7, borderBottomStyle: 'solid', justifyContent: 'center', textAlign: 'center', borderBottomColor: '#1b1b1b' }}>
                  <View style={{ width: '8%', borderRight: 0.5, paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                    <Text></Text>
                  </View>
                  <View style={{ width: '17.25%', borderRight: 0.5, paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                    <Text style={{ marginTop: 4, fontStyle: 'bold' }}>Arrival</Text>
                  </View>
                  <View style={{ width: '17.25%', borderRight: 0.5, paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                    <Text style={{ marginTop: 4, fontStyle: 'bold' }}>Departure</Text>
                  </View>
                  <View style={{ width: '17.25%', borderRight: 0.5, paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                    <Text style={{ marginTop: 4, fontStyle: 'bold' }}>Arrival</Text>
                  </View>
                  <View style={{ width: '17.25%', borderRight: 0.5, paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                    <Text style={{ marginTop: 4, fontStyle: 'bold' }}>Departure</Text>
                  </View>
                  <View style={{ width: '10%', borderRight: 0.5, paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                    <Text style={{ marginTop: 4, fontStyle: 'bold' }}>Hrs</Text>
                  </View>
                  <View style={{ width: '13%', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                    <Text style={{ marginTop: 4, fontStyle: 'bold' }}>Mins.</Text>
                  </View>
                </View>

                {Array.from({ length: 31 }, (_, index) => {
                  const day = index + 1;
                  const dayOfWeek = new Date(selectedYear, selectedMonth - 1, day).getDay();
                  const isFridayNoDuty = (selectedSchedule === "13" || selectedSchedule === "14") && dayOfWeek === 5;
                  const dayName = dayOfWeek === 0 ? 'Sunday' : dayOfWeek === 6 ? 'Saturday' : isFridayNoDuty ? 'Friday' : '';
                  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6 || isFridayNoDuty;
                  const checkinTimes = groupedData[day]?.I || [];
                  const checkoutTimes = groupedData[day]?.O || [];
                  const checkoinTimes2 = groupedData[day]?.i || [];
                  const checkoutTimes2 = groupedData[day]?.o || [];
                  const activities = activitiesByDate[day] || [];

                  // Check if day exists in the selected month
                  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
                  const isValidDay = day <= daysInMonth;
                  const isOutOfRange = day < startDay || day > endDay;

                  // Check if there's any actual attendance data (check-in/out times)
                  const hasAttendanceData = (checkinTimes && checkinTimes.length > 0) ||
                    (checkoutTimes && checkoutTimes.length > 0) ||
                    (checkoinTimes2 && checkoinTimes2.length > 0) ||
                    (checkoutTimes2 && checkoutTimes2.length > 0);

                  // If day doesn't exist in the selected month, return blank row
                  if (!isValidDay) {
                    return (
                      <View key={index} style={{ flexDirection: 'row', borderBottom: 0.5, alignItems: 'center', height: 12, fontSize: 7, textAlign: 'center', borderBottomStyle: 'dashed' }}>
                        <View style={{ width: '8%', borderRight: 0.5, height: '100%', alignItems: 'center', justifyContent: 'center', textAlign: 'center', borderRightStyle: 'solid' }}>
                          <Text style={{ textAlign: 'center', marginTop: 2 }}></Text>
                        </View>
                        <View style={{ width: '17.25%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                          <Text style={{ textAlign: 'center', marginTop: 2 }}></Text>
                        </View>
                        <View style={{ width: '17.25%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                          <Text style={{ textAlign: 'center', marginTop: 2 }}></Text>
                        </View>
                        <View style={{ width: '17.25%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                          <Text style={{ textAlign: 'center', marginTop: 2 }}></Text>
                        </View>
                        <View style={{ width: '17.25%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                          <Text style={{ textAlign: 'center', marginTop: 2 }}></Text>
                        </View>
                        <View style={{ width: '10%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                          <Text style={{ textAlign: 'center', marginTop: 2 }}></Text>
                        </View>
                        <View style={{ width: '10%', paddingLeft: 2, height: '100%', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                          <Text style={{ textAlign: 'center', marginTop: 2 }}></Text>
                        </View>
                      </View>
                    );
                  }

                  // If day is valid but outside the selected date range (e.g. day 1-15 when 16-31 is selected), return completely blank data
                  if (isOutOfRange) {
                    return (
                      <View key={index} style={{ flexDirection: 'row', borderBottom: 0.5, alignItems: 'center', height: 12, fontSize: 7, textAlign: 'center', borderBottomStyle: 'dashed' }}>
                        <View style={{ width: '8%', borderRight: 0.5, height: '100%', alignItems: 'center', justifyContent: 'center', textAlign: 'center', borderRightStyle: 'solid' }}>
                          <Text style={{ textAlign: 'center', marginTop: 2 }}>{day}</Text>
                        </View>
                        <View style={{ width: '17.25%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                          <Text style={{ textAlign: 'center', marginTop: 2 }}></Text>
                        </View>
                        <View style={{ width: '17.25%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                          <Text style={{ textAlign: 'center', marginTop: 2 }}></Text>
                        </View>
                        <View style={{ width: '17.25%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                          <Text style={{ textAlign: 'center', marginTop: 2 }}></Text>
                        </View>
                        <View style={{ width: '17.25%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                          <Text style={{ textAlign: 'center', marginTop: 2 }}></Text>
                        </View>
                        <View style={{ width: '10%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                          <Text style={{ textAlign: 'center', marginTop: 2 }}></Text>
                        </View>
                        <View style={{ width: '10%', paddingLeft: 2, height: '100%', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                          <Text style={{ textAlign: 'center', marginTop: 2 }}></Text>
                        </View>
                      </View>
                    );
                  }

                  // If it's a weekend WITH attendance data, show times with green background
                  if (isWeekend && hasAttendanceData) {
                    return (
                      <View key={index} style={{ flexDirection: 'row', borderBottom: 0.5, alignItems: 'center', height: 12, fontSize: 7, textAlign: 'center', borderBottomStyle: 'dashed' }}>
                        <View style={{ width: '8%', borderRight: 0.5, height: '100%', alignItems: 'center', justifyContent: 'center', textAlign: 'center', borderRightStyle: 'solid' }}>
                          <Text style={{ textAlign: 'center', marginTop: 2 }}>{day}</Text>
                        </View>
                        <View style={{ width: '17.25%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center', backgroundColor: '#bff6bf' }}>
                          <Text style={{ textAlign: 'center', marginTop: 2 }}>{renderCheckinText(checkinTimes)}</Text>
                        </View>
                        <View style={{ width: '17.25%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center', backgroundColor: '#bff6bf' }}>
                          <Text style={{ textAlign: 'center', marginTop: 2 }}>{renderAmDepartureText(checkoinTimes2, checkinTimes, selectedSchedule)}</Text>
                        </View>
                        <View style={{ width: '17.25%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center', backgroundColor: '#bff6bf' }}>
                          <Text style={{ textAlign: 'center', marginTop: 2 }}>{renderPMArivalText(checkoutTimes2, checkoutTimes, selectedSchedule)}</Text>
                        </View>
                        <View style={{ width: '17.25%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center', backgroundColor: '#bff6bf' }}>
                          <Text style={{ textAlign: 'center', marginTop: 2 }}>{renderCheckOutText(checkoutTimes)}</Text>
                        </View>
                        <View style={{ width: '10%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                          <Text style={{ textAlign: 'center', marginTop: 2 }}>
                            {undertimeCalc(getCheckinRaw(checkinTimes), getCheckOutRaw(checkoutTimes), day).hours}
                          </Text>
                        </View>
                        <View style={{ width: '10%', paddingLeft: 2, height: '100%', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                          <Text style={{ textAlign: 'center', marginTop: 2 }}>
                            {undertimeCalc(getCheckinRaw(checkinTimes), getCheckOutRaw(checkoutTimes), day).minutes}
                          </Text>
                        </View>
                      </View>
                    );
                  }

                  // If it's a weekend WITHOUT attendance data, show day name
                  if (isWeekend && !hasAttendanceData && activities.length === 0) {
                    return (
                      <View key={index} style={{ flexDirection: 'row', borderBottom: 0.5, alignItems: 'center', height: 12, fontSize: 7, textAlign: 'center', borderBottomStyle: 'dashed' }}>
                        <View style={{ width: '8%', borderRight: 0.5, height: '100%', alignItems: 'center', justifyContent: 'center', textAlign: 'center', borderRightStyle: 'solid' }}>
                          <Text style={{ textAlign: 'center', marginTop: 2 }}>{day}</Text>
                        </View>
                        <View style={{ width: '69%', borderRight: 0.5, alignItems: 'center', height: '100%', paddingLeft: 2 }}>
                          <Text style={{ textAlign: 'center', marginTop: 2 }}>{dayName}</Text>
                        </View>
                        <View style={{ width: '10%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                          <Text style={{ textAlign: 'center', marginTop: 2 }}></Text>
                        </View>
                        <View style={{ width: '10%', paddingLeft: 2, height: '100%', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                          <Text style={{ textAlign: 'center', marginTop: 2 }}></Text>
                        </View>
                      </View>
                    );
                  }

                  // Handle activities/holidays
                  if (activities.length > 0) {
                    const hasFullDayActivity = activities.some((activity: any) => activity.period === 1);

                    // If full day activity, show as single block
                    if (hasFullDayActivity) {
                      return (
                        <View key={index} style={{ flexDirection: 'row', borderBottom: 0.5, alignItems: 'center', height: 12, fontSize: 7, textAlign: 'center', borderBottomStyle: 'dashed' }}>
                          <View style={{ width: '8%', borderRight: 0.5, height: '100%', alignItems: 'center', justifyContent: 'center', textAlign: 'center', borderRightStyle: 'solid' }}>
                            <Text style={{ textAlign: 'center', marginTop: 2 }}>{day}</Text>
                          </View>
                          <View style={{ width: '69%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                            <Text style={{ textAlign: 'center', marginTop: 2 }}>{activities.find((a: any) => a.period === 1)?.description}</Text>
                          </View>
                          <View style={{ width: '10%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                            <Text style={{ textAlign: 'center', marginTop: 2 }}>0</Text>
                          </View>
                          <View style={{ width: '10%', paddingLeft: 2, height: '100%', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                            <Text style={{ textAlign: 'center', marginTop: 2 }}>0</Text>
                          </View>
                        </View>
                      );
                    }

                    // Handle AM or PM activities with attendance
                    const hasAMActivity = activities.some((activity: any) => activity.period === 2);
                    const hasPMActivity = activities.some((activity: any) => activity.period === 3);

                    return (
                      <View key={index} style={{ flexDirection: 'row', borderBottom: 0.5, alignItems: 'center', height: 12, fontSize: 7, textAlign: 'center', borderBottomStyle: 'dashed' }}>
                        <View style={{ width: '8%', borderRight: 0.5, height: '100%', alignItems: 'center', justifyContent: 'center', textAlign: 'center', borderRightStyle: 'solid' }}>
                          <Text style={{ textAlign: 'center', marginTop: 2 }}>{day}</Text>
                        </View>

                        <View style={{ width: '34.5%', borderRight: 0.5, alignItems: 'center', height: '100%', justifyContent: 'center', textAlign: 'center', borderRightStyle: 'solid' }}>
                          {checkinTimes.length === 0 && hasAMActivity ? (
                            activities.map((activity: any, idx: number) => (
                              activity.period === 2 ? (
                                <Text key={idx} style={{ textAlign: 'center', marginTop: 1, fontSize: 6 }}>{activity.description}</Text>
                              ) : null
                            ))
                          ) : (
                            <View style={{ flexDirection: 'row', width: '100%' }}>
                              <View style={{ width: '50%', alignItems: 'center', paddingLeft: 2, justifyContent: 'center', height: '100%', backgroundColor: (hasAttendanceData && renderCheckinText(checkinTimes) && hasAMActivity) ? "#bff6bf" : "transparent", borderRight: 0.5, borderRightStyle: 'solid' }}>
                                <Text style={{ textAlign: 'center', marginTop: 1 }}>{renderCheckinText(checkinTimes)}</Text>
                              </View>
                              <View style={{ width: '50%', alignItems: 'center', paddingLeft: 2, justifyContent: 'center', backgroundColor: (hasAttendanceData && renderAmDepartureText(checkoinTimes2, checkinTimes, selectedSchedule) && hasAMActivity) ? "#bff6bf" : "transparent" }}>
                                <Text style={{ textAlign: 'center', marginTop: 1 }}>{renderAmDepartureText(checkoinTimes2, checkinTimes, selectedSchedule)}</Text>
                              </View>
                            </View>
                          )}
                        </View>

                        <View style={{ width: '34.5%', borderRight: 0.5, alignItems: 'center', height: '100%', justifyContent: 'center', textAlign: 'center', borderRightStyle: 'solid' }}>
                          {checkoutTimes.length === 0 && hasPMActivity ? (
                            activities.map((activity: any, idx: number) => (
                              activity.period === 3 ? (
                                <Text key={idx} style={{ textAlign: 'center', marginTop: 1, fontSize: 6 }}>{activity.description}</Text>
                              ) : null
                            ))
                          ) : (
                            <View style={{ flexDirection: 'row', width: '100%' }}>
                              <View style={{ width: '50%', alignItems: 'center', justifyContent: 'center', backgroundColor: (hasAttendanceData && renderPMArivalText(checkoutTimes2, checkoutTimes, selectedSchedule) && hasPMActivity) ? "#bff6bf" : "transparent", borderRight: 0.5, borderRightStyle: 'solid' }}>
                                <Text style={{ textAlign: 'center', marginTop: 1 }}>{renderPMArivalText(checkoutTimes2, checkoutTimes, selectedSchedule)}</Text>
                              </View>
                              <View style={{ width: '50%', alignItems: 'center', paddingLeft: 2, justifyContent: 'center', backgroundColor: (hasAttendanceData && renderCheckOutText(checkoutTimes) && hasPMActivity) ? "#bff6bf" : "transparent" }}>
                                <Text style={{ textAlign: 'center', marginTop: 1 }}>{renderCheckOutText(checkoutTimes)}</Text>
                              </View>
                            </View>
                          )}
                        </View>

                        <View style={{ width: '10%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center', borderRightStyle: 'solid' }}>
                          <Text style={{ textAlign: 'center', marginTop: 2 }}>
                            {undertimeCalc(getCheckinRaw(checkinTimes), getCheckOutRaw(checkoutTimes), day).hours}
                          </Text>
                        </View>
                        <View style={{ width: '10%', paddingLeft: 2, height: '100%', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                          <Text style={{ textAlign: 'center', marginTop: 2 }}>
                            {undertimeCalc(getCheckinRaw(checkinTimes), getCheckOutRaw(checkoutTimes), day).minutes}
                          </Text>
                        </View>
                      </View>
                    );
                  }

                  // Regular weekdays with attendance
                  return (
                    <View key={index} style={{ flexDirection: 'row', borderBottom: 0.5, alignItems: 'center', height: 12, fontSize: 7, textAlign: 'center', borderStyle: 'dashed' }}>
                      <View style={{ width: '8%', borderRight: 0.5, height: '100%', alignItems: 'center', justifyContent: 'center', textAlign: 'center', borderStyle: 'solid' }}>
                        <Text style={{ textAlign: 'center', marginTop: 2 }}>{day}</Text>
                      </View>
                      <View style={{ width: '17.25%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                        <Text style={{ textAlign: 'center', marginTop: 2 }}>{renderCheckinText(checkinTimes)}</Text>
                      </View>
                      <View style={{ width: '17.25%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                        <Text style={{ textAlign: 'center', marginTop: 2 }}>{renderAmDepartureText(checkoinTimes2, checkinTimes, selectedSchedule)}</Text>
                      </View>
                      <View style={{ width: '17.25%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                        <Text style={{ textAlign: 'center', marginTop: 2 }}>{renderPMArivalText(checkoutTimes2, checkoutTimes, selectedSchedule)}</Text>
                      </View>
                      <View style={{ width: '17.25%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                        <Text style={{ textAlign: 'center', marginTop: 2 }}>{renderCheckOutText(checkoutTimes)}</Text>
                      </View>
                      <View style={{ width: '10%', borderRight: 0.5, alignItems: 'center', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                        <Text style={{ textAlign: 'center', marginTop: 2 }}>
                          {undertimeCalc(getCheckinRaw(checkinTimes), getCheckOutRaw(checkoutTimes), day).hours}
                        </Text>
                      </View>
                      <View style={{ width: '10%', paddingLeft: 2, height: '100%', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                        <Text style={{ textAlign: 'center', marginTop: 2 }}>
                          {undertimeCalc(getCheckinRaw(checkinTimes), getCheckOutRaw(checkoutTimes), day).minutes}
                        </Text>
                      </View>
                    </View>
                  );
                })}



                <View style={{ flexDirection: 'row', borderBottom: 'none', alignItems: 'center', height: 12 }}>
                  <View style={{ width: '60%', height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                  </View>
                  <View style={{ width: '17%', height: '100%', justifyContent: 'center', textAlign: 'center', marginTop: 5 }}>
                    <Text style={{ fontStyle: 'bold' }} >Total

                    </Text>
                  </View>
                  <View style={{ width: '10.2%', borderRight: 0.5, borderLeft: 0.5, paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                    <Text style={{ textAlign: 'center', fontStyle: 'bold', transform: 'translateY(2px)' }}>
                      {calculateTotalUndertime().totalHours}
                    </Text>
                  </View>
                  <View style={{ width: '13%', paddingLeft: 2, height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                    <Text style={{ textAlign: 'center', fontStyle: 'bold', transform: 'translateY(2px)' }}>
                      {calculateTotalUndertime().totalMinutes}
                    </Text>
                  </View>
                </View>

              </View>

              <Text style={{ fontSize: 8, marginTop: 0, textAlign: 'justify', fontStyle: 'italic', fontWeight: 400 }}>
                I CERTIFY on my honor that the above is a true and correct report of the hours of work performed, record of which was made daily at the time of arrival and departure from office.
              </Text>

              <View style={{ fontSize: 8, textAlign: 'center', marginTop: 20 }}>
                {previewUrl && (

                  <Image
                    src={previewUrl}
                    style={{ width: "80px", position: "absolute", alignSelf: "center", objectFit: "contain", transform: 'translateY(-30px)', zIndex: 100 }}
                  />

                )}
                <Text style={{ borderBottom: 0.5, paddingTop: 2, fontStyle: 'bold' }}>{name ? name.toUpperCase() : ""}</Text>
              </View>

              <Text style={{ fontSize: 7, marginTop: 10, textAlign: 'justify', fontStyle: 'italic', fontWeight: 100 }}>
                VERIFIED as to the prescribed office hours.
              </Text>

              <View style={{ fontSize: 8, textAlign: 'center', marginTop: 30 }}>
                <Text style={{ borderBottom: 0.5, paddingTop: 2, fontStyle: 'bold' }}>{

                  JSON.parse(localStorage.getItem('user') || '').deptid == 4 && name.toUpperCase() != "NIDELIZA FE O. NACILLA" ? ` NIDELIZA FE O. NACILLA` : SupervisorsName
                }</Text>
                <Text style={{ fontSize: 7, fontStyle: 'italic', marginTop: 2 }}>Name and Signature of Immediate Supervisor</Text>
              </View>



            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default MyDocument;