import { Button } from "../ui/button";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-center mt-10">
        Welcome to TripSync Planner
      </h1>
      <p className="text-center mt-4 text-lg">
        Your ultimate travel planning companion
      </p>
      <div className="flex justify-center mt-6">
        <Link to="/create-trip">
          <Button>Get Started!</Button>
        </Link>
      </div>
    </div>
  );
}

export default Hero;
