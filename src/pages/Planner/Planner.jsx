import "./Planner.css";

import { useRef, useState } from "react";

import PlannerForm from "../../components/PlannerForm/PlannerForm";
import AIThinking from "../../components/AIThinking/AIThinking";

import WeatherCard from "../../components/dashboard/Weather/WeatherCard";
import HotelCard from "../../components/dashboard/Hotels/HotelCard";
import RestaurantCard from "../../components/dashboard/Restaurants/RestaurantCard";
import BudgetCard from "../../components/dashboard/Budget/BudgetCard";

import Transportation from "../../components/dashboard/Transportation/Transportation";

import Packing from "../../components/dashboard/Packing/Packing";
import Timeline from "../../components/dashboard/Timeline/Timeline";
import TravelTips from "../../components/dashboard/TravelTips/TravelTips";

import { generateTrip } from "../../services/plannerService";

function Planner() {

  const [loading, setLoading] =
    useState(false);

  const [generated, setGenerated] =
    useState(false);

  const [trip, setTrip] =
    useState(null);

  const [errorMessage, setErrorMessage] =
    useState("");

  const resultRef =
    useRef(null);


  // ==========================================
  // GENERATE TRIP
  // ==========================================

  const handleGenerate = async (tripData) => {

    try {

      // Reset previous state

      setGenerated(false);

      setErrorMessage("");

      setLoading(true);


      // ========================================
      // CALL BACKEND
      // ========================================

      const { data } =
        await generateTrip(tripData);


      console.log(
        "Generated Trip:",
        data
      );


      // ========================================
      // VALIDATE RESPONSE
      // ========================================

      if (
        !data.success ||
        !data.trip
      ) {

        throw new Error(
          data.message ||
          "Trip generation failed."
        );

      }


      const generatedTrip =
        data.trip;


      // ========================================
      // SET TRIP
      // ========================================

      setTrip(
        generatedTrip
      );


      // ========================================
      // SAVE CURRENT TRIP
      // ========================================

      localStorage.setItem(
        "currentTrip",
        JSON.stringify(
          generatedTrip
        )
      );


      // ========================================
      // SAVE TRIP FOR HISTORY
      // ========================================

      const existingTrips =
        JSON.parse(
          localStorage.getItem(
            "savedTrips"
          ) || "[]"
        );


      // Prevent duplicate trip IDs

      const filteredTrips =
        existingTrips.filter(
          (item) =>
            item.id !==
            generatedTrip.id
        );


      const updatedTrips = [
        generatedTrip,
        ...filteredTrips,
      ];


      localStorage.setItem(
        "savedTrips",
        JSON.stringify(
          updatedTrips
        )
      );


      console.log(
        "Saved Trips:",
        updatedTrips
      );


      // ========================================
      // SUCCESS
      // ========================================

      setGenerated(true);


      // ========================================
      // SCROLL TO RESULT
      // ========================================

      setTimeout(() => {

        resultRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

      }, 300);


    } catch (error) {

      console.error(
        "Planner Error:",
        error
      );


      // ========================================
      // ERROR MESSAGE
      // ========================================

      let message =
        "Something went wrong while generating your trip.";


      // Backend responded

      if (error.response) {

        console.log(
          "Response Data:",
          error.response.data
        );

        console.log(
          "Status:",
          error.response.status
        );


        message =
          error.response.data?.message ||
          "The server could not generate your trip.";

      }


      // Backend didn't respond

      else if (error.request) {

        console.log(
          "No response received:",
          error.request
        );


        message =
          "Unable to connect to the backend. Please check your server and try again.";

      }


      // Other errors

      else {

        console.log(
          "Error:",
          error.message
        );


        message =
          error.message ||
          "Failed to generate your trip.";

      }


      setErrorMessage(
        message
      );


      // Make sure old results
      // don't remain visible

      setGenerated(false);

      setTrip(null);

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // UI
  // ==========================================

  return (

    <>

      {/* ======================================
          PLANNER FORM
      ====================================== */}

      <PlannerForm
        onGenerate={
          handleGenerate
        }
      />


      {/* ======================================
          LOADING STATE
      ====================================== */}

      {loading && (
        <AIThinking />
      )}


      {/* ======================================
          ERROR STATE
      ====================================== */}

      {!loading &&
        errorMessage && (

          <section
            className="planner-error"
          >

            <div
              className="planner-error-icon"
            >
              ⚠️
            </div>


            <div
              className="planner-error-content"
            >

              <h3>
                We couldn't generate your trip
              </h3>


              <p>
                {errorMessage}
              </p>


              <button
                type="button"
                className="planner-error-btn"
                onClick={() =>
                  setErrorMessage("")
                }
              >
                Try Again
              </button>

            </div>

          </section>

        )}


      {/* ======================================
          GENERATED RESULTS
      ====================================== */}

      {generated &&
        trip && (

          <section
            className="planner-results"
            ref={resultRef}
          >

            {/* ==================================
                WEATHER
            ================================== */}

            <WeatherCard
              weather={
                trip.weather
              }
              destination={
                trip.destination
              }
            />


            {/* ==================================
                HOTELS
            ================================== */}

            <HotelCard
              hotels={
                trip.hotels || []
              }
            />


            {/* ==================================
                RESTAURANTS
            ================================== */}

            <RestaurantCard
              restaurants={
                trip.restaurants || []
              }
            />


            {/* ==================================
                BUDGET
            ================================== */}

            <BudgetCard
              budget={
                trip.budget
              }
              budgetBreakdown={
                trip.budgetBreakdown
              }
              days={
                trip.days
              }
              travelers={
                trip.travelers
              }
            />


            {/* ==================================
                TRANSPORTATION
            ================================== */}

            <Transportation
              trip={trip}
            />


            {/* ==================================
                PACKING
            ================================== */}

            <Packing
              packing={
                trip.packing || []
              }
            />


            {/* ==================================
                ITINERARY
            ================================== */}

            <Timeline
              itinerary={
                trip.itinerary
                  ?.dailyPlan || []
              }
            />


            {/* ==================================
                TRAVEL TIPS
            ================================== */}

            <TravelTips
              tips={
                trip.itinerary
                  ?.travelTips || []
              }
            />

          </section>

        )}

    </>

  );
}

export default Planner;