import plannerAgent from "../agents/plannerAgent.js";

import {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} from "../models/tripModel.js";


// ======================================
// SAVE TRIP
// ======================================

export const saveTrip = async (req, res) => {
  try {

    const {
      destination,
      startDate,
      endDate,
      travelers,
      budget,
      aiScore,
      itinerary,
    } = req.body || {};

    const tripId = await createTrip(
      req.user.id,
      destination,
      startDate,
      endDate,
      travelers,
      budget,
      aiScore,
      itinerary
    );

    res.status(201).json({
      success: true,
      message: "Trip Saved",
      tripId,
    });

  } catch (error) {

    console.error(
      "Save Trip Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};


// ======================================
// GET ALL TRIPS
// ======================================

export const getAllTrips = async (req, res) => {

  try {

    const trips =
      await getTrips(
        req.user.id
      );

    res.status(200).json({
      success: true,
      trips,
    });

  } catch (error) {

    console.error(
      "Get Trips Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};


// ======================================
// GET SINGLE TRIP
// ======================================

export const getSingleTrip = async (
  req,
  res
) => {

  try {

    const trip =
      await getTripById(
        req.params.id,
        req.user.id
      );

    if (!trip) {

      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });

    }

    res.status(200).json({
      success: true,
      trip,
    });

  } catch (error) {

    console.error(
      "Get Single Trip Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};


// ======================================
// UPDATE TRIP
// ======================================

export const updateExistingTrip = async (
  req,
  res
) => {

  try {

    const tripId =
      req.params.id;

    const body =
      req.body || {};

    console.log(
      "\n=============================="
    );

    console.log(
      "✏️ Updating Trip"
    );

    console.log(
      "Trip ID:",
      tripId
    );

    console.log(
      "User ID:",
      req.user.id
    );

    console.log(
      "=============================="
    );


    // ----------------------------------
    // FIND EXISTING TRIP
    // ----------------------------------

    const existingTrip =
      await getTripById(
        tripId,
        req.user.id
      );

    if (!existingTrip) {

      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });

    }


    // ----------------------------------
    // EDITABLE FIELDS
    // ----------------------------------

    const destination =
      body.destination ??
      existingTrip.destination;

    const startDate =
      body.startDate ??
      existingTrip.start_date;

    const endDate =
      body.endDate ??
      existingTrip.end_date;

    const travelers =
      body.travelers ??
      existingTrip.travelers;

    const budget =
      body.budget ??
      existingTrip.budget;

    const interests =
      Array.isArray(body.interests)
        ? body.interests
        : existingTrip.interests || [];


    // ----------------------------------
    // KEEP EXISTING AI DATA
    // ----------------------------------

    const existingAiScore =
      typeof existingTrip.ai_score === "number"
        ? existingTrip.ai_score
        : null;


    await updateTrip(
      tripId,
      req.user.id,
      {

        destination,

        startDate,

        endDate,

        travelers,

        budget,

        interests,

        // Keep the REAL existing score.
        // Do NOT use 98 as fallback.
        aiScore:
          existingAiScore,

        itinerary:
          existingTrip.itinerary || {},

        weather:
          existingTrip.weather || {},

        budgetBreakdown:
          existingTrip.budget_breakdown || {},

        hotels:
          existingTrip.hotels || [],

        restaurants:
          existingTrip.restaurants || [],

        places:
          existingTrip.places || [],

        packing:
          existingTrip.packing || [],

      }
    );


    // ----------------------------------
    // GET UPDATED TRIP
    // ----------------------------------

    const updatedTrip =
      await getTripById(
        tripId,
        req.user.id
      );


    res.status(200).json({

      success: true,

      message:
        "Trip updated successfully",

      trip:
        updatedTrip,

    });

  } catch (error) {

    console.error(
      "\n❌ Update Trip Error:"
    );

    console.error(error);

    res.status(500).json({

      success: false,

      message:
        "Failed to update trip",

    });

  }
};


// ======================================
// AI REGENERATE TRIP
// ======================================

export const regenerateTrip = async (
  req,
  res
) => {

  try {

    const tripId =
      req.params.id;

    const body =
      req.body || {};


    console.log(
      "\n=============================="
    );

    console.log(
      "🤖 AI REGENERATION STARTED"
    );

    console.log(
      "Trip ID:",
      tripId
    );

    console.log(
      "User ID:",
      req.user.id
    );

    console.log(
      "=============================="
    );


    // ----------------------------------
    // FIND EXISTING TRIP
    // ----------------------------------

    const existingTrip =
      await getTripById(
        tripId,
        req.user.id
      );

    if (!existingTrip) {

      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });

    }


    // ----------------------------------
    // BUILD AI INPUT
    // ----------------------------------

    const tripInput = {

      destination:
        body.destination ??
        existingTrip.destination,

      startDate:
        body.startDate ??
        existingTrip.start_date,

      endDate:
        body.endDate ??
        existingTrip.end_date,

      travelers:
        body.travelers ??
        existingTrip.travelers,

      budget:
        body.budget ??
        existingTrip.budget,

      interests:
        Array.isArray(body.interests)
          ? body.interests
          : existingTrip.interests || [],

    };


    console.log(
      "\n📦 AI Trip Input:"
    );

    console.log(
      JSON.stringify(
        tripInput,
        null,
        2
      )
    );


    // ----------------------------------
    // RUN PLANNER AGENT
    // ----------------------------------

    const result =
      await plannerAgent(
        tripInput
      );


    if (!result) {

      throw new Error(
        "Planner Agent returned no result"
      );

    }


    // ----------------------------------
    // GENERATED DATA
    // ----------------------------------

    const itinerary =
      result.itinerary || {};

    const context =
      result.context || {};


    const weather =
      context.weather || {};

    const budgetBreakdown =
      context.budget || {};

    const hotels =
      context.hotels || [];

    const restaurants =
      context.restaurants || [];

    const places =
      context.places || [];

    const packing =
      context.packing || [];


    // ----------------------------------
    // REAL AI SCORE
    // ----------------------------------

    const aiScore =
      typeof itinerary.matchScore ===
      "number"
        ? itinerary.matchScore
        : null;


    console.log(
      "\n🤖 Regenerated AI Score:",
      aiScore
    );


    // ----------------------------------
    // UPDATE SAME TRIP
    // ----------------------------------

    await updateTrip(

      tripId,

      req.user.id,

      {

        destination:
          tripInput.destination,

        startDate:
          tripInput.startDate,

        endDate:
          tripInput.endDate,

        travelers:
          tripInput.travelers,

        budget:
          tripInput.budget,

        interests:
          tripInput.interests,

        // REAL AI SCORE
        aiScore,

        itinerary,

        weather,

        budgetBreakdown,

        hotels,

        restaurants,

        places,

        packing,

      }

    );


    // ----------------------------------
    // GET UPDATED TRIP
    // ----------------------------------

    const updatedTrip =
      await getTripById(
        tripId,
        req.user.id
      );


    if (!updatedTrip) {

      throw new Error(
        "Trip was regenerated but could not be retrieved"
      );

    }


    console.log(
      "\n✅ AI REGENERATION SUCCESSFUL"
    );


    console.log(
      "Updated destination:",
      updatedTrip.destination
    );


    console.log(
      "Updated AI score:",
      updatedTrip.ai_score
    );


    // ----------------------------------
    // RETURN
    // ----------------------------------

    return res.status(200).json({

      success: true,

      message:
        "Trip regenerated successfully",

      trip:
        updatedTrip,

    });

  } catch (error) {

    console.error(
      "\n❌ AI REGENERATION ERROR"
    );

    console.error(
      "Error Name:",
      error.name
    );

    console.error(
      "Error Message:",
      error.message
    );

    console.error(
      error.stack
    );


    return res.status(500).json({

      success: false,

      message:
        "Trip regeneration failed",

      error:
        process.env.NODE_ENV ===
        "development"
          ? error.message
          : undefined,

    });

  }
};


// ======================================
// DELETE TRIP
// ======================================

export const removeTrip = async (
  req,
  res
) => {

  try {

    await deleteTrip(
      req.params.id,
      req.user.id
    );


    res.status(200).json({

      success: true,

      message:
        "Trip Deleted",

    });

  } catch (error) {

    console.error(
      "Delete Trip Error:",
      error
    );


    res.status(500).json({

      success: false,

      message:
        "Server Error",

    });

  }
};