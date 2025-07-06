import TripPlanner from "@/components/custom/TripPlanner";
function CreateTrip() {
  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10">
      <h2 className="font-bold text-3xl">Tell us yout travel preferences</h2>
      <p className="mt-3 text-gray-500 text-xl">
        Just provide some basic information, and our trip planner
      </p>

      <div>
        <div className="mt-8">
          <TripPlanner />
        </div>
      </div>
    </div>
  );
}

export default CreateTrip;
