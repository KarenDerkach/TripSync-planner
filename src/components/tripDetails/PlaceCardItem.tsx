import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { MdLocationPin } from "react-icons/md";
import { Link } from "react-router-dom";
import { GetPlacesPhotos, PHOTO_REF_URL } from "@/service/GlobalAPI";

function PlaceCardItem({ activities }: { activities?: any }) {
  const {
    place,
    details,
    // geoCoordinates,
    imageUrl,
    rating,
    ticketPrice,
    price,
    estimatedCost,
    estimatedTime,
    duration,
    time,
  } = activities || {};
  const [photoUrl, setPhotoUrl] = useState(null);
  const getPlacePhoto = async () => {
    const data = {
      textQuery: place,
    };
    const result = await GetPlacesPhotos(data as any)
      .then((resp) => {
        console.log(
          "Place Photos Response:",
          resp.data.places[0].photos[3].place
        );
        const PhotoUrl = PHOTO_REF_URL.replace(
          "NAME",
          resp.data.places[0].photos[3].place
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
    if (place) {
      getPlacePhoto();
    }
  }, [place]);
  return (
    <div>
      {activities && (
        <Link
          to={`https://www.google.com/maps/search/?api=1&query=${place}`}
          target="_blank"
          className="block mb-3 "
        >
          <div className="p-4 border rounded-lg hover:scale-105 transition-all hover:shadow-md cursor-pointer mb-2 flex gap-4 items-start">
            <img
              src={photoUrl ? photoUrl : imageUrl}
              alt={place}
              className="w-[130px] h-[130px] object-cover rounded-md mb-3"
            />
            <div className="flex flex-col align-start justify-start">
              <h4 className="font-bold text-md">{place}</h4>
              <p className="text-gray-500 text-sm">{details}</p>
              {(duration || estimatedTime) && (
                <p className="text-gray-500 text-sm">
                  🕑{duration || estimatedTime}
                </p>
              )}
              {(ticketPrice || estimatedCost || price) && (
                <p className="text-gray-500 text-sm">
                  🎟️ {ticketPrice ? ticketPrice : estimatedCost || price}
                </p>
              )}
              <p className="text-gray-500 text-sm">⭐Rating: {rating}</p>
              {/* <Button>
                <MdLocationPin />
              </Button> */}
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}

export default PlaceCardItem;
