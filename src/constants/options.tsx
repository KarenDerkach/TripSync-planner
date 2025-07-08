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

export const AI_PROMPT = `You are a travel assistant. Generate a complete travel itinerary in VALID JSON format only, with a fixed structure as described below. 

Input parameters:
- Destination: {{destination}}
- Duration: {{days}} days
- Budget: {{budget}} 
- Number of travelers: {{travelers}}

🛑 Output rules:
- The response must include exactly {{days}} entries in the "itinerary" array — one per day.
- The hotel recommendations must be suitable for the provided budget, duration, and number of travelers.
- Avoid luxury hotels if the budget is low; suggest mid-range or budget hotels when appropriate.
- Price per night should be realistic and aligned with destination and budget.
- All prices should be in EUR.
- Return ONLY the following JSON structure — DO NOT change property names or structure:

{
  "trip": {
    "budget": "string",
    "destination": "string",
    "duration": "string",
    "travelers": "string",
    "hotels": [
      {
        "name": "string",
        "description": "string",
        "imageUrl": "string",
        "pricePerNight": "string",
        "rating": number,
        "address": "string",
        "geoCoordinates": {
          "lat": number,
          "lng": number
        }
      }
    ],
    "itinerary": [
      {
        "day": "Day X",
        "activities": [
          {
            "placeName": "string",
            "details": "string",
            "imageUrl": "string",
            "rating": number,
            "ticketPrice": "string or null",
            "duration": "e.g. 1-2 hours",
            "time": "e.g. 09:00",
            "mapLink": "string (Google Maps URL)",
            "geoCoordinates": {
              "lat": number,
              "lng": number
            },
            "mealRecommendation": {
              "lunch": {
                "name": "string",
                "address": "string",
                "imageUrl": "string",
                "priceRange": "string"
              },
              "dinner": {
                "name": "string",
                "address": "string",
                "imageUrl": "string",
                "priceRange": "string"
              }
            }
          }
        ]
      }
    ]
  }
}

🔁 Repeat this structure inside the "itinerary" array for EACH DAY of the trip — do not omit any day.

📝 Notes:
- Use realistic and popular options for hotels and activities.
- Include valid image URLs and Google Maps links.
- Set "null" for ticketPrice if unknown.
- Return ONLY the JSON object, no extra explanation or markdown.`;
