import { Link } from "react-router-dom";
import heroImg from "../../assets/hero.png"; // Adjust the path as necessary

function Hero() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 brightness-75"
        style={{
          backgroundImage: `url(${heroImg})`,
        }}
      />
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center h-screen px-4">
        <h1 className="text-white text-4xl md:text-6xl font-extrabold drop-shadow-lg animate-fade-in-up">
          Welcome to <span className="text-orange-400">TripSync Planner</span>
        </h1>
        <p className="text-white mt-4 text-lg md:text-xl drop-shadow-md animate-fade-in-up delay-150">
          Plan less. Explore more.
        </p>
        <Link to="/create-trip">
          <button className="mt-6 px-6 py-3 bg-amber-300 text-yellow-50 font-extrabold  text-lg rounded-full shadow-lg hover:bg-opacity-80 transition animate-fade-in-up delay-300">
            Get Started!
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Hero;
