import { CheckCircle } from "lucide-react";


const UserDashboardCards = (data: any) => {
    const employeeData = [
        { category: 'Total Attendance', count: data?.data?.total_in_today, icon: CheckCircle, color: 'text-green-500' },
    ];


    return (
        <div>
            <div className=" w-full relative xs:w-[380px] ">
                <div className="w-full p-4">
                    {employeeData.map((data, index) => (
                        <div key={index} className="animate-fadeIn bg-primary-foreground border border-border w-full   rounded-lg p-6 py-4 flex flex-col justify-between">
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