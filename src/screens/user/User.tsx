import { ThemeProvider } from "@/components/theme-provider"

import viteLogo from "./../../assets/Logo.png";

import { Link, Outlet } from "react-router-dom";

// import { ModeToggle } from "./components/mode-toggle";
// import Reveal from "./components/animation/reveal";

import NavLink from "@/components/link/link";
import { ModeToggle } from "@/components/mode-toggle";
import { ArrowLeftIcon, Building2Icon, ListChecksIcon, LogOutIcon, MenuIcon, MapPinIcon } from "lucide-react";
import { useState } from "react";
import Profile from "@/components/profile/Profile";

import { useNavigate, } from "react-router-dom";

/**
 * Calculates the distance between two points on Earth using the Haversine formula
 * @param lat1 Latitude of the first point in decimal degrees
 * @param lon1 Longitude of the first point in decimal degrees
 * @param lat2 Latitude of the second point in decimal degrees
 * @param lon2 Longitude of the second point in decimal degrees
 * @returns Distance in kilometers
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    // Haversine formula
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers

    return distance;
}

/**
 * Checks if a location is within a specified radius of a target destination
 * @param currentLat Current latitude
 * @param currentLon Current longitude
 * @param targetLat Target destination latitude
 * @param targetLon Target destination longitude
 * @param radiusKm Radius in kilometers (default: 2km)
 * @returns Boolean indicating if location is within radius and distance in kilometers
 */
function isWithinRadius(
    currentLat: number,
    currentLon: number,
    targetLat: number = 8.486646,
    targetLon: number = 124.6147548,
    radiusKm: number = 2
): { isNearby: boolean; distance: number } {
    const distance = calculateDistance(currentLat, currentLon, targetLat, targetLon);
    return {
        isNearby: distance <= radiusKm,
        distance: distance
    };
}


function User() {
    const navigate = useNavigate()
    const [show, setShow] = useState(false)
    const [locationInfo, setLocationInfo] = useState<string | null>(null)
    const [proximityStatus, setProximityStatus] = useState<string | null>(null)

    // Target office location coordinates (the ones provided)
    const targetLocation = {
        //8.4866874 , 124.6296183,
        latitude: 8.4866874,
        longitude: 124.6296183,
        name: "Office Location"
    };

    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    // Check proximity to target location
                    const { isNearby, distance } = isWithinRadius(
                        latitude,
                        longitude,
                        targetLocation.latitude,
                        targetLocation.longitude
                    );

                    setLocationInfo(`Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`);

                    // Set proximity status
                    if (isNearby) {
                        setProximityStatus(`✅ Within office range! (${distance.toFixed(2)} km)`);
                    } else {
                        setProximityStatus(`❌ Outside office range (${distance.toFixed(2)} km from office)`);
                    }
                },
                (error) => {
                    setLocationInfo(`Error: ${error.message}`);
                    setProximityStatus(null);
                }
            );
        } else {
            setLocationInfo("Geolocation not supported");
            setProximityStatus(null);
        }
    }

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

                                {/* Location Button */}
                                <div
                                    className="flex items-center gap-2 cursor-pointer text-accent-foreground hover:text-white px-2 py-1.5 rounded-md hover:bg-accent/20"
                                    onClick={handleGetLocation}
                                >
                                    <MapPinIcon className="w-5 h-5" />
                                    <span>Check Office Range</span>
                                </div>

                                {locationInfo && (
                                    <div className="text-xs bg-accent/10 p-2 rounded-md break-words max-w-[200px]" id="location">
                                        {locationInfo}
                                        {proximityStatus && (
                                            <div className={`mt-1 font-medium ${proximityStatus.includes('✅') ? 'text-green-500' : 'text-red-500'}`}>
                                                {proximityStatus}
                                            </div>
                                        )}
                                    </div>
                                )}
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
