import { useEffect, useMemo, useRef, useState } from 'react';
import axios from '../../../../plugin/axios';
import { convertDate } from '@/helper/date-time';
import { Trophy, Clock, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type EarlyBird = {
    full_name: string;
    CHECKTIME: string;
    deptid: string;
};

const CONFETTI_COLORS = ['#fbbf24', '#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#ef4444', '#06b6d4'];

const medalConfig = [
    {
        emoji: '🏆',
        label: 'EARLY BIRD',
        celebrationBg: 'from-amber-400 via-yellow-300 to-amber-500',
        bg: 'bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-500',
        ring: 'ring-amber-300',
        avatarBg: 'bg-amber-600',
        textColor: 'text-amber-900',
        nameSize: 'text-xl',
        avatarSize: 'w-16 h-16 text-2xl',
        shadow: 'shadow-lg shadow-amber-400/40',
        glowHover: 'hover:shadow-xl hover:shadow-amber-400/60',
    },
    {
        emoji: '🥈',
        label: '2ND PLACE',
        celebrationBg: 'from-slate-300 via-zinc-200 to-slate-400',
        bg: 'bg-gradient-to-br from-slate-300 via-zinc-200 to-slate-400',
        ring: 'ring-slate-300',
        avatarBg: 'bg-slate-500',
        textColor: 'text-slate-800',
        nameSize: 'text-base',
        avatarSize: 'w-12 h-12 text-lg',
        shadow: 'shadow-md shadow-slate-300/40',
        glowHover: 'hover:shadow-xl hover:shadow-slate-400/60',
    },
    {
        emoji: '🥉',
        label: '3RD PLACE',
        celebrationBg: 'from-orange-300 via-amber-200 to-orange-400',
        bg: 'bg-gradient-to-br from-orange-300 via-amber-200 to-orange-400',
        ring: 'ring-orange-300',
        avatarBg: 'bg-orange-600',
        textColor: 'text-orange-900',
        nameSize: 'text-sm',
        avatarSize: 'w-10 h-10 text-base',
        shadow: 'shadow-md shadow-orange-300/30',
        glowHover: 'hover:shadow-xl hover:shadow-orange-400/50',
    },
];

const restConfig = {
    emoji: '⭐',
    label: 'TOP 10',
    celebrationBg: 'from-primary/80 via-blue-500 to-indigo-600',
    textColor: 'text-white',
    avatarBg: 'bg-primary/80',
};

/* ── Confetti ─────────────────────────────────────────── */
const Confetti = ({ count = 40 }: { count?: number }) => {
    const particles = useMemo(() =>
        Array.from({ length: count }, (_, i) => {
            const angle = (i / count) * 360 + Math.random() * (360 / count);
            const dist = 120 + Math.random() * 160;
            const rad = (angle * Math.PI) / 180;
            return {
                id: i,
                color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                tx: Math.cos(rad) * dist,
                ty: Math.sin(rad) * dist,
                rot: Math.random() * 720 - 360,
                size: 6 + Math.random() * 8,
                delay: Math.random() * 0.4,
                shape: i % 3, // 0=circle, 1=rect, 2=star
            };
        }), [count]);

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-3xl">
            {particles.map(p => (
                <div
                    key={p.id}
                    style={{
                        position: 'absolute',
                        width: p.shape === 1 ? p.size * 1.6 : p.size,
                        height: p.size,
                        background: p.color,
                        borderRadius: p.shape === 0 ? '50%' : p.shape === 1 ? '2px' : '0',
                        clipPath: p.shape === 2
                            ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                            : 'none',
                        // @ts-ignore
                        '--tx': `${p.tx}px`,
                        '--ty': `${p.ty}px`,
                        '--rot': `${p.rot}deg`,
                        animation: `confetti-fly 1s ease-out ${p.delay}s both`,
                    } as React.CSSProperties}
                />
            ))}
        </div>
    );
};

