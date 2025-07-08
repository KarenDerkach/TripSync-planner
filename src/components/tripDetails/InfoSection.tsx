import { LuShare2 } from "react-icons/lu";
import { Button } from "../ui/button";
import { usePlacesPhotos } from "../../service/hooks/GooglePhotoService";
import type { AIresponse } from "@/lib/types";

function InfoSection({ trip }: { trip?: AIresponse | null }) {
  const { destination, days, travelers, budget } = trip?.userSelection || {};

  const photoUrl = usePlacesPhotos(destination);

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
