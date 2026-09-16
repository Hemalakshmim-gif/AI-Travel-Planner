import placesAgent from "../agents/placesAgent.js";

// =====================================================
// PLACE SERVICE
// =====================================================
// Handles place data returned by the Places Agent.
// Keeps place-related logic separate from controllers.
// =====================================================

const placeService = async (trip) => {
  try {
    console.log("\n==============================");
    console.log("📍 PLACE SERVICE");
    console.log("==============================");

    // =================================================
    // VALIDATE TRIP
    // =================================================

    if (!trip || typeof trip !== "object") {
      throw new Error("Trip data is required");
    }

    if (!trip.destination) {
      throw new Error(
        "Destination is required for place service"
      );
    }

    console.log(
      "📍 Destination:",
      trip.destination
    );

    // =================================================
    // CALL PLACES AGENT
    // =================================================

    const places = await placesAgent(trip);

    // =================================================
    // SAFETY CHECK
    // =================================================

    if (!Array.isArray(places)) {
      console.warn(
        "⚠️ Places Agent did not return an array"
      );

      return [];
    }

    console.log(
      `📍 Place Service received ${places.length} places`
    );

    // =================================================
    // RETURN REAL PLACE DATA
    // =================================================

    return places;

  } catch (error) {

    console.error(
      "\n❌ PLACE SERVICE ERROR"
    );

    console.error(
      error.message
    );

    return [];
  }
};

export default placeService;