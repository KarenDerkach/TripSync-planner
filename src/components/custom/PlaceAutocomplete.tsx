import React, { useState, useEffect, useRef, useCallback } from "react";

interface PlaceAutocompleteProps {
  placeholder?: string;
  className?: string;
  handleInputChange?: (name: string, value: string) => void;
}

interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

const PlaceAutocomplete: React.FC<PlaceAutocompleteProps> = ({
  placeholder = "Search for a place...",
  className = "",
  handleInputChange = () => {}, // Default to a no-op function
}) => {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<PlacePrediction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const autocompleteService =
    useRef<google.maps.places.AutocompleteService | null>(null);
  const geocoder = useRef<google.maps.Geocoder | null>(null);

  // Initialize Google Maps services
  useEffect(() => {
    const initializeServices = async () => {
      const apiKey = import.meta.env.VITE_GOOGLE_PLACE_API_KEY;

      if (!apiKey) {
        setError(
          "Google Places API key is missing. Please check your .env file."
        );
        return;
      }

      try {
        // Load Google Maps API if not already loaded
        if (!window.google?.maps) {
          const script = document.createElement("script");
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
          script.async = true;
          script.defer = true;

          script.onload = () => {
            initServices();
          };

          script.onerror = () => {
            setError("Failed to load Google Maps API");
          };

          document.head.appendChild(script);
        } else {
          initServices();
        }
      } catch (err) {
        setError("Error initializing Google Maps services");
        console.error(err);
      }
    };

    const initServices = () => {
      try {
        autocompleteService.current =
          new google.maps.places.AutocompleteService();
        geocoder.current = new google.maps.Geocoder();
        setIsLoaded(true);
        setError(null);
        console.log("Google Maps services initialized successfully");
      } catch (err) {
        setError("Failed to initialize Google Maps services");
        console.error(err);
      }
    };

    initializeServices();
  }, []);

  const fetchSuggestions = useCallback(async (input: string) => {
    if (!autocompleteService.current || input.trim() === "") {
      setSuggestions([]);
      return;
    }

    try {
      const request = {
        input: input,
        types: ["geocode"], // You can customize this: ["establishment", "geocode", etc.]
      };

      autocompleteService.current.getPlacePredictions(
        request,
        (predictions, status) => {
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            const formattedSuggestions: PlacePrediction[] = predictions.map(
              (prediction) => ({
                place_id: prediction.place_id!,
                description: prediction.description,
                structured_formatting: {
                  main_text: prediction.structured_formatting?.main_text || "",
                  secondary_text:
                    prediction.structured_formatting?.secondary_text || "",
                },
              })
            );
            setSuggestions(formattedSuggestions);
          } else {
            setSuggestions([]);
            if (
              status !== google.maps.places.PlacesServiceStatus.ZERO_RESULTS
            ) {
              console.warn("AutocompleteService failed:", status);
            }
          }
        }
      );
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setSuggestions([]);
    }
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);

    if (inputValue.trim() !== "") {
      setShowSuggestions(true);
      // Debounce the API calls
      const timeoutId = setTimeout(() => {
        fetchSuggestions(inputValue);
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  const handleSelect = async (suggestion: PlacePrediction) => {
    setValue(suggestion.description);
    setShowSuggestions(false);
    setSuggestions([]);

    // Get latitude and longitude via Geocoding API
    if (geocoder.current) {
      try {
        console.log("Fetching geocode for:", suggestion.description);

        geocoder.current.geocode(
          { address: suggestion.description },
          (results, status) => {
            if (
              status === google.maps.GeocoderStatus.OK &&
              results &&
              results[0]
            ) {
              const location = results[0].geometry.location;
              const lat = location.lat();
              const lng = location.lng();
              console.log("📍 Coordinates: ", { lat, lng });

              // Call the parent component's handler
              handleInputChange("destination", suggestion.description);
            } else {
              console.error("Geocoding failed:", status);
            }
          }
        );
      } catch (error) {
        console.error("😱 Error fetching coordinates: ", error);
      }
    }
  };

  if (error) {
    return (
      <div className={`${className}`}>
        <input
          disabled
          placeholder="Google Maps API Error"
          className="w-full px-3 py-2 border border-red-300 rounded-md bg-red-50 text-red-700"
        />
        <p className="text-xs text-red-600 mt-1">{error}</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`${className}`}>
        <input
          disabled
          placeholder="Loading Google Maps..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
        />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <input
        value={value}
        onChange={handleInput}
        disabled={!isLoaded}
        placeholder={isLoaded ? placeholder : "Loading Google Maps..."}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        onFocus={() => value.trim() !== "" && setShowSuggestions(true)}
        onBlur={() => {
          // Delay hiding suggestions to allow clicking on them
          setTimeout(() => setShowSuggestions(false), 150);
        }}
      />

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.place_id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
              onClick={() => handleSelect(suggestion)}
            >
              <div className="font-medium text-gray-900">
                {suggestion.structured_formatting.main_text}
              </div>
              <div className="text-sm text-gray-600">
                {suggestion.structured_formatting.secondary_text}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaceAutocomplete;
