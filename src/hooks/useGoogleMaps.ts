import { useState, useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface UseGoogleMapsReturn {
  isLoaded: boolean;
  error: string | null;
  loading: boolean;
}

export const useGoogleMaps = (): UseGoogleMapsReturn => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_PLACE_API_KEY;

    if (!apiKey) {
      setError(
        "Google Places API key is missing. Please check your .env file."
      );
      setLoading(false);
      return;
    }

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps && window.google.maps.places) {
      console.log("Google Maps API already loaded");
      setIsLoaded(true);
      setLoading(false);
      return;
    }

    const loader = new Loader({
      apiKey: apiKey,
      version: "weekly",
      libraries: ["places"],
    });

    loader
      .load()
      .then(() => {
        console.log("Google Maps API loaded successfully");
        setIsLoaded(true);
        setError(null);
      })
      .catch((error) => {
        console.error("Error loading Google Maps API:", error);
        setError(`Failed to load Google Maps API: ${error.message}`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { isLoaded, error, loading };
};
