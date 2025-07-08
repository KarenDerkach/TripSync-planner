import type { AIresponse } from "@/lib/types";
import { usePlacesPhotos } from "../../service/hooks/GooglePhotoService";
import { Link } from "react-router-dom";

function UserTripCardItems({ trip }: { trip?: AIresponse | null }) {
  console.log("UserTripCardItems: ", trip);

  const photoUrl = usePlacesPhotos(trip?.userSelection?.destination);

  return (
    <Link to={`/view-trip/${trip?.id}`} className="block mb-3">
      <div className="hover:scale-105  transition-all cursor-pointer">
        <img
          src={photoUrl ? photoUrl : "/placeholder.png"}
          alt="placeholder img"
          className="object-cover rounded-xl"
        />
        <div>
          <h2 className="font-bold text-lg">
            {String(trip?.userSelection?.destination)}
          </h2>
          <p className="text-sm text-gray-500">
            {String(trip?.userSelection?.days)} days trip with{" "}
            {String(trip?.userSelection?.budget)} budget
          </p>
        </div>
      </div>
    </Link>
  );
}

export default UserTripCardItems;
