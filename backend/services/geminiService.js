import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const MODELS = [
  "models/gemini-flash-latest",
  "models/gemini-3.5-flash",
  "models/gemini-2.0-flash",
];

export default ai;