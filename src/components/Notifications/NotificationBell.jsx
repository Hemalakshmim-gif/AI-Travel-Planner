import "./NotificationBell.css";

import {
  Bell,
  Sparkles,
  CloudRain,
  Sun,
  Wallet,
  Hotel,
  Utensils,
  MapPin,
} from "lucide-react";

import { useEffect, useState } from "react";


// =====================================================
// GENERATE REAL NOTIFICATIONS
// =====================================================

const generateNotifications = (trip) => {

  if (!trip) {
    return [];
  }

  const notifications = [];

  const destination =
    trip.destination ||
    "your destination";


  // ===================================================
  // 1. ITINERARY READY
  // ===================================================

  if (
    trip.itinerary &&
    !trip.itinerary.raw
  ) {

    const dailyPlan =
      Array.isArray(
        trip.itinerary.dailyPlan
      )
        ? trip.itinerary.dailyPlan
        : [];

    const days =
      dailyPlan.length ||
      trip.days ||
      "--";

    notifications.push({

      id: "itinerary-ready",

      type: "success",

      icon: Sparkles,

      title: "Trip Itinerary Ready",

      description:
        `Your ${days}-day AI travel plan for ${destination} has been generated.`,

      time:
        getNotificationTime(trip),

    });
  }


  // ===================================================
  // 2. WEATHER
  // ===================================================

  const weather =
    trip.weather || {};

  const weatherDescription =
    weather.description ||
    weather.condition ||
    weather.weather ||
    "";

  const temperature =
    weather.temperature ??
    weather.temp ??
    null;

  if (
    weatherDescription ||
    temperature !== null
  ) {

    const weatherText =
      String(
        weatherDescription
      ).toLowerCase();

    const isRain =
      weatherText.includes("rain") ||
      weatherText.includes("drizzle") ||
      weatherText.includes("storm") ||
      weatherText.includes("thunder");

    notifications.push({

      id: "weather-update",

      type: isRain
        ? "warning"
        : "info",

      icon: isRain
        ? CloudRain
        : Sun,

      title: isRain
        ? "Weather Alert"
        : "Weather Update",

      description:
        buildWeatherMessage(
          destination,
          weatherDescription,
          temperature
        ),

      time:
        "Based on current weather data",

    });
  }


  // ===================================================
  // 3. BUDGET
  // ===================================================

  const budget =
    trip.budget;

  const budgetBreakdown =
    Array.isArray(
      trip.budgetBreakdown
    )
      ? trip.budgetBreakdown
      : Array.isArray(
          trip.itinerary?.budgetBreakdown
        )
        ? trip.itinerary.budgetBreakdown
        : [];

  if (
    budget ||
    budgetBreakdown.length > 0
  ) {

    const estimatedBudget =
      trip.itinerary?.estimatedBudget ||
      budget;

    notifications.push({

      id: "budget-generated",

      type: "warning",

      icon: Wallet,

      title: "Budget Ready",

      description:
        estimatedBudget
          ? `Your estimated trip budget is ₹${formatBudget(
              estimatedBudget
            )}.`
          : "Your AI-generated budget breakdown is ready.",

      time:
        "Based on your trip data",

    });
  }


  // ===================================================
  // 4. HOTELS
  // ===================================================

  const hotels =
    Array.isArray(
      trip.itinerary?.hotels
    )
      ? trip.itinerary.hotels
      : Array.isArray(
          trip.hotels
        )
        ? trip.hotels
        : [];

  if (
    hotels.length > 0
  ) {

    notifications.push({

      id: "hotels-found",

      type: "success",

      icon: Hotel,

      title: "Hotels Found",

      description:
        `${hotels.length} hotel recommendation${
          hotels.length === 1
            ? ""
            : "s"
        } found for ${destination}.`,

      time:
        "Based on your trip preferences",

    });
  }


  // ===================================================
  // 5. RESTAURANTS
  // ===================================================

  const restaurants =
    Array.isArray(
      trip.itinerary?.restaurants
    )
      ? trip.itinerary.restaurants
      : Array.isArray(
          trip.restaurants
        )
        ? trip.restaurants
        : [];

  if (
    restaurants.length > 0
  ) {

    notifications.push({

      id: "restaurants-found",

      type: "info",

      icon: Utensils,

      title: "Restaurants Found",

      description:
        `${restaurants.length} restaurant recommendation${
          restaurants.length === 1
            ? ""
            : "s"
        } selected for your trip.`,

      time:
        "Based on your preferences",

    });
  }


  // ===================================================
  // 6. PLACES
  // ===================================================

  const places =
    Array.isArray(
      trip.itinerary?.places
    )
      ? trip.itinerary.places
      : Array.isArray(
          trip.places
        )
        ? trip.places
        : [];

  if (
    places.length > 0
  ) {

    notifications.push({

      id: "places-found",

      type: "info",

      icon: MapPin,

      title: "Places Discovered",

      description:
        `${places.length} real place${
          places.length === 1
            ? ""
            : "s"
        } discovered around ${destination}.`,

      time:
        "Using available location data",

    });
  }


  // ===================================================
  // 7. AI MATCH SCORE
  // ===================================================

  const matchScore =
    trip.itinerary?.matchScore;

  if (
    typeof matchScore === "number"
  ) {

    notifications.push({

      id: "match-score",

      type: "success",

      icon: Sparkles,

      title: "AI Trip Match Updated",

      description:
        `Your itinerary has a ${matchScore}% AI match score based on your interests, budget, weather and recommendations.`,

      time:
        "AI analysis completed",

    });
  }


  // ===================================================
  // LIMIT
  // ===================================================

  return notifications.slice(
    0,
    7
  );
};


