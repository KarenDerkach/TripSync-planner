const BASE_URL = "https://places.googleapis.com/v1/places:searchText";
import axios from "axios";

const config = {
  headers: {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": import.meta.env.VITE_GOOGLE_PLACE_API_KEY || "",
    "X-Goog-FieldMask": [
      "places.photos",
      "places.name",
      "places.id",
      "places.displayName",
    ],
  },
};

export const GetPlacesPhotos = async (query: string | object) =>
  axios.post(BASE_URL, query, config);

export const PHOTO_REF_URL = `https://places.googleapis.com/v1/NAME/media?maxHeightPx=1000&maxWidthPx=1000&key=${
  import.meta.env.VITE_GOOGLE_PLACE_API_KEY
}`;
