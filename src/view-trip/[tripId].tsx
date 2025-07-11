import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import InfoSection from "@/components/tripDetails/InfoSection";
import DailyPlan from "@/components/tripDetails/DailyPlan";
import Hotels from "@/components/tripDetails/Hotels";
import Footer from "@/components/tripDetails/Footer";
import type { AIresponse } from "@/lib/types";

function ViewTrip() {
  const { tripId } = useParams<{ tripId: string }>();
  console.log("Trip ID:", tripId);

  const [tripData, setTripData] = useState<AIresponse | null>(null);
  console.log("Trip Data:", tripData);

  const GetTripData = useCallback(async () => {
    if (!tripId) {
      throw new Error("tripId is undefined");
    }
    const docRef = doc(db, "AITrips", tripId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setTripData({ id: docSnap.id, ...docSnap.data() } as AIresponse);
      // You can set the data to state or do something with it
    } else {
      console.log("No such document!");
    }
  }, [tripId]);

  useEffect(() => {
    if (tripId) {
      GetTripData();
    } else {
      console.error("No trip ID provided");
    }
  }, [tripId, GetTripData]);
  return (
    <div className="p-10 md:px-20 lg:px-44 xl:px-56 mt-20 mx-auto">
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
