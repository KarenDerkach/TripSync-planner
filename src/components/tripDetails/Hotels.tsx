import type { AIresponse, Hotel } from "@/lib/types";
import HotelCardItem from "./HotelCardItem";

function Hotels({ trip }: { trip?: AIresponse | null }) {
  const hotelList = trip?.tripData?.trip?.hotels || [];

  return (
    <div>
      <h2 className="font-bold text-xl mt-5 text-left">
        Hotel Recommendations
      </h2>
      <div>
        {hotelList?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
            {hotelList?.map((hotel: Hotel, index: number) => (
              <div
                key={index}
                className="p-4 border rounded-lg hover:shadow-lg transition-shadow duration-300 text-left "
              >
                <HotelCardItem hotel={hotel} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No hotel recommendations available.</p>
        )}
      </div>
    </div>
  );
}

export default Hotels;
