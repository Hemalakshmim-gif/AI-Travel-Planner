import hotelAgent from "../agents/hotelAgent.js";

// =====================================================
// HOTEL SERVICE
// =====================================================
// Handles hotel data returned by the Hotel Agent.
// Keeps hotel-related logic separate from controllers.
// =====================================================

const hotelService = async (trip) => {
  try {
    console.log("\n==============================");
    console.log("🏨 HOTEL SERVICE");
    console.log("==============================");

    // =================================================
    // VALIDATE TRIP
    // =================================================

    if (!trip || typeof trip !== "object") {
      throw new Error("Trip data is required");
    }

    if (!trip.destination) {
      throw new Error(
        "Destination is required for hotel service"
      );
    }

    console.log(
      "📍 Destination:",
      trip.destination
    );

    // =================================================
    // CALL HOTEL AGENT
    // =================================================

    const hotels = await hotelAgent(trip);

    // =================================================
    // SAFETY CHECK
    // =================================================

    if (!Array.isArray(hotels)) {
      console.warn(
        "⚠️ Hotel Agent did not return an array"
      );

      return [];
    }

    console.log(
      `🏨 Hotel Service received ${hotels.length} hotels`
    );

    // =================================================
    // RETURN REAL HOTEL DATA
    // =================================================

    return hotels;

  } catch (error) {

    console.error(
      "\n❌ HOTEL SERVICE ERROR"
    );

    console.error(
      error.message
    );

    return [];
  }
};

export default hotelService;