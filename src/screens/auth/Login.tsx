import R10bg from './../../assets/r10-bg.jpg'
import Logo from './../../assets/eDTR-logo.webp'
import Logo2 from './../../assets/DICT-Logo-Login.webp'


import InputText from '@/components/input/InputText'

import './login.css'
import { ModeToggle } from '@/components/mode-toggle'
import { ThemeProvider } from '@/components/theme-provider'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import axios from '../../plugin/axios'
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { Loader2 } from 'lucide-react'

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [lockoutTime, setLockoutTime] = useState<Date | null>(null);

    const navigate = useNavigate()
    const [user, setUser] = useState({
        email: "", password: ""
    })

    // Check if form fields are valid
    const isFormValid = user.email.trim() !== "" && user.password.trim() !== "";

    // Rate limiting constants
    const MAX_ATTEMPTS = 5;
    const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

    useEffect(() => {
        localStorage.getItem("accessToken") ? navigate(`${import.meta.env.VITE_BASE}/user/home`) : ""
        
        // Check if user is locked out on component mount
        const savedLockoutTime = localStorage.getItem('lockoutTime');
        const savedFailedAttempts = localStorage.getItem('failedAttempts');
        
        if (savedLockoutTime) {
            const lockTime = new Date(savedLockoutTime);
            const now = new Date();
            
            if (now.getTime() - lockTime.getTime() < LOCKOUT_DURATION) {
                setIsLocked(true);
                setLockoutTime(lockTime);
                setFailedAttempts(parseInt(savedFailedAttempts || '0'));
            } else {
                // Lockout period has expired, clear the data
                localStorage.removeItem('lockoutTime');
                localStorage.removeItem('failedAttempts');
            }
        }
    }, [])

    useEffect(() => {
        let interval: NodeJS.Timeout;
        
        if (isLocked && lockoutTime) {
            interval = setInterval(() => {
                const now = new Date();
                const timeElapsed = now.getTime() - lockoutTime.getTime();
                
                if (timeElapsed >= LOCKOUT_DURATION) {
                    setIsLocked(false);
                    setLockoutTime(null);
                    setFailedAttempts(0);
                    localStorage.removeItem('lockoutTime');
                    localStorage.removeItem('failedAttempts');
                    clearInterval(interval);
                }
            }, 1000);
        }
        
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isLocked, lockoutTime]);

    const getRemainingLockoutTime = () => {
        if (!lockoutTime) return 0;
        const now = new Date();
        const timeElapsed = now.getTime() - lockoutTime.getTime();
        const remaining = Math.max(0, LOCKOUT_DURATION - timeElapsed);
        return Math.ceil(remaining / 1000 / 60); // Return minutes
    };

    const handleFailedLogin = () => {
        const newFailedAttempts = failedAttempts + 1;
        setFailedAttempts(newFailedAttempts);
        localStorage.setItem('failedAttempts', newFailedAttempts.toString());
        
        if (newFailedAttempts >= MAX_ATTEMPTS) {
            const now = new Date();
            setIsLocked(true);
            setLockoutTime(now);
            localStorage.setItem('lockoutTime', now.toISOString());
            
            Swal.fire({
                icon: "warning",
                title: "Too Many Failed Attempts! 🚫",
                html: `
                    <div style="text-align: center; margin: 20px 0;">
                        <p style="font-size: 16px; margin-bottom: 15px;">
                            You have exceeded the maximum number of login attempts.
                        </p>
                        <p style="font-size: 14px; color: #f59e0b; margin-bottom: 10px;">
                            ⏰ Please come back later in <strong>15 minutes</strong>
                        </p>
                        <p style="font-size: 12px; color: #666; font-style: italic;">
                            🛡️ This is for security purposes
                        </p>
                    </div>
                `,
                confirmButtonText: "I Understand",
                confirmButtonColor: "#f59e0b",
                allowOutsideClick: false
            });
        } else {
            const remainingAttempts = MAX_ATTEMPTS - newFailedAttempts;
            Swal.fire({
                icon: "error",
                title: "Login Failed ❌",
                html: `
                    <div style="text-align: center; margin: 20px 0;">
                        <p style="font-size: 16px; margin-bottom: 10px;">
                            Invalid email or password
                        </p>
                        <p style="font-size: 14px; color: #f59e0b;">
                            ⚠️ <strong>${remainingAttempts}</strong> attempt(s) remaining
                        </p>
                    </div>
                `,
                confirmButtonText: "Try Again",
                confirmButtonColor: "#ef4444"
            });
        }
    };

    const handleSuccessfulLogin = () => {
        // Clear failed attempts on successful login
        setFailedAttempts(0);
        localStorage.removeItem('failedAttempts');
        localStorage.removeItem('lockoutTime');
    };

    return (
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <div className='bg-background relative w-screen h-screen overflow-hidden flex justify-center'>
                <div className='absolute right-0 p-10 z-30'>
                    <ModeToggle />
                </div>

                <div className="relative w-full h-full flex flex-col gap-4 items-center justify-center">
                    <img src={R10bg} className='pointer-events-none absolute z-0 h-full w-full object-cover opacity-5' alt="" />
                    <div className='flex gap-3 items-center'>
                        <img src={Logo} className='animate__animated animate__slideInLeft h-16 object-contain' alt="" />
                        <a href="https://www.facebook.com/DICTRegion10" target='_blank'>
                            <img src={Logo2} className='animate__animated animate__slideInRight h-24 object-contain' alt="" />
                        </a>
                    </div>

                    <form className='animate__animated animate__fadeInUp mb-10 z-10 w-full sm:w-[95%] sm:mx-4 max-w-[450px] flex flex-col items-center min-h-[100px] py-10 px-6 rounded-md bg-card border-2 border-border' 
                          onSubmit={(e: any) => {
                        e.preventDefault()
                        
                        if (isLocked) {
                            Swal.fire({
                                icon: "warning",
                                title: "Account Temporarily Locked 🔒",
                                html: `
                                    <div style="text-align: center; margin: 20px 0;">
                                        <p style="font-size: 16px; margin-bottom: 15px;">
                                            Too many failed login attempts detected.
                                        </p>
                                        <p style="font-size: 14px; color: #f59e0b; margin-bottom: 10px;">
                                            ⏰ Please wait <strong>${getRemainingLockoutTime()}</strong> more minutes
                                        </p>
                                        <p style="font-size: 12px; color: #666; font-style: italic;">
                                            🛡️ This is for security purposes
                                        </p>
                                    </div>
                                `,
                                confirmButtonText: "I Understand",
                                confirmButtonColor: "#f59e0b"
                            });
                            return;
                        }
                        
                        setIsLoading(true)

                        // Create a timeout promise
                        const timeoutPromise = new Promise((_, reject) =>
                            setTimeout(() => reject(new Error('Server timeout')), 5000)
                        );

                        // Race between the API call and timeout
                        Promise.race([
                            axios.post('token/login/', user),
                            timeoutPromise
                        ]).then((e: any) => {
                            if (e.data.auth_token) {
                                localStorage.setItem("accessToken", e.data.auth_token)
                                return axios.get('users/userDetails/', {
                                    headers: {
                                        Authorization: `Token ${e.data.auth_token}`,
                                    },
                                })
                            }
                        }).then((z: any) => {
                            if (z) {
                                handleSuccessfulLogin();
                                Swal.fire({
                                    icon: "success",
                                    title: "Login Successfully! 🎉",
                                    html: `
                                        <div style="text-align: center; margin: 20px 0;">
                                            <p style="font-size: 16px; color: #10b981;">
                                                Welcome back! 😊
                                            </p>
                                        </div>
                                    `,
                                    showConfirmButton: false,
                                    timer: 2000
                                });
                                localStorage.setItem("user", JSON.stringify(z.data))
                                if (z.data.access_lvl === 14) {
                                    navigate(`${import.meta.env.VITE_BASE}/admin`)
                                } else {
                                    navigate(`${import.meta.env.VITE_BASE}/user`)
                                }
                            }
                        }).catch((error: any) => {
                            if (error.message === 'Server timeout') {
                                Swal.fire({
                                    icon: "warning",
                                    title: "Server Not Responding ⏰",
                                    text: "The server is taking too long to respond. Please try again later.",
                                    showConfirmButton: true,
                                });
                            } else {
                                handleFailedLogin();
                            }
                        }).finally(() => {
                            setIsLoading(false)
                        })
                    }}>
                        <div className='w-[95%] h-16 flex'>
                            <h1 className='text-foreground text-3xl font-bold'>SIGN IN</h1>
                        </div>

                        <div className='flex flex-col gap-4 w-[85%]'>
                            <InputText
                                label="Email"
                                value={user.email}
                                onChange={(e: any) => {
                                    setUser({ ...user, email: e.target.value })
                                }}
                                type="email"
                            />
                            <div className='relative flex'>
                                <InputText
                                    label="Password"
                                    value={user.password}
                                    onChange={(e: any) => {
                                        setUser({ ...user, password: e.target.value });
                                    }}
                                    type={showPassword ? "text" : "password"}
                                    style={{ paddingRight: '2.5rem' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    className='right-0 flex items-center sm:mt-4 h-full w-10 absolute'
                                >
                                    {!showPassword ? <EyeOffIcon className='w-5 h-5' /> : <EyeIcon className='w-5 h-5' />}
                                </button>
                            </div>
                            <Link to={`${import.meta.env.VITE_BASE}/forgot-password`} className='text-foreground font-semibold text-sm cursor-pointer self-end pt-2 pb-6 hover:underline'>
                                Forgot password?
                            </Link>

                            <button 
                                disabled={isLoading || !isFormValid || isLocked} 
                                className={`btn-donate flex items-center justify-center gap-2 ${
                                    (isLoading || !isFormValid || isLocked) ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Signing In...
                                    </>
                                ) : isLocked ? (
                                    `🔒 Locked (${getRemainingLockoutTime()}m remaining)`
                                ) : !isFormValid ? (
                                    'Sign In (Fill all fields first)'
                                ) : (
                                    'Sign In'
                                )}
                            </button>

                            {/* Show warning when approaching max attempts */}
                            {failedAttempts > 0 && failedAttempts < MAX_ATTEMPTS && !isLocked && (
                                <div className="text-center text-sm text-yellow-600 mt-2">
                                    ⚠️ Warning: {MAX_ATTEMPTS - failedAttempts} attempt(s) remaining
                                </div>
                            )}
                        </div>
                    </form>
                </div>
                <p className='absolute text-foreground bottom-0 z-20 self-center pb-4 hover:underline cursor-pointer text-sm'>
                    Developed by: DICT Region 10
                </p>
            </div>
        </ThemeProvider>
    )
}

export default Login