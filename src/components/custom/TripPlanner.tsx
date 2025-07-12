import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";

import { db } from "@/service/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import PlaceAutocomplete from "./PlaceAutocomplete";

import { PiSpinnerBold } from "react-icons/pi";

import {
  AI_PROMPT,
  SelectBudgetOptions,
  SelectTravelesList,
} from "../../lib/options";
import { chatSession } from "@/service/AIModel";

const TripPlanner: React.FC = () => {
  const [formData, setFormData] = useState<{
    destination?: string;
    days?: string;
    budget?: string;
    travelers?: string;
  }>({});

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleInputChange = (name: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validation = () => {
    // Perform validation on formData
    if (!formData.destination) {
      toast.error("Please select a destination.");
      return false;
    }
    if (
      !formData.days ||
      isNaN(Number(formData.days)) ||
      Number(formData.days) <= 0
    ) {
      toast.error("Please enter a valid number of days.");
      return false;
    }
    if (!formData.budget) {
      toast.error("Please select a budget option.");
      return false;
    }
    if (!formData.travelers) {
      toast.error("Please select the number of travelers.");
      return false;
    }
    return true;
  };

  // Function to extract and clean JSON from AI response
  // Validate that the parsed JSON has the expected structure
  const validateTripData = (data: unknown): boolean => {
    if (!data || typeof data !== "object") return false;

    const tripData = data as Record<string, unknown>;
    if (!tripData.trip || typeof tripData.trip !== "object") return false;

    const trip = tripData.trip as Record<string, unknown>;

    // Check required fields
    if (
      !trip.destination ||
      !trip.duration ||
      !trip.budget ||
      !trip.travelers
    ) {
      return false;
    }

    // Check that hotels is an array
    if (!Array.isArray(trip.hotels)) return false;

    // Check that itinerary is an array
    if (!Array.isArray(trip.itinerary)) return false;

    // Check that we have the right number of days
    const expectedDays = parseInt(formData.days || "1");
    if (trip.itinerary.length !== expectedDays) {
      console.warn(
        `Expected ${expectedDays} days, got ${trip.itinerary.length} days in itinerary`
      );
    }

    return true;
  };

  const extractAndCleanJSON = (text: string): Record<string, unknown> => {
    try {
      // Try parsing directly first
      return JSON.parse(text);
    } catch (error) {
      console.log("Direct JSON parse failed, attempting to clean response...");

      // Remove markdown code blocks if present
      let cleanedText = text.replace(/```json\s*/g, "").replace(/```\s*/g, "");

      // Find JSON object boundaries
      const jsonStart = cleanedText.indexOf("{");
      const jsonEnd = cleanedText.lastIndexOf("}") + 1;

      if (jsonStart !== -1 && jsonEnd > jsonStart) {
        cleanedText = cleanedText.substring(jsonStart, jsonEnd);

        try {
          return JSON.parse(cleanedText);
        } catch (innerError) {
          console.log(
            "Cleaned JSON parse failed, attempting fixes...",
            innerError
          );

          // Common fixes for malformed JSON
          cleanedText = cleanedText
            // Fix trailing commas
            .replace(/,(\s*[}\]])/g, "$1")
            // Fix unescaped quotes in strings
            .replace(/([^\\])"/g, '$1\\"')
            // Fix missing quotes around property names
            .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
            // Fix single quotes to double quotes
            .replace(/'/g, '"');

          try {
            return JSON.parse(cleanedText);
          } catch (finalError) {
            console.error("Final parse attempt failed:", finalError);
            throw new Error(
              `Unable to parse JSON after cleaning attempts. Original error: ${error}`
            );
          }
        }
      } else {
        throw new Error("No valid JSON object found in response");
      }
    }
  };

  // Function to save AI-generated trip data to Firestore
  // This function will be called after the AI response is received
  const SaveAITrip = async (tripData: Record<string, unknown>) => {
    setLoading(true);
    const userString = localStorage.getItem("user");
    if (!userString) {
      console.error("No user data found in localStorage.");
      return;
    }
    const user = JSON.parse(userString);
    const docId = Date.now().toString(); // Generate a unique ID for the document
    const AIresponse = tripData; // Parse the trip data to ensure it's in JSON format
    await setDoc(doc(db, "AITrips", docId), {
      userSelection: formData,
      tripData: AIresponse,
      userName: user.name,
      userEmail: user.email,
      id: docId,
    });
    setLoading(false);
    navigate("/view-trip/" + docId); // Navigate to the view trip page with the document ID
  };

  // Function to generate the trip based on formData
  // This function will be called when the user clicks the "Start Planning Trip" button
  // It validates the form data, constructs the AI prompt, and calls the AI model to generate the trip
  // If the user is not logged in, it opens a dialog to prompt for Google login
  // If the user is logged in, it proceeds to generate the trip
  // and saves the AI-generated trip data to Firestore
  // It also handles any errors that may occur during the process
  // and displays appropriate messages to the user
  const OnGenerateTrip = async () => {
    // Logic to generate trip based on formData

    if (!validation()) {
      return;
    }

    const maxRetries = 3;
    let currentAttempt = 0;

    const generateTripWithRetry = async (): Promise<void> => {
      currentAttempt++;
      setLoading(true);

      const FINAL_AI_PROMPT = AI_PROMPT.replace(
        "{{destination}}",
        formData?.destination || ""
      )
        .replace(/{{days}}/g, formData?.days || "") // Replace all occurrences
        .replace("{{budget}}", formData?.budget || "")
        .replace("{{travelers}}", formData?.travelers || "");

      console.log(
        `Final AI Prompt (attempt ${currentAttempt}):`,
        FINAL_AI_PROMPT
      );

      try {
        const model = chatSession();
        const result = await model.generateContent(FINAL_AI_PROMPT);
        const response = await result.response;
        const text = response.text();
        console.log(`AI Response (attempt ${currentAttempt}):`, text);

        // Parse JSON response and save it to Firestore
        if (!text) {
          throw new Error("Empty response from AI model");
        }

        console.log("Raw AI Response:", text);

        // Use the improved JSON extraction function
        const tripData = extractAndCleanJSON(text);

        console.log("Successfully parsed trip data:", tripData);

        // Validate that we have a proper trip structure
        if (!validateTripData(tripData)) {
          throw new Error(
            "Invalid trip data structure - missing required fields or incorrect format"
          );
        }

        console.log("Trip data validation passed");
        setLoading(false);

        // Save AI trip data to Firestore
        SaveAITrip(tripData);
      } catch (parseError) {
        console.error(
          `Trip generation attempt ${currentAttempt} failed:`,
          parseError
        );
        setLoading(false);

        if (currentAttempt < maxRetries) {
          console.log(`Retrying... (${currentAttempt}/${maxRetries})`);
          toast.error(
            `Generation failed, retrying... (${currentAttempt}/${maxRetries})`
          );
          // Wait a moment before retrying
          await new Promise((resolve) => setTimeout(resolve, 2000));
          return generateTripWithRetry();
        } else {
          console.error("Max retries reached. Trip generation failed.");
          const errorMessage =
            parseError instanceof Error
              ? parseError.message
              : String(parseError);
          toast.error(
            `Failed to generate trip after ${maxRetries} attempts: ${errorMessage}`
          );

          // Save debug data for analysis
          try {
            await SaveAITrip({
              error: "JSON_PARSE_ERROR_AFTER_RETRIES",
              attempts: maxRetries,
              lastError: errorMessage,
              timestamp: new Date().toISOString(),
              formData: formData,
            });
          } catch (saveError) {
            console.error("Failed to save debug data:", saveError);
          }
        }
      }
    };

    await generateTripWithRetry();
  };

  useEffect(() => {
    console.log("Form data updated:", formData);
  }, [formData]);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Plan Your Trip</h2>

      {/* Destination Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Where do you want to go?
        </label>
        <PlaceAutocomplete
          placeholder="Search for a destination..."
          className="w-full"
          handleInputChange={handleInputChange}
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {" "}
          How many days are you planning your trip?{" "}
        </label>
        <Input
          placeholder="Ex.3"
          type="number"
          onChange={(e) => handleInputChange("days", e.target.value)}
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {" "}
          What is your Budget?{" "}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          {SelectBudgetOptions.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("budget", item.title)}
              className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${
                formData?.budget === item.title
                  ? "bg-blue-100 border-blue-500"
                  : ""
              }`}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="font-bold text-lg">{item.title}</h2>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {" "}
          Who do you plan on traveling with on your next adventure?{" "}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
          {SelectTravelesList.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("travelers", item.people)}
              className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${
                formData?.travelers === item.people
                  ? "bg-blue-100 border-blue-500"
                  : ""
              }`}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="font-bold text-lg">{item.title}</h2>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={OnGenerateTrip}
          className="start-trip-button"
          disabled={loading}
        >
          {loading ? (
            <PiSpinnerBold className="h-7 w-7 animate-spin" />
          ) : (
            "Start Planning Trip"
          )}
        </Button>
      </div>
    </div>
  );
};

export default TripPlanner;
