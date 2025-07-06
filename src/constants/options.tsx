export const SelectTravelesList = [
  {
    id: 1,
    title: "Just Me",
    desc: "Solo traveler, exploring the world on your own terms.",
    icon: "🧍",
    people: "1 person",
  },
  {
    id: 2,
    title: "A Couple",
    desc: "Perfect for couples or friends sharing unforgettable moments.",
    icon: "👫",
    people: "2 people",
  },
  {
    id: 3,
    title: "Small Family",
    desc: "Ideal for small groups, creating memories together.",
    icon: "👩‍👧‍👧",
    people: "3 - 4 people",
  },
  {
    id: 4,
    title: "Huge Group",
    desc: "Great for families or larger groups, sharing adventures.",
    icon: "👨‍👩‍👧‍👦",
    people: "5+ people",
  },
];

export const SelectBudgetOptions = [
  {
    id: 1,
    title: "Cheap",
    desc: "Affordable options for budget-conscious travelers.",
    icon: "💰",
  },
  {
    id: 2,
    title: "Moderate",
    desc: "Comfortable choices for a balanced travel experience.",
    icon: "💸",
  },
  {
    id: 3,
    title: "Luxury",
    desc: "Premium experiences for those seeking luxury and comfort.",
    icon: "💎",
  },
];

export const AI_PROMPT =
  "Generate a travel itinerary for a trip to {{destination}} for {{days}} days, with a budget of {{budget}}. " +
  "The trip is for {{travelers}}. " +
  "Give me a hotels options list with hotel name, hotel address, price per night, and a short description of the hotel, hotel image url, geo coordinates, rating. " +
  "Suggest itinerary activities for each day, including popular attractions, local cuisine, cultural experiences, sightseeing, and entertainment options. " +
  "Provide a detailed plan with hours for each activity and recommendations for each one, including the name of the place, details of the place, URL of the image of the place, geographical coordinates, rating and ticket price, if available, place for take lunch and dinner and estimated time range for how long it takes to complete that activity. " +
  "Time travel each location and activity, and provide a map link for each day's itinerary. " +
  "IMPORTANT: Return ONLY valid JSON format without any additional text, comments, or markdown formatting. Do not include ```json or ``` tags. Start directly with { and end with }.";
