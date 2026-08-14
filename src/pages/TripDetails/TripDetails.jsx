import "./TripDetails.css";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  Users,
  Wallet,
  Sparkles,
  CloudSun,
  Hotel,
  Utensils,
  Backpack,
  Lightbulb,
} from "lucide-react";

import { getTrips } from "../../services/tripService";

function TripDetails() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [
    trip,
    setTrip,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  // ==========================================
  // LOAD TRIP
  // ==========================================

  useEffect(() => {

    let mounted = true;

    const loadTrip = async () => {

      try {

        const response =
          await getTrips();

        const trips =
          response?.data?.trips || [];

        const foundTrip =
          trips.find(
            (item) =>
              String(item.id) ===
              String(id)
          );

        if (!mounted) {
          return;
        }

        // ====================================
        // UPDATE TRIP STATE
        // ====================================

        setTrip(
          foundTrip || null
        );

        // ====================================
        // IMPORTANT:
        // UPDATE CURRENT TRIP IN LOCAL STORAGE
        // ====================================

        if (foundTrip) {

          localStorage.setItem(
            "currentTrip",
            JSON.stringify(
              foundTrip
            )
          );

        }

      } catch (error) {

        console.error(
          "Failed to load trip:",
          error
        );

      } finally {

        if (mounted) {

          setLoading(false);

        }

      }

    };

    loadTrip();

    return () => {

      mounted = false;

    };

  }, [id]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <section
        className="trip-details-page"
      >

        <div
          className="trip-details-loading"
        >

          <Sparkles
            size={32}
          />

          <h2>
            Loading your trip...
          </h2>

          <p>
            Preparing your complete
            travel plan.
          </p>

        </div>

      </section>
    );
  }

  // ==========================================
  // TRIP NOT FOUND
  // ==========================================

  if (!trip) {

    return (
      <section
        className="trip-details-page"
      >

        <div
          className="trip-not-found"
        >

          <div className="not-found-icon">
            ✈️
          </div>

          <h1>
            Trip Not Found
          </h1>

          <p>
            We couldn't find this saved trip.
          </p>

          <button
            onClick={() =>
              navigate(
                "/saved-trips"
              )
            }
          >
            <ArrowLeft size={18} />

            Back to Saved Trips

          </button>

        </div>

      </section>
    );
  }

  // ==========================================
  // PARSE DATA
  // ==========================================

  const itinerary =
    parseJSON(
      trip.itinerary,
      {}
    );

  const weather =
    parseJSON(
      trip.weather,
      {}
    );

  const hotels =
    parseJSON(
      trip.hotels,
      []
    );

  const restaurants =
    parseJSON(
      trip.restaurants,
      []
    );

  const packing =
    parseJSON(
      trip.packing,
      []
    );

  const interests =
    parseJSON(
      trip.interests,
      []
    );

  // ==========================================
  // ITINERARY DATA
  // ==========================================

  const dailyPlan =
    Array.isArray(
      itinerary?.dailyPlan
    )
      ? itinerary.dailyPlan
      : [];

  const travelTips =
    Array.isArray(
      itinerary?.travelTips
    )
      ? itinerary.travelTips
      : [];

  // ==========================================
  // WEATHER DATA
  // ==========================================

  const temperature =
    weather?.temp ??
    weather?.temperature ??
    weather?.main?.temp;

  const condition =
    weather?.condition ??
    weather?.description ??
    weather?.weather?.[0]?.description;

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <section
      className="trip-details-page"
    >

      <div
        className="trip-details-container"
      >

        {/* ====================================
            BACK
        ==================================== */}

        <button
          className="back-btn"

          onClick={() =>
            navigate(
              "/saved-trips"
            )
          }
        >

          <ArrowLeft
            size={18}
          />

          Back to Saved Trips

        </button>

        {/* ====================================
            HEADER
        ==================================== */}

        <div
          className="trip-details-header"
        >

          <div>

            <span
              className="section-tag"
            >
              ✨ AI Generated Trip
            </span>

            <h1>

              <MapPin
                size={30}
              />

              {trip.destination}

            </h1>

            <div
              className="trip-details-meta"
            >

              <span>

                <CalendarDays
                  size={17}
                />

                {formatDate(
                  trip.start_date
                )}

                {" - "}

                {formatDate(
                  trip.end_date
                )}

              </span>

              <span>

                <Users
                  size={17}
                />

                {trip.travelers}{" "}
                Travelers

              </span>

              <span>

                <Wallet
                  size={17}
                />

                ₹
                {Number(
                  trip.budget || 0
                ).toLocaleString()}

              </span>

            </div>

          </div>

          {/* MATCH SCORE */}

          <div
            className="match-score"
          >

            <Sparkles
              size={20}
            />

            <strong>
              {trip.ai_score || 98}%
            </strong>

            <span>
              AI Match
            </span>

          </div>

        </div>

        {/* ====================================
            SUMMARY
        ==================================== */}

        <div
          className="details-card"
        >

          <div
            className="details-card-title"
          >

            <Sparkles
              size={21}
            />

            <h2>
              AI Trip Summary
            </h2>

          </div>

          <p>

            {itinerary.summary ||
              "Your personalized AI travel itinerary is ready."}

          </p>

          {/* INTEREST TAGS */}

          {interests.length > 0 && (

            <div
              className="detail-tags"
            >

              {interests.map(
                (interest) => (

                  <span
                    key={interest}
                  >
                    {interest}
                  </span>

                )
              )}

            </div>

          )}

        </div>

        {/* ====================================
            WEATHER + BUDGET
        ==================================== */}

        <div
          className="details-two-column"
        >

          {/* WEATHER */}

          <div
            className="details-card"
          >

            <div
              className="details-card-title"
            >

              <CloudSun
                size={21}
              />

              <h2>
                Weather
              </h2>

            </div>

            <div
              className="weather-detail"
            >

              <strong>

                {temperature ??
                  "--"}

                {temperature !==
                  undefined &&
                temperature !==
                  null
                  ? "°C"
                  : ""}

              </strong>

              <span>

                {condition ||
                  "Weather information unavailable"}

              </span>

            </div>

          </div>

          {/* BUDGET */}

          <div
            className="details-card"
          >

            <div
              className="details-card-title"
            >

              <Wallet
                size={21}
              />

              <h2>
                Estimated Budget
              </h2>

            </div>

            <div
              className="budget-detail"
            >

              <strong>

                {itinerary
                  .estimatedBudget ||
                  `₹${Number(
                    trip.budget || 0
                  ).toLocaleString()}`}

              </strong>

            </div>

          </div>

        </div>

        {/* ====================================
            DAILY ITINERARY
        ==================================== */}

        <div
          className="details-card"
        >

          <div
            className="details-card-title"
          >

            <CalendarDays
              size={21}
            />

            <h2>
              Daily Itinerary
            </h2>

          </div>

          {dailyPlan.length > 0 ? (

            <div
              className="daily-plan"
            >

              {dailyPlan.map(
                (day, index) => (

                  <div
                    className="day-card"
                    key={index}
                  >

                    <h3>

                      Day{" "}
                      {day.day ||
                        index + 1}

                      {" — "}

                      {day.title ||
                        "Travel Plan"}

                    </h3>

                    <ul>

                      {(
                        day.activities ||
                        []
                      ).map(
                        (
                          activity,
                          activityIndex
                        ) => (

                          <li
                            key={
                              activityIndex
                            }
                          >
                            {activity}
                          </li>

                        )
                      )}

                    </ul>

                  </div>

                )
              )}

            </div>

          ) : (

            <p>
              Daily itinerary information
              is unavailable.
            </p>

          )}

        </div>

        {/* ====================================
            HOTELS
        ==================================== */}

        <div
          className="details-card"
        >

          <div
            className="details-card-title"
          >

            <Hotel
              size={21}
            />

            <h2>
              Recommended Hotels
            </h2>

          </div>

          <div
            className="detail-grid"
          >

            {hotels.length > 0 ? (

              hotels.map(
                (hotel, index) => (

                  <div
                    className="detail-item"
                    key={
                      hotel.id ||
                      index
                    }
                  >

                    <h3>
                      {hotel.name ||
                        "Recommended Hotel"}
                    </h3>

                    {hotel.rating && (

                      <span>
                        ⭐{" "}
                        {hotel.rating}
                      </span>

                    )}

                    {hotel.location && (

                      <p>
                        📍{" "}
                        {hotel.location}
                      </p>

                    )}

                    {hotel.price && (

                      <p>
                        💰{" "}
                        {hotel.price}
                      </p>

                    )}

                  </div>

                )
              )

            ) : (

              <p>
                No hotel recommendations
                available.
              </p>

            )}

          </div>

        </div>

        {/* ====================================
            RESTAURANTS
        ==================================== */}

        <div
          className="details-card"
        >

          <div
            className="details-card-title"
          >

            <Utensils
              size={21}
            />

            <h2>
              Recommended Restaurants
            </h2>

          </div>

          <div
            className="detail-grid"
          >

            {restaurants.length > 0 ? (

              restaurants.map(
                (
                  restaurant,
                  index
                ) => (

                  <div
                    className="detail-item"
                    key={
                      restaurant.id ||
                      index
                    }
                  >

                    <h3>
                      {restaurant.name ||
                        "Recommended Restaurant"}
                    </h3>

                    {restaurant.rating && (

                      <span>
                        ⭐{" "}
                        {restaurant.rating}
                      </span>

                    )}

                    {restaurant.cuisine && (

                      <p>
                        🍽{" "}
                        {restaurant.cuisine}
                      </p>

                    )}

                    {restaurant.price && (

                      <p>
                        💰{" "}
                        {restaurant.price}
                      </p>

                    )}

                    {restaurant.distance && (

                      <p>
                        📍{" "}
                        {restaurant.distance}
                      </p>

                    )}

                    {restaurant.speciality && (

                      <p>
                        👨‍🍳{" "}
                        {restaurant.speciality}
                      </p>

                    )}

                  </div>

                )
              )

            ) : (

              <p>
                No restaurant recommendations
                available.
              </p>

            )}

          </div>

        </div>

        {/* ====================================
            PACKING
        ==================================== */}

        <div
          className="details-card"
        >

          <div
            className="details-card-title"
          >

            <Backpack
              size={21}
            />

            <h2>
              Packing List
            </h2>

          </div>

          {packing.length > 0 ? (

            <div
              className="packing-detail-list"
            >

              {packing.map(
                (item, index) => (

                  <span
                    key={index}
                  >
                    ✓ {item}
                  </span>

                )
              )}

            </div>

          ) : (

            <p>
              Packing information
              is unavailable.
            </p>

          )}

        </div>

        {/* ====================================
            TRAVEL TIPS
        ==================================== */}

        <div
          className="details-card"
        >

          <div
            className="details-card-title"
          >

            <Lightbulb
              size={21}
            />

            <h2>
              Travel Tips
            </h2>

          </div>

          {travelTips.length > 0 ? (

            <ul
              className="tips-detail-list"
            >

              {travelTips.map(
                (tip, index) => (

                  <li
                    key={index}
                  >
                    {tip}
                  </li>

                )
              )}

            </ul>

          ) : (

            <p>
              Travel tips are available
              inside your generated itinerary.
            </p>

          )}

        </div>

      </div>

    </section>
  );
}

// ==========================================
// JSON HELPER
// ==========================================

function parseJSON(
  value,
  fallback
) {

  if (
    value === null ||
    value === undefined
  ) {
    return fallback;
  }

  if (
    typeof value === "object"
  ) {
    return value;
  }

  try {

    return JSON.parse(value);

  } catch {

    return fallback;

  }
}

// ==========================================
// DATE FORMATTER
// ==========================================

function formatDate(
  value
) {

  if (!value) {
    return "--";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

export default TripDetails;