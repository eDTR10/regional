
import { useEffect, useRef, useState } from 'react';

const DashboardAnalogClock = () => {
    const hourRef = useRef<HTMLDivElement>(null);
    const minuteRef = useRef<HTMLDivElement>(null);
    const secondRef = useRef<HTMLDivElement>(null);
    const [currentDateTime, setCurrentDateTime] = useState<string>('');

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const seconds = now.getSeconds();
            const minutes = now.getMinutes();
            const hours = now.getHours();

            const secondDegrees = ((seconds / 60) * 360) + 90;
            const minuteDegrees = ((minutes / 60) * 360) + ((seconds / 60) * 6) + 90;
            const hourDegrees = ((hours / 12) * 360) + ((minutes / 60) * 30) + 90;

            if (secondRef.current) secondRef.current.style.transform = `rotate(${secondDegrees}deg)`;
            if (minuteRef.current) minuteRef.current.style.transform = `rotate(${minuteDegrees}deg)`;
            if (hourRef.current) hourRef.current.style.transform = `rotate(${hourDegrees}deg)`;

            const options = { month: 'long' as 'long' | 'numeric' | '2-digit' | 'short' | 'narrow' };
            const month = new Intl.DateTimeFormat('en-US', options).format(now);
            const day = now.getDate();
            const year = now.getFullYear();
            const formattedHours = hours % 12 || 12; // Convert to 12-hour format
            const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Add leading zero if needed
            const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds; // Add leading zero if needed
            const ampm = hours >= 12 ? 'PM' : 'AM';

            const formattedDateTime = `${month} ${day}, ${year}, ${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
            setCurrentDateTime(formattedDateTime);
        };

        const interval = setInterval(updateClock, 1000);
        updateClock(); // Initial call to set the clock immediately

        return () => clearInterval(interval);
    }, []);



    return (
        <div className=" fixed z-30 right-0 bottom-0 pb-4 pr-4   ">
            <div className='flex bg-primary-foreground/25 backdrop-blur-sm  rounded-md'>
                {/* <Clock className="text-primary" size={20} /> */}
                <div className="text-[16px] text-primary px-2 py-1 ">{currentDateTime}</div>
            </div>

        </div>
    );
};

export default DashboardAnalogClock;