/* ── Celebration overlay ──────────────────────────────── */
const TrophyCelebration = ({
    bird,
    rank,
    onClose,
}: {
    bird: EarlyBird;
    rank: number;
    onClose: () => void;
}) => {
    const cfg = rank < 3 ? medalConfig[rank] : null;
    const emoji = cfg ? cfg.emoji : restConfig.emoji;
    const label = cfg ? cfg.label : restConfig.label;
    const gradBg = cfg ? cfg.celebrationBg : restConfig.celebrationBg;
    const timerRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        timerRef.current = setTimeout(onClose, 5000);
        return () => clearTimeout(timerRef.current);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-sm"
            onClick={onClose}
        >
            <style>{`
                @keyframes confetti-fly {
                    0%   { transform: translate(0,0) rotate(0deg); opacity: 1; }
                    100% { transform: translate(var(--tx), var(--ty)) rotate(var(--rot)); opacity: 0; }
                }
                @keyframes trophy-pop {
                    0%   { transform: scale(0) rotate(-25deg); opacity: 0; }
                    55%  { transform: scale(1.35) rotate(8deg); opacity: 1; }
                    75%  { transform: scale(0.88) rotate(-4deg); }
                    90%  { transform: scale(1.07) rotate(2deg); }
                    100% { transform: scale(1) rotate(0deg); }
                }
                @keyframes slide-up {
                    0%   { transform: translateY(24px); opacity: 0; }
                    100% { transform: translateY(0);    opacity: 1; }
                }
                @keyframes card-in {
                    0%   { transform: scale(0.6); opacity: 0; }
                    100% { transform: scale(1);   opacity: 1; }
                }
                @keyframes timer-bar {
                    0%   { width: 100%; }
                    100% { width: 0%; }
                }
                @keyframes trophy-float {
                    0%, 100% { transform: translateY(0px) scale(1); }
                    50%      { transform: translateY(-10px) scale(1.05); }
                }
            `}</style>

            {/* Card */}
            <div
                className="relative overflow-hidden rounded-3xl shadow-2xl max-w-xs w-full mx-4 text-center"
                style={{ animation: 'card-in 0.4s cubic-bezier(0.34,1.56,0.64,1) both' }}
                onClick={e => e.stopPropagation()}
            >
                {/* Gradient banner */}
                <div className={`bg-gradient-to-br ${gradBg} px-6 pt-8 pb-6 relative`}>
                    <Confetti count={44} />

                    {/* Close */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 hover:bg-white/40 transition-colors z-10"
                    >
                        <X className="w-3.5 h-3.5 text-white" />
                    </button>

                    {/* Trophy emoji */}
                    <div
                        className="text-7xl select-none"
                        style={{ animation: 'trophy-pop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.1s both, trophy-float 2.4s ease-in-out 0.8s infinite' }}
                    >
                        {emoji}
                    </div>

                    {/* Rank label */}
                    <div
                        className="mt-3 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/25 text-white text-xs font-bold tracking-widest uppercase"
                        style={{ animation: 'slide-up 0.4s ease 0.35s both' }}
                    >
                        {label}
                    </div>
                </div>

                {/* Info section */}
                <div className="bg-card px-6 py-5">
                    <p
                        className="text-lg font-extrabold text-foreground leading-tight"
                        style={{ animation: 'slide-up 0.4s ease 0.45s both', opacity: 0 }}
                    >
                        {bird.full_name}
                    </p>
                    <p
                        className="text-xs text-muted-foreground mt-1 truncate"
                        style={{ animation: 'slide-up 0.4s ease 0.52s both', opacity: 0 }}
                    >
                        {bird.deptid}
                    </p>

                    <div
                        className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold"
                        style={{ animation: 'slide-up 0.4s ease 0.6s both', opacity: 0 }}
                    >
                        <Clock className="w-3.5 h-3.5" />
                        Clocked in at {convertDate(bird.CHECKTIME).localeTime12HourFormat}
                    </div>

                    {/* Timer bar */}
                    <div className="mt-4 h-1 w-full rounded-full bg-border overflow-hidden">
                        <div
                            className="h-full bg-primary rounded-full"
                            style={{ animation: 'timer-bar 5s linear 0s both' }}
                        />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1.5">Click anywhere to close</p>
                </div>
            </div>
        </div>
    );
};

