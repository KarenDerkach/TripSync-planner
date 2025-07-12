import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

export const chatSession = () => {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.2, // Lower temperature for more consistent JSON output
      topP: 0.8,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    },
    systemInstruction:
      "You are a JSON-only API. Return valid JSON with no additional text, formatting, or explanations.",
  });

  return model;
};
