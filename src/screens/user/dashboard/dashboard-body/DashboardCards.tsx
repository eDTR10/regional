import { Building, Bus, Cake, CheckCircle, HeartHandshake, Plane, Users, Home } from "lucide-react";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";

const DashboardCards = (data: any) => {
    const employeeData = [
        { category: 'Total Employees', count: data?.data?.total_employees, icon: Users, color: 'text-blue-500' },
        { category: 'Total Attendance', count: data?.data?.total_in_today, icon: CheckCircle, color: 'text-green-500' },
        { category: 'In-Office', count: data?.data?.status_summary?.in_office, icon: Building, color: 'text-red-500' },
        { category: 'Out-of-Office', count: data?.data?.status_summary?.out_of_office, icon: HeartHandshake, color: 'text-yellow-500' },
        { category: 'Work from Home', count: data?.data?.status_summary?.on_home, icon: Home, color: 'text-green-500' },
        { category: 'On Travel', count: data?.data?.status_summary?.on_travel, icon: Bus, color: 'text-red-500' },
        { category: 'On Leave', count: data?.data?.status_summary?.on_leave, icon: Plane, color: 'text-red-500' },
        { category: 'Todays Birthday', count: data?.data?.birthday_celebrants_count, icon: Cake, color: 'text-red-500' },
    ];
    const [selectedCelebrant, setSelectedCelebrant] = useState<any>(null); // State for selected celebrant

    useEffect(() => {
        if (localStorage.getItem('birthday') == '1') {
            setSelectedCelebrant("name")
            setTimeout(() => {
                setSelectedCelebrant("")
            }, 5000)
        }
    }, [])

    console.log(data)

    return (
        <div>
            <div className="w-full relative xs:w-[380px]">
                <div className="grid grid-cols-8 w-full sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                    {employeeData.map((data, index) => (
                        <div key={index} className="animate-fadeIn bg-primary-foreground border border-border w-full rounded-lg p-6 py-4 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <h2 className="text-md text-foreground font-bold pr-2">{data.category}</h2>
                                <data.icon className={`text-4xl ${data.color}`} /> {/* Icon */}
                            </div>
                            <p className="text-3xl text-right font-bold text-foreground md:mt-4">{data.count}</p> {/* Value */}
                            {selectedCelebrant && <Confetti className="w-screen" />}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardCards;