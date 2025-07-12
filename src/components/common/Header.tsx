import { Button } from "../ui/button";
import GoogleModal from "../custom/GoogleModal";
import { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function Header() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuthContext();
  const [openDialog, setOpenDialog] = useState(false);

  const handleLogin = () => {
    login();
    setOpenDialog(false);
  };

  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-50 backdrop-blur-md shadow-lg border-b border-white border-opacity-20">
        <div className="p-4 flex justify-between items-center px-5 max-w-7xl mx-auto">
          <a href="/" className="flex items-center">
            <img
              src="/trans_bg.png"
              alt="TripSync Logo"
              className="h-14 w-auto"
            />
          </a>
          <div className="flex items-center">
            <div className="w-24 h-8 bg-gray-200 animate-pulse rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-50 backdrop-blur-md shadow-lg border-b border-white border-opacity-20">
      <div className="p-4 flex justify-between items-center px-5 max-w-7xl mx-auto">
        <a href="/" className="flex items-center">
          <img
            src="/trans_bg.png"
            alt="TripSync Logo"
            className="h-14 w-auto"
          />
        </a>

        <div>
          {isAuthenticated && user ? (
            <div className="flex items-center gap-5">
              <a href="/create-trip">
                <Button
                  variant={"outline"}
                  className="rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 backdrop-blur-sm border-white border-opacity-30"
                >
                  Create Trip
                </Button>
              </a>
              <a href="/my-trips">
                <Button
                  variant={"outline"}
                  className="rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 backdrop-blur-sm border-white border-opacity-30"
                >
                  My Trips
                </Button>
              </a>

              <Popover>
                <PopoverTrigger>
                  <img
                    src={user.picture || "/placeholder.png"}
                    alt={user.email}
                    className="h-[35px] w-[35px] rounded-full ml-2 ring-2 ring-white ring-opacity-50"
                  />
                </PopoverTrigger>
                <PopoverContent className="bg-white bg-opacity-100 backdrop-blur-md border-white border-opacity-30">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-600">{user.email}</p>
                    <hr className="my-2" />
                    <button
                      onClick={logout}
                      className="w-full text-left cursor-pointer text-red-500 text-sm hover:text-red-600 py-1"
                    >
                      Logout
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <Button
              onClick={() => setOpenDialog(true)}
              className="rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 backdrop-blur-sm border-white border-opacity-30 text-lg"
            >
              Sign In
            </Button>
          )}
        </div>

        {/* Google Login Dialog */}
        <GoogleModal
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          login={handleLogin}
        />
      </div>
    </div>
  );
}

export default Header;
