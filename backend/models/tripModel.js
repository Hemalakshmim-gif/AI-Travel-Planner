import pool from "../config/db.js";

// ======================================
// Helper
// ======================================

const parseJson = (value, fallback = {}) => {
  if (value === null || value === undefined) {
    return fallback;
  }

  if (typeof value === "object") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};


// ======================================
// CREATE TRIP
// ======================================

export const createTrip = async (...args) => {

  // --------------------------------------
  // NEW Planner Agent Call
  // createTrip({ ... })
  // --------------------------------------

  if (
    args.length === 1 &&
    typeof args[0] === "object"
  ) {

    const trip = args[0];

    const {
      userId,
      destination,
      startDate,
      endDate,
      budget,
      travelers,
      interests = [],
      aiScore = 0,
      itinerary = {},
      weather = {},
      budgetBreakdown = {},
      hotels = [],
      restaurants = [],
      places = [],
      packing = [],
    } = trip;


    const [result] = await pool.execute(
      `
      INSERT INTO trips
      (
        user_id,
        destination,
        start_date,
        end_date,
        budget,
        interests,
        travelers,
        ai_score,
        itinerary,
        weather,
        budget_breakdown,
        hotels,
        restaurants,
        places,
        packing
      )
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      `,
      [
        userId,
        destination,
        startDate,
        endDate,
        budget,
        JSON.stringify(interests),
        travelers,
        aiScore,
        JSON.stringify(itinerary),
        JSON.stringify(weather),
        JSON.stringify(budgetBreakdown),
        JSON.stringify(hotels),
        JSON.stringify(restaurants),
        JSON.stringify(places),
        JSON.stringify(packing),
      ]
    );

    return result.insertId;
  }


  // --------------------------------------
  // OLD saveTrip() Call
  // --------------------------------------

  const [
    userId,
    destination,
    startDate,
    endDate,
    travelers,
    budget,
    aiScore,
    itinerary,
  ] = args;


  const [result] = await pool.execute(
    `
    INSERT INTO trips
    (
      user_id,
      destination,
      start_date,
      end_date,
      travelers,
      budget,
      ai_score,
      itinerary
    )
    VALUES (?,?,?,?,?,?,?,?)
    `,
    [
      userId,
      destination,
      startDate,
      endDate,
      travelers,
      budget,
      aiScore,
      JSON.stringify(itinerary),
    ]
  );


  return result.insertId;
};


// ======================================
// GET ALL TRIPS
// ======================================

export const getTrips = async (userId) => {

  const [rows] = await pool.execute(
    `
    SELECT *
    FROM trips
    WHERE user_id = ?
    ORDER BY created_at DESC
    `,
    [userId]
  );


  return rows.map((trip) => ({

    ...trip,

    interests: parseJson(
      trip.interests,
      []
    ),

    itinerary: parseJson(
      trip.itinerary,
      {}
    ),

    weather: parseJson(
      trip.weather,
      {}
    ),

    budget_breakdown: parseJson(
      trip.budget_breakdown,
      {}
    ),

    hotels: parseJson(
      trip.hotels,
      []
    ),

    restaurants: parseJson(
      trip.restaurants,
      []
    ),

    places: parseJson(
      trip.places,
      []
    ),

    packing: parseJson(
      trip.packing,
      []
    ),

  }));
};


// ======================================
// GET SINGLE TRIP
// ======================================

export const getTripById = async (
  tripId,
  userId
) => {

  const [rows] = await pool.execute(
    `
    SELECT *
    FROM trips
    WHERE id = ?
    AND user_id = ?
    `,
    [
      tripId,
      userId
    ]
  );


  if (!rows[0]) {
    return null;
  }


  const trip = rows[0];


  return {

    ...trip,

    interests: parseJson(
      trip.interests,
      []
    ),

    itinerary: parseJson(
      trip.itinerary,
      {}
    ),

    weather: parseJson(
      trip.weather,
      {}
    ),

    budget_breakdown: parseJson(
      trip.budget_breakdown,
      {}
    ),

    hotels: parseJson(
      trip.hotels,
      []
    ),

    restaurants: parseJson(
      trip.restaurants,
      []
    ),

    places: parseJson(
      trip.places,
      []
    ),

    packing: parseJson(
      trip.packing,
      []
    ),

  };
};


// ======================================
// UPDATE TRIP
// ======================================

export const updateTrip = async (
  tripId,
  userId,
  trip
) => {

  const {
    destination,
    startDate,
    endDate,
    travelers,
    budget,
    interests = [],
    aiScore = 0,
    itinerary = {},
    weather = {},
    budgetBreakdown = {},
    hotels = [],
    restaurants = [],
    places = [],
    packing = [],
  } = trip;


  const [result] = await pool.execute(
    `
    UPDATE trips
    SET
      destination = ?,
      start_date = ?,
      end_date = ?,
      budget = ?,
      interests = ?,
      travelers = ?,
      ai_score = ?,
      itinerary = ?,
      weather = ?,
      budget_breakdown = ?,
      hotels = ?,
      restaurants = ?,
      places = ?,
      packing = ?
    WHERE id = ?
    AND user_id = ?
    `,
    [
      destination,
      startDate,
      endDate,
      budget,
      JSON.stringify(interests),
      travelers,
      aiScore,
      JSON.stringify(itinerary),
      JSON.stringify(weather),
      JSON.stringify(budgetBreakdown),
      JSON.stringify(hotels),
      JSON.stringify(restaurants),
      JSON.stringify(places),
      JSON.stringify(packing),
      tripId,
      userId,
    ]
  );


  return result;
};


// ======================================
// DELETE TRIP
// ======================================

export const deleteTrip = async (
  tripId,
  userId
) => {

  await pool.execute(
    `
    DELETE FROM trips
    WHERE id = ?
    AND user_id = ?
    `,
    [
      tripId,
      userId
    ]
  );

};