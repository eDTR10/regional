import { Building, Bus, Cake, CheckCircle, HeartHandshake, Plane, Users, Home, TrendingUp } from "lucide-react";

const DashboardCards = (data: any) => {
    const employeeData = [
        { category: 'Total Employees', count: data?.data?.total_employees, icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-950/40', ringColor: 'ring-blue-100 dark:ring-blue-900' },
        { category: 'Total Attendance', count: data?.data?.total_in_today, icon: CheckCircle, color: 'text-emerald-600', bgColor: 'bg-emerald-50 dark:bg-emerald-950/40', ringColor: 'ring-emerald-100 dark:ring-emerald-900' },
        { category: 'In-Office', count: data?.data?.status_summary?.in_office, icon: Building, color: 'text-violet-600', bgColor: 'bg-violet-50 dark:bg-violet-950/40', ringColor: 'ring-violet-100 dark:ring-violet-900' },
        { category: 'Out-of-Office', count: data?.data?.status_summary?.out_of_office, icon: HeartHandshake, color: 'text-amber-600', bgColor: 'bg-amber-50 dark:bg-amber-950/40', ringColor: 'ring-amber-100 dark:ring-amber-900' },
        { category: 'Work from Home', count: data?.data?.status_summary?.on_home, icon: Home, color: 'text-teal-600', bgColor: 'bg-teal-50 dark:bg-teal-950/40', ringColor: 'ring-teal-100 dark:ring-teal-900' },
        { category: 'On Travel', count: data?.data?.status_summary?.on_travel, icon: Bus, color: 'text-orange-600', bgColor: 'bg-orange-50 dark:bg-orange-950/40', ringColor: 'ring-orange-100 dark:ring-orange-900' },
        { category: 'On Leave', count: data?.data?.status_summary?.on_leave, icon: Plane, color: 'text-rose-600', bgColor: 'bg-rose-50 dark:bg-rose-950/40', ringColor: 'ring-rose-100 dark:ring-rose-900' },
        { category: "Today's Birthday", count: data?.data?.birthday_celebrants_count, icon: Cake, color: 'text-pink-600', bgColor: 'bg-pink-50 dark:bg-pink-950/40', ringColor: 'ring-pink-100 dark:ring-pink-900' },
    ];

    return (
        <div className="w-full relative">
            {/* Section header */}
            <div className="flex items-center gap-2 mb-4 pt-6 pb-1">
                <div className="p-1.5 rounded-lg bg-primary/10">
                    <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-sm font-semibold text-foreground tracking-wide uppercase">Overview</h2>
                <div className="flex-1 h-px bg-border/60 ml-2" />
            </div>

            <div className="grid grid-cols-4 w-full sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {employeeData.map((item, index) => (
                    <div
                        key={index}
                        className="group relative bg-card border border-border/60 w-full rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                    >
                        {/* Subtle gradient accent on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                        <div className="relative flex justify-between items-start">
                            <div className="flex-1">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{item.category}</p>
                                <p className="text-3xl font-bold text-foreground tabular-nums">{item.count ?? '—'}</p>
                            </div>
                            <div className={`p-2.5 rounded-xl ${item.bgColor} ring-1 ${item.ringColor}`}>
                                <item.icon className={`w-5 h-5 ${item.color}`} />
                            </div>
                        </div>

                        {/* Bottom accent bar */}
                        <div className={`h-0.5 w-8 rounded-full ${item.bgColor} group-hover:w-full transition-all duration-500`} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashboardCards;