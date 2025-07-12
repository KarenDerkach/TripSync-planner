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

export const AI_PROMPT = `Generate ONLY a valid JSON object for a travel itinerary. No explanations, no markdown formatting, no code blocks, just pure JSON.

Input parameters:
- Destination: {{destination}}
- Duration: {{days}} days
- Budget: {{budget}} 
- Number of travelers: {{travelers}}

CRITICAL REQUIREMENTS:
- Return ONLY valid JSON - no other text before or after
- Include exactly {{days}} entries in the "itinerary" array
- All string values must be properly escaped
- No trailing commas
- All URLs must be valid strings
- Numbers should be numeric values, not strings
- Give almost 3 Hotel recommendations suitable for budget and travelers
- Give almost 3 activity recommendations per day
- Prices in EUR format

EXACT JSON STRUCTURE TO FOLLOW:

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

EXAMPLES OF PROPER JSON VALUES:
- String: "Hotel Barcelona Center"
- Number: 4.5 (not "4.5")
- Price: "€120 per night"
- URL: "https://example.com/image.jpg"
- Coordinates: {"lat": 41.3851, "lng": 2.1734}

Remember: Return ONLY the JSON object above, nothing else.`;
