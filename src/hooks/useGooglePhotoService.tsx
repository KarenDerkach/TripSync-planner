import { useCallback, useEffect, useState } from "react";
import {
  PHOTO_REF_URL,
  GetPlacesPhotos as fetchPlacesPhotos,
} from "../service/GlobalAPI";

type PhotoData = {
  textQuery: string;
};

export function usePlacesPhotos(propName: string | undefined) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const getPlacePhoto = useCallback(async () => {
    if (!propName) return;

    console.log("Fetching photos for:", propName);
    const data = {
      textQuery: propName,
    };

    try {
      const resp = await fetchPlacesPhotos(data as PhotoData);
      console.log("Place Photos Response:", resp.data.places[0].photos[3].name);
      const PhotoUrl = PHOTO_REF_URL.replace(
        "NAME",
        resp.data.places[0].photos[3].name
      );
      console.log("Photo URL:", typeof PhotoUrl);
      setPhotoUrl(PhotoUrl);
    } catch (error) {
      console.error("Error fetching place photos:", error);
      setPhotoUrl(null);
    }
  }, [propName]);

  useEffect(() => {
    if (propName) {
      getPlacePhoto();
    }
  }, [propName, getPlacePhoto]);

  return photoUrl;
}
