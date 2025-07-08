import { Link } from "react-router-dom";
import { usePlacesPhotos } from "../../service/hooks/GooglePhotoService";
import type { Activity } from "@/lib/types";

function PlaceCardItem({ activities }: { activities?: Activity }) {
  const {
    placeName: place,
    details,
    // geoCoordinates,
    // imageUrl,
    rating,
    ticketPrice,
    duration,
    // time,
  } = activities || {};

  const photoUrl = usePlacesPhotos(place);
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
              src={photoUrl ? photoUrl : "/placeholder.png"}
              alt={place}
              className="w-[130px] h-[130px] object-cover rounded-md mb-3"
            />
            <div className="flex flex-col align-start justify-start">
              <h4 className="font-bold text-md">{place}</h4>
              <p className="text-gray-500 text-sm">{details}</p>
              {duration && (
                <p className="text-gray-500 text-sm">🕑{duration}</p>
              )}
              {ticketPrice && (
                <p className="text-gray-500 text-sm">🎟️ {ticketPrice}</p>
              )}
              <p className="text-gray-500 text-sm">⭐Rating: {rating}</p>
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}

export default PlaceCardItem;
