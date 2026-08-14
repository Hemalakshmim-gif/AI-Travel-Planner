import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plane, Sparkles, Map } from "lucide-react";

import "./Dashboard.css";

import Sidebar from "../Sidebar/Sidebar";

import SummaryCard from "../Summary/SummaryCard";
import WeatherCard from "../Weather/WeatherCard";
import BudgetCard from "../Budget/BudgetCard";
import Timeline from "../Timeline/Timeline";
import HotelCard from "../Hotels/HotelCard";
import RestaurantCard from "../Restaurants/RestaurantCard";
import Packing from "../Packing/Packing";
import TravelTips from "../TravelTips/TravelTips";
import AIInsights from "../AIInsights/AIInsights";
import Places from "../Places/Places";

import { getTrips } from "../../../services/tripService";

// ==========================================================
// CALCULATE TRIP DURATION
// ==========================================================

const calculateTripDays = (trip) => {
  if (!trip) {
    return null;
  }

  const startDate =
    trip.startDate ||
    trip.start_date;

  const endDate =
    trip.endDate ||
    trip.end_date;

  if (!startDate || !endDate) {
    return null;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime())
  ) {
    return null;
  }

  // --------------------------------------------------------
  // IMPORTANT
  // Inclusive calculation.
  //
  // Example:
  // Aug 10 → Aug 12
  // = Aug 10, Aug 11, Aug 12
  // = 3 days
  // --------------------------------------------------------

  const difference =
    end.getTime() -
    start.getTime();

  const days =
    Math.round(
      difference /
        (1000 * 60 * 60 * 24)
    ) + 1;

  return days > 0
    ? days
    : null;
};


// ==========================================================
// DASHBOARD
// ==========================================================

