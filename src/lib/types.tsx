export interface Root {
  trip: Trip;
}

export interface AIresponse {
  tripData: AITrip;
  id: string;
  userEmail: string;
  userName: string;
  userSelection: UserSelection;
}
export interface UserSelection {
  destination: string;
  days: string;
  budget: string;
  travelers: string;
}
export interface AITrip {
  trip: Trip;
}
export interface Trip {
  budget: string;
  destination: string;
  duration: string;
  travelers: string;
  hotels: Hotel[];
  itinerary: Itinerary[];
}

export interface Hotel {
  name: string;
  description: string;
  imageUrl: string;
  pricePerNight: string;
  rating: number;
  address: string;
  geoCoordinates: GeoCoordinates;
}

export interface GeoCoordinates {
  lat: number;
  lng: number;
}

export interface Itinerary {
  day: string;
  activities: Activity[];
}

export interface Activity {
  placeName: string;
  details: string;
  imageUrl: string;
  rating: number;
  ticketPrice: string;
  duration: string;
  time: string;
  mapLink: string;
  geoCoordinates: GeoCoordinates2;
  mealRecommendation: MealRecommendation;
}

export interface GeoCoordinates2 {
  lat: number;
  lng: number;
}

export interface MealRecommendation {
  lunch: Lunch;
  dinner: Dinner;
}

export interface Lunch {
  name: string;
  address: string;
  imageUrl: string;
  priceRange: string;
}

export interface Dinner {
  name: string;
  address: string;
  imageUrl: string;
  priceRange: string;
}
