import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";

type GoogleModalProps = {
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  login: () => void;
};

function GoogleModal({ openDialog, setOpenDialog, login }: GoogleModalProps) {
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className="flex flex-col  justify-center items-center mb-5">
              <img
                src="/airplane.gif"
                alt="TripSync Logo"
                className="w-16 h-16"
              />
              <h2 className="font-bold text-xl mt-7 ml-7">
                Sign In with Google!
              </h2>
            </div>
          </DialogTitle>
          <DialogDescription>
            <p className="text-lg text-gray-700 text-center">
              Sign in to the App with Google authentication security
            </p>
            <Button
              variant="default"
              onClick={() => login()}
              className="w-full mt-5 flex gap-4 items-center text-lg font-semibold"
            >
              {" "}
              <FcGoogle className="h-7 w-7" /> Sign In
            </Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default GoogleModal;
