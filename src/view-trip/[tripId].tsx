import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import InfoSection from "@/components/tripDetails/InfoSection";
import DailyPlan from "@/components/tripDetails/DailyPlan";
import Hotels from "@/components/tripDetails/Hotels";
import Footer from "@/components/tripDetails/Footer";

function ViewTrip() {
  const { tripId } = useParams<{ tripId: string }>();
  console.log("Trip ID:", tripId);

  const [tripData, setTripData] = useState(null);
  console.log("Trip Data:", tripData);

  const GetTripData = async () => {
    const docRef = doc(db, "AITrips", tripId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setTripData(docSnap.data());
      // You can set the data to state or do something with it
    } else {
      console.log("No such document!");
    }
  };

  useEffect(() => {
    if (tripId) {
      GetTripData();
    } else {
      console.error("No trip ID provided");
    }
  }, [tripId]);
  return (
    <div className="p-10 md:px-20 lg:px-44 xl:px-56">
      {/* Information Section */}
      <InfoSection trip={tripData} />
      {/* Recommended Hotels */}
      <Hotels trip={tripData} />
      {/* Daily Plan */}
      <DailyPlan trip={tripData} />
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default ViewTrip;
