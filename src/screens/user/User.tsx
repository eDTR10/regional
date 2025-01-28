import { ThemeProvider } from "@/components/theme-provider"

import viteLogo from "./../../assets/Logo.png";

import { Link, Outlet } from "react-router-dom";

// import { ModeToggle } from "./components/mode-toggle";
// import Reveal from "./components/animation/reveal";

import NavLink from "@/components/link/link";
import { ModeToggle } from "@/components/mode-toggle";
import { ArrowLeftIcon, Building2Icon, ListChecksIcon, LogOutIcon, MenuIcon } from "lucide-react";
import { useState } from "react";
import Profile from "@/components/profile/Profile";

import { useNavigate, } from "react-router-dom";
function User() {
    const navigate = useNavigate()
    const [show, setShow] = useState(false)


    return (
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <div className=" bg-background  h-screen w-screen overflow-hidden flex  ">

                <div className=" absolute z-30 flex gap-3 items-center right-0 p-7">
                    <ModeToggle />
                    <Profile />

                </div>
                <div className=" flex left-0 p-7 z-30 fixed ">
                    <MenuIcon className=" text-foreground hidden lg:hidden md:flex cursor-pointer " onClick={() => setShow(true)} />
                </div>





                <nav className={show ? " md:fixed duration-400 flex lg:flex animate__animated animate__slideInLeft z-30  md:flex flex-col   min-w-[250px] border-b-[0px] border-accent bg-primary h-full justify-between py-10 text-accent rounded-e-[20px] " : " translate-x-96 duration-450 relative md:hidden animate__animated animate__slideInLeft z-30   flex flex-col   min-w-[250px] border-b-[0px] border-accent bg-primary h-full justify-between py-10 text-accent rounded-e-[20px] "}>

                    <div className={show ? " absolute animate-slide-left z-30 right-0 cursor-pointer rounded-full bg-red-600   h-12 w-12  items-center justify-center mt-11 md:flex hidden" : "hidden"} onClick={() => setShow(false)}>
                        <ArrowLeftIcon className=" text-white " />
                    </div>
                    <div className=" flex h-full flex-col gap-10">
                        <Link className=" rounded-md flex  justify-center w-full " to={`${import.meta.env.VITE_BASE}/user`}>
                            <div className=" flex mr-4 flex-col gap-7 justify-center">
                                <div className=" bg-white rounded-md  ">
                                    <img src={viteLogo} className="logo w-36  object-contain  " alt="Vite logo" />
                                </div>

                                <hr className=" border border-b-[1px] border-background" />
                            </div>

                        </Link>
                        <nav className=" flex flex-col  pl-10 h-[40%] justify-between mt-10  ">
                            <div className=" text-accent-foreground flex flex-col  gap-5">
                                <NavLink
                                    to={`${import.meta.env.VITE_BASE}/user/home`}
                                    text="Dashboard"
                                    icon={<ListChecksIcon className="w-5 h-5 " />}
                                />
                                <NavLink
                                    to={`${import.meta.env.VITE_BASE}/user/employee-status`}
                                    text="User Activity"
                                    icon={<Building2Icon className=" w-5 h-5 " />}
                                />
                                <NavLink
                                    to={`${import.meta.env.VITE_BASE}/user/attendance-record`}
                                    text="Attendance Record"
                                    icon={<Building2Icon className=" w-5 h-5 " />}
                                />
                            </div>



                            <div className=" text-accent-foreground flex flex-col gap-5">

                                {/* <NavLink
                                    to="${import.meta.env.VITE_BASE}/user/profile"
                                    text="Profile"
                                    icon={<UsersIcon className="w-5 h-5 " />}
                                /> */}
                                {/* <NavLink
                                    to="${import.meta.env.VITE_BASE}/user/employee-status"
                                    text="Employee Status"
                                    icon={<Building2Icon className=" w-5 h-5 " />}
                                />
                                <NavLink
                                    to="${import.meta.env.VITE_BASE}/user/attendance-record"
                                    text="Attendance Record"
                                    icon={<Building2Icon className=" w-5 h-5 " />}
                                /> */}


                            </div>





                        </nav>
                    </div>


                    <div className="  pl-10 text-white">
                        <div onClick={() => {

                            
                            navigate(`${import.meta.env.VITE_BASE}`)
                            localStorage.clear()
                        }} className=" cursor-pointer flex gap-3 items-center justify-center bg-[#ff0000] hover:bg-red-600/80 w-[150px] h-10 rounded-sm">
                            <p >Log Out</p>
                            <LogOutIcon className=" w-5 h-5 " />
                        </div>
                    </div>

                </nav>



                <div className=" w-full flex" onClick={() => setShow(false)}>
                    <Outlet />
                </div>








            </div>

        </ThemeProvider>
    )
}



export default User
