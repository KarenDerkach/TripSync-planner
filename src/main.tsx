import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthProvider.tsx";
//Components
import ProtectedRoute from "./components/common/ProtectedRoute.tsx";
import CreateTrip from "./create-trip/index.tsx";
import Header from "./components/common/Header.tsx";
import ViewTrip from "./view-trip/[tripId].tsx";
import MyTrips from "./my-trips/index.tsx";
import App from "./App.tsx";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/create-trip",
    element: (
      <ProtectedRoute>
        <CreateTrip />
      </ProtectedRoute>
    ),
  },
  {
    path: "/view-trip/:tripId",
    element: <ViewTrip />,
  },
  {
    path: "/my-trips",
    element: (
      <ProtectedRoute>
        <MyTrips />
      </ProtectedRoute>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      <AuthProvider>
        <Header />
        <Toaster />
        <RouterProvider router={router} />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
