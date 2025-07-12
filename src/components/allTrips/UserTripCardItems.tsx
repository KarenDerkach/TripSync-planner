import type { AIresponse } from "@/lib/types";
import { usePlacesPhotos } from "../../hooks/useGooglePhotoService";
import { Link } from "react-router-dom";

function UserTripCardItems({ trip }: { trip?: AIresponse | null }) {
  console.log("UserTripCardItems: ", trip);

  const photoUrl = usePlacesPhotos(trip?.userSelection?.destination);

  return (
    <Link to={`/view-trip/${trip?.id}`} className="block mb-3">
      <div className="hover:scale-105 transition-all cursor-pointer w-full h-80 bg-white rounded-xl shadow-lg overflow-hidden">
        <img
          src={photoUrl ? photoUrl : "/placeholder.png"}
          alt="placeholder img"
          className="object-cover rounded-t-xl w-full h-48"
        />
        <div className="p-4 h-32 flex flex-col justify-between">
          <h2 className="font-bold text-lg line-clamp-2">
            {String(trip?.userSelection?.destination)}
          </h2>
          <p className="text-sm text-gray-500 line-clamp-2">
            {String(trip?.userSelection?.days)} days trip with{" "}
            {String(trip?.userSelection?.budget)} budget
          </p>
        </div>
      </div>
    </Link>
  );
}

export default UserTripCardItems;
