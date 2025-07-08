import React, { useState, useEffect } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { Loader } from "@googlemaps/js-api-loader";

interface PlaceAutocompleteProps {
  placeholder?: string;
  className?: string;
  handleInputChange?: (name: string, value: string) => void;
}

const PlaceAutocomplete: React.FC<PlaceAutocompleteProps> = ({
  placeholder = "Search for a place...",
  className = "",
  handleInputChange = () => {}, // Default to a no-op function
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_PLACE_API_KEY,
      version: "weekly",
      libraries: ["places"],
    });

    loader.load().then(() => {
      setIsLoaded(true);
    });
  }, []);

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here */
    },
    debounce: 300,
    cache: 24 * 60 * 60, // Cache for 24 hours
  });

  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Update the keyword of the input element
    setValue(e.target.value);
    setShowSuggestions(true);
  };

  const handleSelect = async (suggestion: {
    description: string;
    place_id: string;
  }) => {
    // When user selects a place, we can replace the keyword without request data from API
    // by setting the second parameter to "false"
    setValue(suggestion.description, false);
    setShowSuggestions(false);
    clearSuggestions();

    // Get latitude and longitude via utility functions
    try {
      const results = await getGeocode({ address: suggestion.description });
      const { lat, lng } = await getLatLng(results[0]);
      console.log("📍 Coordinates: ", { lat, lng });

      // Call the parent component's handler
      handleInputChange("destination", suggestion.description);
    } catch (error) {
      console.log("😱 Error: ", error);
    }
  };

  if (!isLoaded) {
    return (
      <div className={`${className}`}>
        <input
          disabled
          placeholder="Loading..."
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
        disabled={!ready}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => {
          // Delay hiding suggestions to allow clicking on them
          setTimeout(() => setShowSuggestions(false), 150);
        }}
      />

      {/* Suggestions dropdown */}
      {showSuggestions && status === "OK" && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {data.map((suggestion) => {
            const {
              place_id,
              structured_formatting: { main_text, secondary_text },
            } = suggestion;

            return (
              <div
                key={place_id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => handleSelect(suggestion)}
              >
                <div className="font-medium text-gray-900">{main_text}</div>
                <div className="text-sm text-gray-600">{secondary_text}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PlaceAutocomplete;
