import plannerAgent from "../agents/plannerAgent.js";
import tripService from "../services/tripService.js";

export const generateTrip = async (
  req,
  res
) => {

  try {

    console.log(
      "\n=============================="
    );

    console.log(
      "🚀 GENERATE TRIP REQUEST"
    );

    console.log(
      "=============================="
    );

    // ========================================
    // RUN PLANNER
    // ========================================

    const result =
      await plannerAgent(
        req.body
      );

    const {
      itinerary,
      context,
    } = result;

    // ========================================
    // LOG FINAL DATA
    // ========================================

    console.log(
      "\n=============================="
    );

    console.log(
      "📊 FINAL PLANNER DATA"
    );

    console.log(
      "=============================="
    );

    console.log(
      "🏨 Hotels:",
      context?.hotels?.length || 0
    );

    console.log(
      "🍽️ Restaurants:",
      context?.restaurants?.length || 0
    );

    console.log(
      "📍 Places:",
      context?.places?.length || 0
    );

    console.log(
      "🎒 Packing:",
      context?.packing?.length || 0
    );

    console.log(
      "💯 AI Score:",
      itinerary?.matchScore
    );

    // ========================================
    // SAVE TRIP
    // ========================================

    const tripId =
      await tripService(

        req.user.id,

        req.body,

        itinerary,

        context

      );

    // ========================================
    // RESPONSE
    // ========================================

    res.status(200).json({

      success: true,

      trip: {

        id:
          tripId,

        destination:
          req.body.destination,

        startDate:
          req.body.startDate,

        endDate:
          req.body.endDate,

        travelers:
          req.body.travelers,

        budget:
          req.body.budget,

        interests:
          req.body.interests || [],

        // REAL AI SCORE
        aiScore:
          itinerary?.matchScore ?? null,

        // REAL WEATHER
        weather:
          context?.weather || {},

        // REAL BUDGET
        budgetBreakdown:
          context?.budget || {},

        // REAL HOTEL DATA
        hotels:
          context?.hotels || [],

        // REAL RESTAURANT DATA
        restaurants:
          context?.restaurants || [],

        // REAL PLACE DATA
        places:
          context?.places || [],

        // REAL PACKING DATA
        packing:
          context?.packing || [],

        // AI ITINERARY
        itinerary,

      },

    });

  } catch (error) {

    console.error(
      "\n=============================="
    );

    console.error(
      "❌ PLANNER CONTROLLER ERROR"
    );

    console.error(
      "=============================="
    );

    console.error(
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Trip generation failed",

      error:
        process.env.NODE_ENV ===
        "development"
          ? error.message
          : undefined,

    });

  }
};