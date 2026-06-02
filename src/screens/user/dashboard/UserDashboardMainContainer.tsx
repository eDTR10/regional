import { useEffect, useState, useMemo } from 'react'
import axios from "../../../plugin/axios";
import UserDashboardTableAttendance from './dashboard-body/UserDashboardTableAttendance';

import DashboardCards from './dashboard-body/DashboardCards';
import DashboardAnalogClock from '@/screens/admin/dashboard/dashboard-body/DashboardAnalogClock';
import DashboardTableBirthday from '@/screens/admin/dashboard/dashboard-body/DashboardTableBirthday';
import EarlyBirdsLeaderboard from './dashboard-body/EarlyBirdsLeaderboard';
import { Building2, Car, Globe, Home, Plane } from 'lucide-react';
import { convertStatus } from '@/helper/convert-status';
import { Skeleton } from '@/components/ui/skeleton';

/* ───────── Floating Balloons Component ───────── */
const balloonColors = ['#ef4444', '#f97316', '#facc15', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#14b8a6', '#f43f5e', '#6366f1'];

const Balloon = ({ color, size }: { color: string; size: number }) => (
    <svg width={size} height={size * 1.5} viewBox="0 0 60 90" fill="none">
        {/* Balloon body */}
        <ellipse cx="30" cy="28" rx="26" ry="28" fill={color} />
        <ellipse cx="30" cy="28" rx="26" ry="28" fill="url(#shine)" />
        {/* Highlight / shine */}
        <ellipse cx="20" cy="18" rx="8" ry="10" fill="white" opacity="0.3" />
        {/* Knot */}
        <polygon points="27,55 33,55 30,60" fill={color} />
        {/* String */}
        <path d="M30 60 Q 25 72, 30 85 Q 35 72, 30 60" stroke={color} strokeWidth="1" fill="none" opacity="0.6" />
        <defs>
            <radialGradient id="shine" cx="0.35" cy="0.35" r="0.65">
                <stop offset="0%" stopColor="white" stopOpacity="0.4" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
        </defs>
    </svg>
);

const BirthdayBalloons = ({ show }: { show: boolean }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (show) {
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), 20000);
            return () => clearTimeout(timer);
        }
    }, [show]);

    const balloons = useMemo(() =>
        Array.from({ length: 50 }, (_, i) => {
            const isLeft = i < 12;
            return {
                id: i,
                color: balloonColors[i % balloonColors.length],
                left: isLeft
                    ? `${-2 + Math.random() * 12}%`
                    : `${88 + Math.random() * 12}%`,
                size: 40 + Math.random() * 30,
                duration: 6 + Math.random() * 6,
                delay: Math.random() * 6,
                swayAmount: 15 + Math.random() * 30,
                swaySpeed: 2 + Math.random() * 2,
            };
        })
        , []);

    if (!visible) return null;

    return (
        <>
            <style>{`
                @keyframes bRise {
                    0% {
                        transform: translateY(10vh);
                        translate: translateX(50vh);
                        opacity: 0;
                    }
                    5% {
                        opacity: 1;
                    }
                    85% {
                        opacity: 0.9;
                    }
                    100% {
                        transform: translateY(-120vh);
                        translate: translateX(50vh);
                        opacity: 0;
                    }
                }
                @keyframes bSway {
                    0%, 100% { transform: translateX(0) rotate(-3deg); }
                    25% { transform: translateX(calc(var(--sw) * 0.7)) rotate(2deg); }
                    50% { transform: translateX(var(--sw)) rotate(-2deg); }
                    75% { transform: translateX(calc(var(--sw) * 0.3)) rotate(3deg); }
                }
            `}</style>
            <div className="fixed inset-0 pointer-events-none z-[999] overflow-hidden">
                {balloons.map((b) => (
                    <div
                        key={b.id}
                        style={{
                            position: 'absolute',
                            left: b.left,
                            bottom: '-120px',
                            animation: `bRise ${b.duration}s ease-in-out ${b.delay}s forwards`,
                        }}
                    >
                        <div style={{
                            // @ts-ignore
                            '--sw': `${b.swayAmount}px`,
                            animation: `bSway ${b.swaySpeed}s ease-in-out infinite`,
                        } as React.CSSProperties}>
                            <Balloon color={b.color} size={b.size} />
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

/* ───────── Status Details ───────── */
const getStatusDetails = (status: number) => {
    switch (status) {
        case 1:
            return { color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-200 dark:border-emerald-800', icon: <Building2 className='w-3.5 h-3.5' /> };
        case 2:
            return { color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-950/30', border: 'border-rose-200 dark:border-rose-800', icon: <Car className='w-3.5 h-3.5' /> };
        case 3:
            return { color: 'text-sky-600', bg: 'bg-sky-50 dark:bg-sky-950/30', border: 'border-sky-200 dark:border-sky-800', icon: <Globe className='w-3.5 h-3.5' /> };
        case 4:
            return { color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-800', icon: <Plane className='w-3.5 h-3.5' /> };
        case 5:
            return { color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-200 dark:border-emerald-800', icon: <Home className='w-3.5 h-3.5' /> };
        default:
            return { color: 'text-slate-500', bg: 'bg-slate-50 dark:bg-slate-950/30', border: 'border-slate-200 dark:border-slate-800', icon: <Plane className='w-3.5 h-3.5' /> };
    }
};

/* ───────── Skeleton Loaders ───────── */
const DashboardCardsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
            </div>
        ))}
    </div>
);

const TableSkeleton = () => (
    <div className="space-y-3">
        <Skeleton className="h-12 w-full rounded-lg" />
        {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
    </div>
);

const HeaderSkeleton = () => (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-blue-600 to-indigo-700 p-8 md:p-5 shadow-lg">
        <div className="space-y-4">
            <Skeleton className="h-4 w-32 bg-blue-400/50" />
            <Skeleton className="h-8 w-48 bg-blue-400/50" />
            <Skeleton className="h-6 w-40 bg-blue-400/50" />
        </div>
    </div>
);


const UserDashboardMainContainer = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profileLoading, setProfileLoading] = useState(true);
    const userJson = localStorage.getItem("user");
    const userObject = userJson ? JSON.parse(userJson) : null;
    const fullName = userObject?.full_name;

    const [profileData, setProfileData] = useState<any>([]);
    const [hasBirthdays, setHasBirthdays] = useState(false);

    const status = profileData?.status ? profileData.status : 0;
    const statusDetails = getStatusDetails(status);

    useEffect(() => {
        // console.log(localStorage.getItem("accessToken"));
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get('users/summary', {
                    headers: {
                        Authorization: `Token ${localStorage.getItem("accessToken")}`,
                    },
                });
                setData(response.data);

                const hasBday = response.data.birthday_celebrants.length != 0;
                localStorage.setItem('birthday', hasBday ? "1" : "0");
                setHasBirthdays(hasBday);

            } catch (error: any) {
                console.error('Error fetching data:', error.response ? error.response.data : error.message);

            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        // console.log(localStorage.getItem("accessToken"));
        const fetchData = async () => {
            try {
                setProfileLoading(true);
                const response = await axios.get('users/userDetails', {
                    headers: {
                        Authorization: `Token ${localStorage.getItem("accessToken")}`,
                    },
                });
                setProfileData(response.data);
            } catch (error: any) {
                console.error('Error fetching data:', error.response ? error.response.data : error.message);

            } finally {
                setProfileLoading(false);
            }
        };
        fetchData();
    }, []);


    return (
        <div className="flex-1 h-full overflow-auto">
            <BirthdayBalloons show={hasBirthdays} />
            <DashboardAnalogClock />

            {/* Modern Header */}
            <div className="px-6 pt-16 pb-2 md:px-4">
                {profileLoading ? (
                    <HeaderSkeleton />
                ) : (
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-blue-600 to-indigo-700 p-8 md:p-5 shadow-lg">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
                        <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-white/5 rounded-full" />

                        <div className="relative z-10">
                            <p className="text-blue-100 text-sm font-medium mb-1 tracking-wide uppercase">Welcome back</p>
                            <h1 className="text-3xl md:text-2xl font-extrabold text-white tracking-tight mb-3">
                                {fullName} 👋
                            </h1>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-blue-100 text-sm">Current status:</span>
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusDetails.color} ${statusDetails.bg} ${statusDetails.border} border backdrop-blur-sm`}>
                                    {statusDetails.icon}
                                    {convertStatus(status)}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Cards Section */}
            <div className="px-6 md:px-4 pb-6">
                {loading ? (
                    <DashboardCardsSkeleton />
                ) : (
                    <DashboardCards data={data} />
                )}
            </div>

            {/* Tables Section */}
            <div className="px-6 pb-8 md:px-4 grid grid-cols-2 forTable:grid-cols-1 gap-6">
                {loading ? (
                    <>
                        <TableSkeleton />
                        <TableSkeleton />
                    </>
                ) : (
                    <>
                        <UserDashboardTableAttendance />
                        {hasBirthdays
                            ? <DashboardTableBirthday data={data} />
                            : <EarlyBirdsLeaderboard />
                        }
                    </>
                )}
            </div>
        </div>
    )
}

export default UserDashboardMainContainer
