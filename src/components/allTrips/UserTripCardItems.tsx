import { GetPlacesPhotos, PHOTO_REF_URL } from "@/service/GlobalAPI";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function UserTripCardItems({
  trip,
}: {
  trip: {
    id: string;
    userEmail: string;
    userName: string;
    userSelection: Record<string, unknown>;
    tripData: Record<string, unknown>;
  };
}) {
  console.log("UserTripCardItems: ", trip);
  const [photoUrl, setPhotoUrl] = useState(null);
  const getPlacePhoto = async () => {
    const data = {
      textQuery: trip.userSelection.destination,
    };
    const result = await GetPlacesPhotos(data as any)
      .then((resp) => {
        console.log(
          "Place Photos Response:",
          resp.data.places[0].photos[3].name
        );
        const PhotoUrl = PHOTO_REF_URL.replace(
          "NAME",
          resp.data.places[0].photos[3].name
        );
        console.log("Photo URL:", PhotoUrl);
        setPhotoUrl(PhotoUrl);
      })
      .catch((error) => {
        console.error("Error fetching place photos:", error);
        return [];
      });
    return result;
  };

  useEffect(() => {
    if (trip.userSelection.destination) {
      getPlacePhoto();
    }
  }, [trip.userSelection.destination]);

  return (
    <Link to={`/view-trip/${trip.id}`} className="block mb-3">
      <div className="hover:scale-105  transition-all cursor-pointer">
        <img
          src={photoUrl ? photoUrl : "/placeholder.png"}
          alt="placeholder img"
          className="object-cover rounded-xl"
        />
        <div>
          <h2 className="font-bold text-lg">
            {trip.userSelection.destination}
          </h2>
          <p className="text-sm text-gray-500">
            {trip.userSelection.days} days trip with {trip.userSelection.budget}{" "}
            budget
          </p>
        </div>
      </div>
    </Link>
  );
}

export default UserTripCardItems;