/* ── Main component ───────────────────────────────────── */
const EarlyBirdsLeaderboard = () => {
    const [earlyBirds, setEarlyBirds] = useState<EarlyBird[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<{ bird: EarlyBird; rank: number } | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_POINT}/today/`, {
                    headers: { Authorization: `Token ${localStorage.getItem('accessToken')}` },
                });

                const earliest: Record<string, EarlyBird> = {};
                response.data.forEach((record: any) => {
                    if (record.CHECKTYPE === 'I') {
                        const existing = earliest[record.full_name];
                        if (!existing || record.CHECKTIME < existing.CHECKTIME) {
                            earliest[record.full_name] = record;
                        }
                    }
                });

                const sorted = Object.values(earliest)
                    .sort((a, b) => a.CHECKTIME.localeCompare(b.CHECKTIME))
                    .slice(0, 10);

                setEarlyBirds(sorted);
            } catch (error) {
                console.error('Error fetching early birds:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const initials = (name: string) => name.substring(0, 2).toUpperCase();
    const open = (bird: EarlyBird, rank: number) => setSelected({ bird, rank });
    const close = () => setSelected(null);

    if (loading) {
        return (
            <div className="bg-card border border-border/60 rounded-2xl shadow-sm overflow-hidden flex flex-col" style={{ maxHeight: '500px' }}>
                <div className="flex items-center gap-3 p-5 border-b border-border/60">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <div className="space-y-1.5">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                </div>
                <div className="p-4 space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <>
            {selected && (
                <TrophyCelebration bird={selected.bird} rank={selected.rank} onClose={close} />
            )}

            <div className="bg-card border border-border/60 rounded-2xl shadow-sm overflow-hidden flex flex-col" style={{ maxHeight: '500px' }}>

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-border/60">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 ring-1 ring-amber-200 dark:ring-amber-800">
                            <Trophy className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-foreground">Early Birds</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Top {earlyBirds.length} earliest time-in today
                            </p>
                        </div>
                    </div>
                    <span className="text-2xl">🌅</span>
                </div>

                <div className="overflow-auto flex-1">
                    {earlyBirds.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                            <div className="p-4 rounded-full bg-muted/50 mb-4">
                                <Clock className="w-8 h-8 text-muted-foreground/40" />
                            </div>
                            <p className="text-sm font-medium text-muted-foreground">No time-ins recorded yet</p>
                            <p className="text-xs text-muted-foreground/60 mt-1">Check back once people start clocking in</p>
                        </div>
                    ) : (
                        <>
                            {/* Top 3 — graduated clickable cards */}
                            <div className="p-4 space-y-3">
                                {earlyBirds.slice(0, 3).map((bird, i) => {
                                    const cfg = medalConfig[i];
                                    return (
                                        <div
                                            key={bird.full_name}
                                            onClick={() => open(bird, i)}
                                            className={`${cfg.bg} ${cfg.shadow} ${cfg.glowHover} rounded-2xl ring-1 ${cfg.ring} p-4 flex items-center gap-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] select-none`}
                                            title="Click to celebrate!"
                                        >
                                            {/* Avatar */}
                                            <div className={`${cfg.avatarSize} rounded-full ${cfg.avatarBg} flex items-center justify-center text-white font-bold shrink-0 ring-2 ring-white/40 shadow-inner`}>
                                                {initials(bird.full_name)}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <p className={`${cfg.nameSize} font-extrabold ${cfg.textColor} truncate leading-tight`}>
                                                    {bird.full_name}
                                                </p>
                                                <p className={`text-xs ${cfg.textColor} opacity-60 mt-0.5 truncate`}>
                                                    {bird.deptid}
                                                </p>
                                                <div className={`inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-white/35 text-xs font-semibold ${cfg.textColor}`}>
                                                    <Clock className="w-3 h-3" />
                                                    {convertDate(bird.CHECKTIME).localeTime12HourFormat}
                                                </div>
                                            </div>

                                            {/* Medal — wiggles on group hover */}
                                            <div className="text-right shrink-0">
                                                <span
                                                    className={`${i === 0 ? 'text-5xl' : 'text-3xl'} inline-block transition-transform duration-300 hover:rotate-12 hover:scale-125`}
                                                >
                                                    {cfg.emoji}
                                                </span>
                                                <p className={`text-[10px] font-bold ${cfg.textColor} opacity-70 mt-1 tracking-wide`}>
                                                    {cfg.label}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Ranks 4–10 — compact uniform list */}
                            {earlyBirds.length > 3 && (
                                <div className="border-t border-border/40 divide-y divide-border/30">
                                    {earlyBirds.slice(3).map((bird, i) => (
                                        <div
                                            key={bird.full_name}
                                            onClick={() => open(bird, i + 3)}
                                            className="flex items-center gap-3 px-5 py-3 hover:bg-muted/50 active:bg-muted/80 transition-colors duration-150 cursor-pointer select-none group"
                                        >
                                            <span className="w-5 text-center text-xs font-bold text-muted-foreground/60 shrink-0 tabular-nums group-hover:text-primary transition-colors">
                                                {i + 4}
                                            </span>
                                            <div className="w-8 h-8 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0 transition-colors">
                                                {initials(bird.full_name)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{bird.full_name}</p>
                                                <p className="text-[10px] text-muted-foreground truncate">{bird.deptid}</p>
                                            </div>
                                            <span className="text-xs font-mono text-muted-foreground shrink-0">
                                                {convertDate(bird.CHECKTIME).localeTime12HourFormat}
                                            </span>
                                            <span className="text-base opacity-0 group-hover:opacity-100 transition-opacity shrink-0">⭐</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default EarlyBirdsLeaderboard;