function Dashboard() {

  const navigate = useNavigate();

  const [
    activePage,
    setActivePage,
  ] = useState("summary");


  // ========================================================
  // USER
  // ========================================================

  const [user] = useState(() => {

    try {

      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {
        return null;
      }

      return JSON.parse(
        storedUser
      );

    } catch (error) {

      console.error(
        "Failed to load user:",
        error
      );

      return null;

    }

  });


  // ========================================================
  // TRIPS
  // ========================================================

  const [trips, setTrips] =
    useState([]);

  const [trip, setTrip] =
    useState(null);


  // ========================================================
  // LOADING
  // ========================================================

  const [loading, setLoading] =
    useState(true);


  // ========================================================
  // ERROR
  // ========================================================

  const [error, setError] =
    useState("");


  // ========================================================
  // LOAD USER TRIPS
  // ========================================================

  useEffect(() => {

    let mounted = true;

    const loadTrips = async () => {

      try {

        setLoading(true);

        setError("");

        // ==============================================
        // GET TRIPS FROM DATABASE
        // ==============================================

        const response =
          await getTrips();

        const data =
          response?.data;

        if (
          !data?.success
        ) {

          throw new Error(
            data?.message ||
              "Unable to load your trips."
          );

        }

        const userTrips =
          Array.isArray(data.trips)
            ? data.trips
            : [];

        if (!mounted) {
          return;
        }

        // ==============================================
        // SAVE TRIPS
        // ==============================================

        setTrips(userTrips);

        // ==============================================
        // FIND LATEST TRIP
        // ==============================================

        const latestTrip =
          userTrips.length > 0
            ? userTrips[0]
            : null;

        setTrip(latestTrip);

        // ==============================================
        // UPDATE LOCAL CACHE
        //
        // This is only a cache.
        // It is NOT the source of truth anymore.
        // ==============================================

        if (latestTrip) {

          localStorage.setItem(
            "currentTrip",
            JSON.stringify(
              latestTrip
            )
          );

        } else {

          // Important:
          // New user has no trips.
          // Remove old user's cached trip.
          localStorage.removeItem(
            "currentTrip"
          );

        }

      } catch (error) {

        console.error(
          "Dashboard Trip Error:",
          error
        );

        if (!mounted) {
          return;
        }

        if (
          error.response
        ) {

          setError(
            error.response.data?.message ||
              "Unable to load your trips."
          );

        } else if (
          error.request
        ) {

          setError(
            "Unable to connect to the backend."
          );

        } else {

          setError(
            error.message ||
              "Unable to load your trips."
          );

        }

        setTrips([]);

        setTrip(null);

      } finally {

        if (mounted) {
          setLoading(false);
        }

      }

    };

    loadTrips();

    return () => {
      mounted = false;
    };

  }, []);


  // ========================================================
  // TRIP DAYS
  // ========================================================

  const tripDays =
    calculateTripDays(trip);


  // ========================================================
  // USER NAME
  // ========================================================

  const userName =
    user?.fullName ||
    user?.full_name ||
    "Traveler";


  // ========================================================
  // RENDER ACTIVE PAGE
  // ========================================================

  const renderPage = () => {

    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {

      return (

        <div className="dashboard-loading">

          <div className="dashboard-loading-icon">

            <Plane size={30} />

          </div>

          <h2>
            Preparing your dashboard...
          </h2>

          <p>
            Loading your travel plans.
          </p>

        </div>

      );

    }


    // ======================================================
    // ERROR
    // ======================================================

    if (error) {

      return (

        <div className="dashboard-empty">

          <div className="dashboard-empty-icon">
            ⚠️
          </div>

          <h1>
            Unable to load your trips
          </h1>

          <p>
            {error}
          </p>

          <button
            type="button"
            className="dashboard-empty-btn"
            onClick={() =>
              window.location.reload()
            }
          >
            Try Again
          </button>

        </div>

      );

    }


    // ======================================================
    // NO TRIP
    // ======================================================

    if (!trip) {

      return (

        <div className="dashboard-empty">

          <div className="dashboard-empty-icon">

            <Plane size={34} />

          </div>

          <div className="dashboard-empty-badge">

            <Sparkles size={15} />

            AI Travel Planner

          </div>

          <h1>

            Welcome,
            {" "}
            {userName.split(" ")[0]}! 👋

          </h1>

          <p>

            Your next adventure starts here.
            Create your first personalized
            AI-powered travel plan and discover
            destinations, hotels, restaurants,
            places and more.

          </p>

          <button
            type="button"
            className="dashboard-empty-btn"
            onClick={() =>
              navigate("/planner")
            }
          >

            <Plane size={18} />

            Plan Your First Trip

          </button>

        </div>

      );

    }


    // ======================================================
    // SUMMARY
    // ======================================================

    switch (activePage) {

      case "summary":

        return (

          <>

            {/* ==========================================
                WELCOME
            ========================================== */}

            <div className="dashboard-welcome">

              <h1>

                👋 Welcome Back,
                {" "}
                {userName.split(" ")[0]}

              </h1>

              <p>

                Your AI Travel Planner is ready
                to help you explore your next
                adventure.

              </p>

            </div>


            {/* ==========================================
                SUMMARY CARD
            ========================================== */}

            <SummaryCard
              trip={trip}
            />


            {/* ==========================================
                WEATHER + BUDGET
            ========================================== */}

            <div className="dashboard-grid">

              <WeatherCard
                weather={
                  trip.weather
                }
                destination={
                  trip.destination
                }
              />

              <BudgetCard
                budget={
                  trip.budget
                }

                budgetBreakdown={
                  trip.budget_breakdown ||
                  trip.budgetBreakdown
                }

                days={
                  trip.days ||
                  tripDays ||
                  trip.itinerary?.days
                }

                travelers={
                  trip.travelers
                }

                startDate={
                  trip.startDate ||
                  trip.start_date
                }

                endDate={
                  trip.endDate ||
                  trip.end_date
                }

              />

            </div>

          </>

        );


      // ====================================================
      // ITINERARY
      // ====================================================

      case "itinerary":

        return (

          <Timeline
            itinerary={
              trip.itinerary?.dailyPlan ||
              trip.dailyPlan ||
              []
            }
          />

        );


      // ====================================================
      // PLACES
      // ====================================================

      case "places":

        return (

          <Places
            places={
              trip.places ||
              trip.itinerary?.places ||
              []
            }
          />

        );


      // ====================================================
      // HOTELS
      // ====================================================

      case "hotels":

        return (

          <HotelCard
            hotels={
              trip.hotels ||
              trip.itinerary?.hotels ||
              []
            }
          />

        );


      // ====================================================
      // RESTAURANTS
      // ====================================================

      case "restaurants":

        return (

          <RestaurantCard
            restaurants={
              trip.restaurants ||
              trip.itinerary?.restaurants ||
              []
            }
          />

        );


      // ====================================================
      // PACKING
      // ====================================================

      case "packing":

        return (

          <Packing
            packing={
              trip.packing ||
              trip.itinerary?.packingList ||
              []
            }
          />

        );


      // ====================================================
      // TRAVEL TIPS
      // ====================================================

      case "traveltips":

        return (

          <>

            <TravelTips
              tips={
                trip.itinerary?.travelTips ||
                trip.travelTips ||
                []
              }
            />

            <AIInsights
              insights={
                trip.itinerary?.aiInsights ||
                trip.aiInsights ||
                []
              }
            />

          </>

        );


      // ====================================================
      // DEFAULT
      // ====================================================

      default:

        return null;

    }

  };


  // ========================================================
  // DASHBOARD UI
  // ========================================================

  return (

    <section className="dashboard">


      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <Sidebar
        activePage={
          activePage
        }

        setActivePage={
          setActivePage
        }

        matchScore={
          trip?.ai_score ??
          trip?.aiScore ??
          trip?.itinerary?.matchScore
        }

        matchReason={
          trip?.itinerary?.matchReason
        }

      />


      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <main className="dashboard-content">

        <AnimatePresence
          mode="wait"
        >

          <motion.div

            key={
              activePage
            }

            initial={{
              opacity: 0,
              y: 30,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            exit={{
              opacity: 0,
              y: -30,
            }}

            transition={{
              duration: 0.35,
            }}

            className="page-wrapper"
          >

            {renderPage()}

          </motion.div>

        </AnimatePresence>

      </main>

    </section>

  );

}

export default Dashboard;