// =====================================================
// WEATHER MESSAGE
// =====================================================

const buildWeatherMessage = (
  destination,
  description,
  temperature
) => {

  if (
    description &&
    temperature !== null
  ) {

    return (
      `${destination} currently has ` +
      `${temperature}°C with ${description}.`
    );
  }

  if (description) {

    return (
      `${destination} currently has ` +
      `${description}.`
    );
  }

  if (
    temperature !== null
  ) {

    return (
      `${destination} currently has ` +
      `${temperature}°C.`
    );
  }

  return (
    `Weather information is available for ${destination}.`
  );
};


// =====================================================
// FORMAT BUDGET
// =====================================================

const formatBudget = (
  value
) => {

  const numericValue =
    Number(
      String(value)
        .replace(/[₹,]/g, "")
        .replace(/[^\d.]/g, "")
    );

  if (
    Number.isNaN(
      numericValue
    )
  ) {

    return String(value);
  }

  return numericValue.toLocaleString(
    "en-IN"
  );
};


// =====================================================
// GET NOTIFICATION TIME
// =====================================================

const getNotificationTime = (
  trip
) => {

  if (
    trip.generatedAt
  ) {

    const generated =
      new Date(
        trip.generatedAt
      );

    if (
      !Number.isNaN(
        generated.getTime()
      )
    ) {

      return formatRelativeTime(
        generated
      );
    }
  }

  return "Recently";
};


// =====================================================
// RELATIVE TIME
// =====================================================

const formatRelativeTime = (
  date
) => {

  const difference =
    Date.now() -
    date.getTime();

  const minutes =
    Math.floor(
      difference /
      (1000 * 60)
    );

  if (
    minutes < 1
  ) {

    return "Just now";
  }

  if (
    minutes < 60
  ) {

    return `${minutes} min ago`;
  }

  const hours =
    Math.floor(
      minutes / 60
    );

  if (
    hours < 24
  ) {

    return `${hours} hour${
      hours === 1
        ? ""
        : "s"
    } ago`;
  }

  const days =
    Math.floor(
      hours / 24
    );

  return `${days} day${
    days === 1
      ? ""
      : "s"
  } ago`;
};


