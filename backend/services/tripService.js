import { createTrip } from "../models/tripModel.js";

const tripService = async (
  userId,
  trip,
  itinerary,
  context
) => {

  // ==========================================
  // REAL AI MATCH SCORE
  // ==========================================

  const aiScore =
    typeof itinerary?.matchScore ===
    "number"
      ? itinerary.matchScore
      : null;

  console.log(
    "\n💯 Saving AI Match Score:",
    aiScore
  );

  // ==========================================
  // REAL AGENT DATA
  // ==========================================

  const hotels =
    Array.isArray(context?.hotels)
      ? context.hotels
      : [];

  const restaurants =
    Array.isArray(context?.restaurants)
      ? context.restaurants
      : [];

  const places =
    Array.isArray(context?.places)
      ? context.places
      : [];

  const packing =
    Array.isArray(context?.packing)
      ? context.packing
      : [];

  // ==========================================
  // LOG
  // ==========================================

  console.log(
    "🏨 Saving Hotels:",
    hotels.length
  );

  console.log(
    "🍽️ Saving Restaurants:",
    restaurants.length
  );

  console.log(
    "📍 Saving Places:",
    places.length
  );

  console.log(
    "🎒 Saving Packing:",
    packing.length
  );

  // ==========================================
  // CREATE TRIP
  // ==========================================

  const tripId =
    await createTrip({

      userId,

      destination:
        trip.destination,

      startDate:
        trip.startDate,

      endDate:
        trip.endDate,

      budget:
        trip.budget,

      travelers:
        trip.travelers,

      interests:
        Array.isArray(
          trip.interests
        )
          ? trip.interests
          : [],

      // REAL AI SCORE
      aiScore,

      // AI GENERATED ITINERARY
      itinerary,

      // REAL WEATHER
      weather:
        context?.weather || {},

      // REAL BUDGET
      budgetBreakdown:
        context?.budget || {},

      // REAL HOTEL AGENT DATA
      hotels,

      // REAL RESTAURANT AGENT DATA
      restaurants,

      // REAL PLACES AGENT DATA
      places,

      // REAL PACKING AGENT DATA
      packing,

    });

  console.log(
    "\n✅ Trip Saved Successfully"
  );

  console.log(
    "🆔 Trip ID:",
    tripId
  );

  return tripId;
};

export default tripService;