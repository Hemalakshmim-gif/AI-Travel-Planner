import { getTrips } from "../models/tripModel.js";

export const getUserTrips = async (userId) => {

  const trips = await getTrips(userId);

  return trips.map((trip) => ({

    ...trip,

    interests: trip.interests
      ? JSON.parse(trip.interests)
      : [],

    itinerary: trip.itinerary
      ? JSON.parse(trip.itinerary)
      : {},

    weather: trip.weather
      ? JSON.parse(trip.weather)
      : {},

    budget_breakdown: trip.budget_breakdown
      ? JSON.parse(trip.budget_breakdown)
      : {},

    hotels: trip.hotels
      ? JSON.parse(trip.hotels)
      : [],

    restaurants: trip.restaurants
      ? JSON.parse(trip.restaurants)
      : [],

    places: trip.places
      ? JSON.parse(trip.places)
      : [],

    packing: trip.packing
      ? JSON.parse(trip.packing)
      : []

  }));

};