// =====================================================
// NOTIFICATION BELL
// =====================================================

function NotificationBell() {

  const [
    open,
    setOpen
  ] = useState(false);


  const [
    notifications,
    setNotifications
  ] = useState([]);


  // ===================================================
  // LOAD CURRENT TRIP
  // ===================================================

  const loadNotifications = () => {

    const savedTrip =
      localStorage.getItem(
        "currentTrip"
      );

    if (!savedTrip) {

      setNotifications([]);

      return;
    }

    try {

      const trip =
        JSON.parse(
          savedTrip
        );

      const generatedNotifications =
        generateNotifications(
          trip
        );

      setNotifications(
        generatedNotifications
      );

    } catch (error) {

      console.error(
        "Failed to load notifications:",
        error
      );

      setNotifications([]);
    }
  };


  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {

    loadNotifications();

  }, []);


  // ===================================================
  // REAL-TIME TRIP UPDATE
  // ===================================================
  //
  // This event will be dispatched after:
  //
  // localStorage.setItem("currentTrip", ...)
  //
  // ===================================================

  useEffect(() => {

    const handleTripUpdate = () => {

      loadNotifications();

    };

    window.addEventListener(
      "tripUpdated",
      handleTripUpdate
    );

    return () => {

      window.removeEventListener(
        "tripUpdated",
        handleTripUpdate
      );

    };

  }, []);


  // ===================================================
  // CROSS-TAB LOCAL STORAGE UPDATE
  // ===================================================

  useEffect(() => {

    const handleStorageChange = () => {

      loadNotifications();

    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {

      window.removeEventListener(
        "storage",
        handleStorageChange
      );

    };

  }, []);


  // ===================================================
  // REFRESH WHEN WINDOW GETS FOCUS
  // ===================================================

  useEffect(() => {

    const handleFocus = () => {

      loadNotifications();

    };

    window.addEventListener(
      "focus",
      handleFocus
    );

    return () => {

      window.removeEventListener(
        "focus",
        handleFocus
      );

    };

  }, []);


  // ===================================================
  // UI
  // ===================================================

  return (

    <div className="notification-wrapper">

      {/* ==========================================
          BELL
      ========================================== */}

      <button
        className="notification-button"
        onClick={() =>
          setOpen(
            (previous) =>
              !previous
          )
        }
        type="button"
        aria-label="Notifications"
      >

        <Bell size={22} />

        {notifications.length > 0 && (

          <span className="notification-count">

            {notifications.length}

          </span>

        )}

      </button>


      {/* ==========================================
          DROPDOWN
      ========================================== */}

      {open && (

        <div className="notification-dropdown">

          {/* ========================================
              HEADER
          ======================================== */}

          <div className="notification-header">

            <h3>
              Notifications
            </h3>

            {notifications.length > 0 && (

              <span>
                {notifications.length}
              </span>

            )}

          </div>


          {/* ========================================
              NOTIFICATION LIST
          ======================================== */}

          <div className="notification-list">

            {notifications.length === 0 ? (

              <div className="notification-empty">

                <Bell size={28} />

                <h4>
                  No notifications
                </h4>

                <p>
                  Generate a trip to receive
                  personalized travel updates.
                </p>

              </div>

            ) : (

              notifications.map(
                (item) => {

                  const Icon =
                    item.icon ||
                    Bell;

                  return (

                    <div
                      className="notification-item"
                      key={item.id}
                    >

                      <div
                        className={`notification-dot ${item.type}`}
                      ></div>


                      <div className="notification-icon">

                        <Icon
                          size={18}
                        />

                      </div>


                      <div className="notification-content">

                        <h4>
                          {item.title}
                        </h4>

                        <p>
                          {item.description}
                        </p>

                        <span>
                          {item.time}
                        </span>

                      </div>

                    </div>

                  );
                }
              )

            )}

          </div>

        </div>

      )}

    </div>
  );
}

export default NotificationBell;