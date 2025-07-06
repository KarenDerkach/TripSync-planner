import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";

function GoogleModal({ openDialog, setOpenDialog, login }: any) {
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <img
              src="/logo.svg"
              alt="TripSync Logo"
              className="w-16 h-16 mb-4"
            />
            <h2 className="font-bold text-lg mt-7">Sign In with Google!</h2>
          </DialogTitle>
          <DialogDescription>
            <p>Sign in to the App with Google authentication security</p>
            <Button
              onClick={() => login()}
              className="w-full mt-5 flex gap-4 items-center"
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
