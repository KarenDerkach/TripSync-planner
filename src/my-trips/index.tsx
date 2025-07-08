import { useEffect, useState, useCallback } from "react";
import { db } from "@/service/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import UserTripCardItems from "@/components/allTrips/UserTripCardItems";
import type { AIresponse } from "@/lib/types";

export default function MyTrips() {
  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState<AIresponse[]>([]);
  console.log("MyTrips: ", userTrips);
  // Function to fetch user all trips from Firestore
  const GetUserTrips = useCallback(async () => {
    const userString = localStorage.getItem("user");
    if (!userString) {
      console.error("No user data found in localStorage.");
      navigate("/");
      return;
    }

    const user = JSON.parse(userString);

    if (!user) {
      console.error("No user data found in localStorage.");
      navigate("/");
      return;
    }
    setUserTrips([]);
    const q = query(
      collection(db, "AITrips"),
      where("userEmail", "==", user?.email)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No trips found for this user.");
      setUserTrips([]);
      return;
    }

    // Collect all trips first, then update state once
    const trips: AIresponse[] = [];
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
      trips.push({ id: doc.id, ...doc.data() } as AIresponse);
    });

    setUserTrips(trips);
  }, [navigate]);

  useEffect(() => {
    GetUserTrips();
    console.log("Fetching user trips...");
  }, [GetUserTrips]);

  return (
    <div>
      <h1 className="font-bold text-3xl">My Trips</h1>
      <div>
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {userTrips.length > 0
            ? userTrips.map((trip, index) => (
                <UserTripCardItems key={index} trip={trip} />
              ))
            : [1, 2, 3, 4].map((_, index) => (
                <div
                  key={index}
                  className="h-[250px] w-full bg-slate-200 animate-pulse rounded-xl mb-4"
                >
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500">Loading...</p>
                  </div>
                </div>
              ))}
        </section>
      </div>
    </div>
  );
}
