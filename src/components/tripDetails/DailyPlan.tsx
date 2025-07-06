import React from "react";
import PlaceCardItem from "./PlaceCardItem";

function DailyPlan({ trip }: { trip?: any }) {
  const dailyPlanData =
    trip?.tripData?.travelItinerary?.days ||
    trip?.tripData?.trip?.dailyItinerary;
  console.log("Daily Plan Data:", dailyPlanData);
  return (
    <div>
      <h2 className="font-bold text-xl mt-5 text-left">Daily Plan</h2>
      <div className="mt-5 ">
        {dailyPlanData?.length > 0 ? (
          dailyPlanData?.map((day: any, index: number) => (
            <div key={index} className="mb-6">
              <h3 className="font-semibold text-lg mb-2">{day.day}</h3>
              <p className="text-gray-600 mb-2">
                {day.activities.length} activities planned.
              </p>
              {day.activities.length > 0 && (
                <div className="my-3 grid grid-cols-1  lg:grid-cols-2 gap-4">
                  {day.activities.map((activity: any, idx: number) => (
                    <div key={idx} className="mb-2">
                      <h2>{activity.time}</h2>
                      <PlaceCardItem activities={activity} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No daily plan available.</p>
        )}
      </div>
    </div>
  );
}

export default DailyPlan;
