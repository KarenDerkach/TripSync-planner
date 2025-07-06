import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import PlaceAutocomplete from "./PlaceAutocomplete";
import { Input } from "../ui/input";
import {
  SelectBudgetOptions,
  SelectTravelesList,
} from "../../constants/options";
import { toast } from "sonner";
import { AI_PROMPT } from "../../constants/options";
import { chatSession } from "@/service/AIModel";

import { useGoogleLogin } from "@react-oauth/google";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { PiSpinnerBold } from "react-icons/pi";
import GoogleModal from "./GoogleModal";

import { useNavigate } from "react-router";

const TripPlanner: React.FC = () => {
  const [formData, setFormData] = useState<{
    destination?: string;
    days?: string;
    budget?: string;
    travelers?: string;
  }>({});

  const navigate = useNavigate();

  const [openDialog, setOpenDialog] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleInputChange = (name: string, value: string) => {
    // Handle input changes here, e.g., update formData state
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

  // Google OAuth login setup
  // This will handle the Google login process
  // and retrieve the user's profile information
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log("Login successful:", tokenResponse);
      GetUserProfile(tokenResponse);

      toast.success("Logged in successfully!");
    },
    onError: (error) => {
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again.");
    },
  });

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
      userName: user.name, // Store the user's name
      userEmail: user.email, // Store the user's email
      id: docId, // Store the document ID
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

    //Validate if user is logged in
    const user = localStorage.getItem("user");
    if (!user) {
      setOpenDialog(true);
      return;
    }
    if (!validation()) {
      return;
    }

    const FINAL_AI_PROMPT = AI_PROMPT.replace(
      "{{destination}}",
      formData?.destination || ""
    )
      .replace("{{days}}", formData?.days || "")
      .replace("{{budget}}", formData?.budget || "")
      .replace("{{travelers}}", formData?.travelers || "");

    console.log("Final AI Prompt:", FINAL_AI_PROMPT);
    setLoading(true);
    // Call the AI model to generate the trip
    try {
      const model = chatSession();
      const result = await model.generateContent(FINAL_AI_PROMPT);
      const response = await result.response;
      const text = response.text();
      console.log("AI Response:", text);
      setLoading(false);
      // Save AI trip data to Firestore

      // Parse JSON response and save it to Firestore
      if (!text) {
        console.error("Empty response from AI model.");
        toast.error("No trip data generated. Please try again.");
        return;
      }
      try {
        // Clean the response text to extract only the JSON part
        const cleanedText = extractJsonFromResponse(text);

        console.log("Cleaned AI Response:", cleanedText);

        const tripData = JSON.parse(cleanedText);
        console.log("Parsed trip data:", tripData);
        SaveAITrip(tripData);
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        console.error("Raw AI Response:", text);
        toast.error(
          "Error parsing trip data. The AI response may be malformed. Please try again."
        );

        // Try to save the raw response for debugging
        console.log("Attempting to save raw response for debugging...");
        try {
          SaveAITrip({
            error: "JSON_PARSE_ERROR",
            rawResponse: text,
            parseError:
              parseError instanceof Error
                ? parseError.message
                : String(parseError),
          });
        } catch (saveError) {
          console.error("Failed to save debug data:", saveError);
        }
      }
    } catch (error) {
      console.error("Error generating trip:", error);
      toast.error("Error generating trip. Please try again.");
    }
  };

  const GetUserProfile = (tokenInfo: { access_token?: string }) => {
    fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?acess_token=${tokenInfo?.access_token}`,
      {
        headers: {
          Authorization: `Bearer ${tokenInfo?.access_token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("User profile data:", data);
        // If everything is ok, generate trip
        OnGenerateTrip();
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(data));
        setOpenDialog(false);
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
        toast.error("Error fetching user profile. Please try again.");
      });
  };

  // Helper function to clean and extract JSON from AI response
  const extractJsonFromResponse = (text: string): string => {
    // Remove any markdown code blocks
    let cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "");

    // Remove any text before the first '{'
    const firstBrace = cleaned.indexOf("{");
    if (firstBrace !== -1) {
      cleaned = cleaned.substring(firstBrace);
    }

    // Remove any text after the last '}'
    const lastBrace = cleaned.lastIndexOf("}");
    if (lastBrace !== -1) {
      cleaned = cleaned.substring(0, lastBrace + 1);
    }

    // Fix common JSON issues
    cleaned = cleaned
      // Remove trailing commas before closing brackets/braces
      .replace(/,(\s*[}\]])/g, "$1")
      // Remove any control characters that might cause issues
      .replace(/[\n\r\t]/g, " ")
      .replace(/\s+/g, " ");

    return cleaned;
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
        <div className="grid grid-cols-3 gap-4 mt-5">
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
        <div className="grid grid-cols-2 gap-4 mt-5">
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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={loading}
        >
          {loading ? (
            <PiSpinnerBold className="h-7 w-7 animate-spin" />
          ) : (
            "Start Planning Trip"
          )}
        </Button>

        <Button
          variant="outline"
          className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Save for Later
        </Button>
      </div>

      {/* Google Login Dialog */}
      <GoogleModal
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        login={login}
      />
    </div>
  );
};

export default TripPlanner;
