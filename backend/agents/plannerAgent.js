import weatherAgent from "./weatherAgent.js";
import budgetAgent from "./budgetAgent.js";
import hotelAgent from "./hotelAgent.js";
import restaurantAgent from "./restaurantAgent.js";
import placesAgent from "./placesAgent.js";
import packingAgent from "./packingAgent.js";

import ai from "../services/geminiService.js";
import itineraryPrompt from "../prompts/itineraryPrompt.js";

const plannerAgent = async (trip) => {

  console.log("\n==============================");
  console.log("🚀 PLANNER AGENT STARTED");
  console.log("==============================");

  console.log("📦 Incoming Trip:");
  console.log(
    JSON.stringify(trip, null, 2)
  );

  // ==========================================
  // INTERESTS SAFETY
  // ==========================================

  if (!Array.isArray(trip.interests)) {
    trip.interests = [];
  }

  // ==========================================
  // DEFAULT VALUES
  // ==========================================

  let weather = {};
  let budget = {};
  let hotels = [];
  let restaurants = [];
  let places = [];
  let packing = [];

  // ==========================================
  // WEATHER AGENT
  // ==========================================

  try {

    weather =
      await weatherAgent(trip);

  } catch (error) {

    console.error(
      "❌ Weather Agent Failed:",
      error.message
    );

    weather = {};
  }

  // ==========================================
  // BUDGET AGENT
  // ==========================================

  try {

    budget =
      await budgetAgent(trip);

  } catch (error) {

    console.error(
      "❌ Budget Agent Failed:",
      error.message
    );

    budget = {};
  }

  // ==========================================
  // HOTEL AGENT
  // ==========================================

  try {

    hotels =
      await hotelAgent(trip);

  } catch (error) {

    console.error(
      "❌ Hotel Agent Failed:",
      error.message
    );

    hotels = [];
  }

  // ==========================================
  // RESTAURANT AGENT
  // ==========================================

  try {

    restaurants =
      await restaurantAgent(trip);

  } catch (error) {

    console.error(
      "❌ Restaurant Agent Failed:",
      error.message
    );

    restaurants = [];
  }

  // ==========================================
  // PLACES AGENT
  // ==========================================

  try {

    places =
      await placesAgent(trip);

  } catch (error) {

    console.error(
      "❌ Places Agent Failed:",
      error.message
    );

    places = [];
  }

  // ==========================================
  // PACKING AGENT
  // ==========================================

  try {

    packing =
      await packingAgent(trip);

  } catch (error) {

    console.error(
      "❌ Packing Agent Failed:",
      error.message
    );

    packing = [];
  }

  // ==========================================
  // NORMALIZE RESULTS
  // ==========================================

  if (!Array.isArray(hotels)) {
    hotels = [];
  }

  if (!Array.isArray(restaurants)) {
    restaurants = [];
  }

  if (!Array.isArray(places)) {
    places = [];
  }

  if (!Array.isArray(packing)) {
    packing = [];
  }

  // ==========================================
  // LOG REAL AGENT DATA
  // ==========================================

  console.log("\n==============================");
  console.log("📊 REAL AGENT RESULTS");
  console.log("==============================");

  console.log(
    "🏨 Hotels:",
    hotels.length
  );

  console.log(
    "🍽️ Restaurants:",
    restaurants.length
  );

  console.log(
    "📍 Places:",
    places.length
  );

  console.log(
    "🎒 Packing:",
    packing.length
  );

  // ==========================================
  // COMBINED CONTEXT
  // ==========================================

  const context = {

    weather,

    budget,

    hotels,

    restaurants,

    places,

    packing,

  };

  console.log(
    "\n📦 Context Generated"
  );

  // ==========================================
  // CREATE GEMINI PROMPT
  // ==========================================

  const prompt =
    itineraryPrompt(
      trip,
      context
    );

  console.log(
    "\n📜 Prompt Length:",
    prompt.length
  );

  // ==========================================
  // GEMINI
  // ==========================================

  try {

    console.log(
      "Using Model:",
      process.env.GEMINI_MODEL
    );

    const response =
      await ai.models.generateContent({

        model:
          process.env.GEMINI_MODEL,

        contents:
          prompt,

      });

    console.log(
      "\n✅ Gemini Response Received"
    );

    // ========================================
    // GET AI TEXT
    // ========================================

    let aiText = "";

    if (
      typeof response.text ===
      "function"
    ) {

      aiText =
        response.text();

    } else {

      aiText =
        response.text || "";

    }

    // ========================================
    // CLEAN RESPONSE
    // ========================================

    aiText =
      aiText
        .replace(
          /```json/g,
          ""
        )
        .replace(
          /```/g,
          ""
        )
        .trim();

    // ========================================
    // PARSE JSON
    // ========================================

    let itinerary;

    try {

      itinerary =
        JSON.parse(aiText);

    } catch (parseError) {

      console.error(
        "\n❌ Gemini JSON Parse Failed"
      );

      console.error(
        parseError.message
      );

      console.error(
        "Gemini Output:",
        aiText
      );

      throw new Error(
        "Gemini returned invalid JSON"
      );
    }

    // ========================================
    // SAFETY
    // ========================================

    if (
      !itinerary ||
      typeof itinerary !== "object"
    ) {

      itinerary = {};

    }

    // ========================================
    // MATCH SCORE
    // ========================================

    if (
      typeof itinerary.matchScore ===
      "number"
    ) {

      itinerary.matchScore =
        Math.max(
          0,
          Math.min(
            100,
            Math.round(
              itinerary.matchScore
            )
          )
        );

    } else {

      itinerary.matchScore = null;

    }

    // ========================================
    // AI INSIGHTS
    // ========================================

    if (
      !Array.isArray(
        itinerary.aiInsights
      )
    ) {

      itinerary.aiInsights = [];

    }

    // ========================================
    // DAILY PLAN
    // ========================================

    if (
      !Array.isArray(
        itinerary.dailyPlan
      )
    ) {

      itinerary.dailyPlan = [];

    }

    // ========================================
    // IMPORTANT
    // PRESERVE REAL AGENT DATA
    // ========================================

    itinerary.hotels =
      hotels;

    itinerary.restaurants =
      restaurants;

    itinerary.places =
      places;

    itinerary.packingList =
      packing;

    // ========================================
    // ALSO KEEP REAL CONTEXT
    // ========================================

    itinerary.weather =
      weather;

    itinerary.budget =
      budget;

    // ========================================
    // FINAL LOG
    // ========================================

    console.log(
      "\n=============================="
    );

    console.log(
      "🤖 AI MATCH SCORE:",
      itinerary.matchScore
    );

    console.log(
      "🧠 AI INSIGHTS:",
      itinerary.aiInsights.length
    );

    console.log(
      "🏨 FINAL HOTELS:",
      itinerary.hotels.length
    );

    console.log(
      "🍽️ FINAL RESTAURANTS:",
      itinerary.restaurants.length
    );

    console.log(
      "📍 FINAL PLACES:",
      itinerary.places.length
    );

    console.log(
      "🎒 FINAL PACKING:",
      itinerary.packingList.length
    );

    console.log(
      "=============================="
    );

    // ========================================
    // RETURN
    // ========================================

    return {

      itinerary,

      context,

    };

  } catch (error) {

    console.error(
      "\n=============================="
    );

    console.error(
      "❌ PLANNER AGENT ERROR"
    );

    console.error(
      "=============================="
    );

    console.error(
      "Status:",
      error.status
    );

    console.error(
      "Message:",
      error.message
    );

    throw error;

  }

};

export default plannerAgent;