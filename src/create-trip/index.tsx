import TripPlanner from "@/components/custom/TripPlanner";
import background from "@/assets/background.png";
function CreateTrip() {
  return (
    <div className="relative min-h-screen">
      {/* Imagen de fondo con difuminación */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-20 backdrop-blur-sm"></div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 pt-24 pb-10">
        {/* pt-24 para compensar el navbar fijo */}
        {/* Contenedor del formulario con shadow */}
        <div className="max-w-4xl mx-auto bg-white bg-opacity-95 backdrop-blur-md rounded-2xl shadow-2xl p-8 mt-8">
          <div className="text-center mb-8">
            <h2 className="font-bold text-3xl text-gray-800 mb-4">
              Tell us your travel preferences
            </h2>
            <p className="text-gray-600 text-xl">
              Just provide some basic information, and our trip planner will
              create the perfect itinerary for you
            </p>
          </div>

          <div className="mt-8">
            <TripPlanner />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTrip;
