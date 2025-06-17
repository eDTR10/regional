import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

// Add interface for location data
interface LocationData {
    latitude: number | null;
    longitude: number | null;
    error?: string;
}

const UserDashboardCards = (data: any) => {
    const [location, setLocation] = useState<LocationData>({
        latitude: null,
        longitude: null
    });

    const getLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                // Success callback
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                // Error callback
                (error) => {
                    setLocation({
                        latitude: null,
                        longitude: null,
                        error: `Error getting location: ${error.message}`
                    });
                }
            );
        } else {
            setLocation({
                latitude: null,
                longitude: null,
                error: "Geolocation is not supported by your browser"
            });
        }
    };

    useEffect(() => {
        getLocation();
    }, []);

    const employeeData = [
        { category: 'Total Attendance', count: data?.data?.total_in_today, icon: CheckCircle, color: 'text-green-500' },
        { 
            category: 'Current Location', 
            count: location.error ? 'Not Available' : 
                   `${location.latitude?.toFixed(6)}, ${location.longitude?.toFixed(6)}`,
            icon: CheckCircle, 
            color: 'text-blue-500' 
        }
    ];


    console.log("Employee Data:", employeeData);
    console.log("Location Data:", location);


    return (
        <div>
            <div className="w-full relative xs:w-[380px]">
                <div className="w-full p-4">
                    {employeeData.map((data, index) => (
                        <div key={index} className="animate-fadeIn bg-primary-foreground border border-border w-full rounded-lg p-6 py-4 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <h2 className="text-md text-foreground font-bold pr-2">{data.category}</h2>
                                <data.icon className={`text-4xl ${data.color}`} /> {/* Icon */}
                            </div>
                            <p className="text-3xl text-right font-bold text-foreground md:mt-4">{data.count}</p> {/* Value */}
                           
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserDashboardCards;