import React from "react";
import { Link } from "react-router-dom";
import { GetPlacesPhotos, PHOTO_REF_URL } from "../../service/GlobalAPI";
import { useEffect, useState } from "react";

function HotelCardItem({ hotel }: { hotel: any }) {
  const [photoUrl, setPhotoUrl] = useState(null);
  const {
    address,
    hotelAddress,
    description,
    // geoCoordinates,
    imageUrl,
    image,
    hotelName,
    name,
    pricePerNight,
    price,
    rating,
  } = hotel;
  const getPlacePhoto = async () => {
    const data = {
      textQuery: hotelName || name,
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
    if (hotelName || name) {
      getPlacePhoto();
    }
  }, [hotelName || name]);
  return (
    <Link
      to={`https://www.google.com/maps/search/?api=1&query=${
        hotelName || name
      },${address}`}
      target="_blank"
      className="block mb-3 "
    >
      <img
        src={photoUrl ? photoUrl : imageUrl || "/placeholder.png"}
        alt={hotelName || name}
        className="w-full h-[180px] object-cover rounded-md mb-3"
      />
      <h3 className="font-bold text-lg">{hotelName || name}</h3>
      <p className="text-gray text-xs">📍{hotelAddress || address}</p>
      <p className="text-gray-600">{description}</p>
      <p className="text-blue-500 font-semibold mt-2">
        ${pricePerNight || price} per night per person
      </p>
      <p className="text-sm text-gray-500">⭐ Rating: {rating}</p>
    </Link>
  );
}

export default HotelCardItem;
