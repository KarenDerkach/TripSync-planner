import { LuShare2 } from "react-icons/lu";
import { Button } from "../ui/button";
import { usePlacesPhotos } from "../../hooks/useGooglePhotoService";
import type { AIresponse } from "@/lib/types";

function InfoSection({ trip }: { trip?: AIresponse | null }) {
  const { destination, days, travelers, budget } = trip?.userSelection || {};

  const photoUrl = usePlacesPhotos(destination);

  const handleShare = () => {
    const shareText = `🌟 Check out my amazing trip plan! 🌟

📍 Destination: ${destination}
📅 Duration: ${days} days
💰 Budget: ${budget}
👥 Travelers: ${travelers}

Planning a trip has never been easier with TripSync! ✈️

${window.location.href}`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, "_blank");
  };

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
        <Button
          onClick={handleShare}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white"
          title="Share on WhatsApp"
        >
          <LuShare2 />
          Share
        </Button>
      </div>
    </div>
  );
}

export default InfoSection;
