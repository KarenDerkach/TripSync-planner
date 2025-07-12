import { Link } from "react-router-dom";
import { usePlacesPhotos } from "../../hooks/useGooglePhotoService";
import type { Hotel } from "@/lib/types";

function HotelCardItem({ hotel }: { hotel: Hotel }) {
  const {
    address,
    description,
    // geoCoordinates,
    imageUrl,
    // image,
    name,
    pricePerNight,
    rating,
  } = hotel;

  const photoUrl = usePlacesPhotos(name);

  return (
    <Link
      to={`https://www.google.com/maps/search/?api=1&query=${name},${address}`}
      target="_blank"
      className="block mb-3 "
    >
      <img
        src={photoUrl ? photoUrl : imageUrl || "/placeholder.png"}
        alt={name}
        className="w-full h-[180px] object-cover rounded-md mb-3"
      />
      <h3 className="font-bold text-lg">{name}</h3>
      <p className="text-gray text-xs">📍{address}</p>
      <p className="text-gray-600">{description}</p>
      <p className="text-blue-500 font-semibold mt-2">
        ${pricePerNight} per night per person
      </p>
      <p className="text-sm text-gray-500">⭐ Rating: {rating}</p>
    </Link>
  );
}

export default HotelCardItem;
