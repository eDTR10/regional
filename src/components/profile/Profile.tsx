import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "./../../plugin/axios";
import { LogOutIcon, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { PersonIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [selectedAccountType, setSelectedAccountType] = useState(user.access_lvl || 14); // Initialize from localStorage
  const [profileData, setProfileData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false); // State to track loading status

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Start loading
      try {
        const response = await axios.get("users/userDetails", {
          headers: {
            Authorization: `Token ${localStorage.getItem("accessToken")}`,
          },
        });
        setProfileData(response.data);
        console.log("Fetched data:", response.data);
      } catch (error: any) {
        console.error(
          "Error fetching data:",
          error.response ? error.response.data : error.message
        );
      } finally {
        setIsLoading(false); // End loading
      }
    };
    fetchData();
  }, []);

  let navigate = useNavigate();

  function switchUser() {
    if (isLoading) return; // Prevent navigation if loading
    if (selectedAccountType === 14) {
      setSelectedAccountType(0);
      // const updatedUser = { ...user, access_lvl: 0 };
      // localStorage.setItem("user", JSON.stringify(updatedUser));
      navigate(`${import.meta.env.VITE_BASE}/user`);
    } else {
      setSelectedAccountType(14);
      // const updatedUser = { ...user, access_lvl: 14 };
      // localStorage.setItem("user", JSON.stringify(updatedUser));
      navigate(`${import.meta.env.VITE_BASE}/admin`);
    }

    console.log(selectedAccountType);

    // const newType = selectedAccountType === 14 ? 0 : 14;
    // setSelectedAccountType(newType);
    // const updatedUser = { ...user, access_lvl: newType };
    // localStorage.setItem("user", JSON.stringify(updatedUser));
    // navigate(newType === 14 ? "${import.meta.env.VITE_BASE}/user" : "${import.meta.env.VITE_BASE}/admin");
  }

  return (
    <DropdownMenu>
      {JSON.parse(localStorage.getItem('user')||'').access_lvl ==0?'':
      <Button className="flex items-center gap-2" variant="outline" onClick={switchUser} disabled={isLoading}>
      <span>
        <RefreshCcw className=" w-5 h-5 text-primary hover:animate-spin" />
      </span>
      {/* Switch to {selectedAccountType === 14 ? "User" : "Admin"} */}
    </Button>
      
    
    }
      
      <DropdownMenuTrigger>
        {profileData?.photos ? (
          <Avatar>
            <AvatarImage
              src={
                profileData?.photos
                  ? `${import.meta.env.VITE_URL}${profileData?.photos}`
                  : "https://github.com/shadcn.png"
              }
              alt={"profile"}
              className="rounded-full h-12 w-12  border border-border object-cover"
            />
          </Avatar>
        ) : (
          <div className=" text-background uppercase flex items-center justify-center font-semibold h-12 w-12 rounded-full bg-primary">
            {JSON.parse(localStorage.getItem("user") || "{}").full_name?.substring(0, 2)}{" "}
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className=" mr-10">
        <DropdownMenuItem className=" flex items-center gap-2 cursor-pointer">
          <div
            onClick={() => {
              if (user.access_lvl === 0) {
                navigate(`${import.meta.env.VITE_BASE}/user/profile`);
              } else {
                navigate(`${import.meta.env.VITE_BASE}/admin/profile`);
              }
            }}
            className=" flex items-center gap-2 text-foreground cursor-pointer"
          >
            <PersonIcon className=" w-5 h-5 text-foreground" /> View Profile
          </div>{" "}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <div
            onClick={() => {
              localStorage.clear();
              navigate(`${import.meta.env.VITE_BASE}`);
            }}
            className=" flex items-center gap-2 text-red-600 cursor-pointer"
          >
            <LogOutIcon className=" w-5 h-5 text-red-600 " /> Logout
          </div>{" "}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Profile;