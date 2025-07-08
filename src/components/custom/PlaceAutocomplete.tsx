import React, { useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

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
  const [value, setValue] = useState<string | null>(null);

  return (
    <div className={className}>
      <GooglePlacesAutocomplete
        apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
        selectProps={{
          value: value ? { label: value } : null,
          onChange: (place: { label: string } | null) => {
            setValue(place?.label || null);
            handleInputChange("destination", place?.label || "null");
          },
          placeholder,
          isClearable: true,
          className: "react-select-container",
          classNamePrefix: "react-select",
        }}
        apiOptions={{
          language: "en",
          region: "de",
        }}
      />
    </div>
  );
};

export default PlaceAutocomplete;
