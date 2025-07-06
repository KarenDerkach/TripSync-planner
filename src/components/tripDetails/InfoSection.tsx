import React, { useEffect, useState } from "react";
import { LuShare2 } from "react-icons/lu";
import { Button } from "../ui/button";
import { GetPlacesPhotos } from "../../service/GlobalAPI";
import { PHOTO_REF_URL } from "../../service/GlobalAPI";

function InfoSection({ trip }: { trip?: any }) {
  const { destination, days, travelers, budget } = trip?.userSelection || {};

  const [photoUrl, setPhotoUrl] = useState(null);

  const getPlacePhoto = async () => {
    const data = {
      textQuery: destination,
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
    if (destination) {
      getPlacePhoto();
    }
  }, [destination]);
  return (
    <div>
      <img
        src={photoUrl || "https://via.placeholder.com/800x350"}
        alt={destination || "Destination Image"}
        loading="lazy"
        className="h-[350px] w-full object-cover rounded-xl"
      />
      <div className="flex justify-between items-center align-baseline mt-5">
        <div className="my-5 flex flex-col gap-2">
          <h2 className="font-bold text-2xl text-left">{destination}</h2>
          <div className="flex gap-5">
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-lg">
              📆 {days} Days
            </h2>
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-lg ">
              💰 {budget} Budget
            </h2>
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-lg">
              🙆 No. Of Traveler: {travelers}
            </h2>
          </div>
        </div>
        <Button>
          <LuShare2 />
        </Button>
      </div>
    </div>
  );
}

export default InfoSection;
