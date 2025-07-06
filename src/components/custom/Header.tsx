import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import GoogleModal from "./GoogleModal";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function Header() {
  const userString = localStorage.getItem("user");
  const userData = userString ? JSON.parse(userString) : null;

  const [openDialog, setOpenDialog] = useState(false);

  // Google OAuth login setup
  // This will handle the Google login process
  // and retrieve the user's profile information
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log("Login successful:", tokenResponse);
      GetUserProfile(tokenResponse);

      toast.success("Logged in successfully!");
    },
    onError: (error) => {
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again.");
    },
  });

  const GetUserProfile = (tokenInfo: { access_token: string }) => {
    fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenInfo?.access_token}`,
      {
        headers: {
          Authorization: `Bearer ${tokenInfo?.access_token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("User profile data:", data);
        // If everything is ok, generate trip
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(data));
        setOpenDialog(false);
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
        toast.error("Error fetching user profile. Please try again.");
      });
  };
  useEffect(() => {
    console.log("User data:", userData);
  }, [userData]);

  return (
    <div className="p-2 shadow-sm flex justify-between items-center px-5">
      <a href="/" className="flex items-center">
        <img src="/logo.svg" alt="TripSync Logo" className="h-8 w-auto" />
      </a>

      <div>
        {userData ? (
          <div className="flex items-center gap-5">
            <a href="/create-trip">
              <Button variant={"outline"} className="rounded-full">
                Create Trip
              </Button>
            </a>
            <a href="/my-trips">
              <Button variant={"outline"} className="rounded-full">
                My Trip
              </Button>
            </a>

            <Popover>
              <PopoverTrigger>
                <img
                  src={
                    userData?.picture ? userData.picture : "/placeholder.png"
                  }
                  alt={userData?.email}
                  className="h-[35px] w-[35px] rounded-full ml-2"
                />
              </PopoverTrigger>
              <PopoverContent>
                <h2
                  onClick={() => {
                    googleLogout();
                    localStorage.removeItem("user");
                    toast.success("Logged out successfully!");
                    window.location.reload();
                  }}
                  className="cursor-pointer text-sm text-gray-700 hover:text-red-500"
                >
                  Logout
                </h2>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Button
            onClick={() => {
              setOpenDialog(true);
            }}
          >
            Sign In
          </Button>
        )}
      </div>
      {/* Google Login Dialog */}
      <GoogleModal
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        login={login}
      />
    </div>
  );
}

export default Header;
