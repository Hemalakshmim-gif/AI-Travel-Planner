import "./Compare.css";

import { useEffect, useMemo, useState } from "react";

import {
  ArrowRightLeft,
  CalendarDays,
  Users,
  Wallet,
  MapPin,
  Sparkles,
  CloudSun,
  Heart,
  Hotel,
  Utensils,
  ShoppingBag,
  Moon,
  Mountain,
  Check,
  X,
  Trophy,
  TrendingDown,
  Clock3,
  Plane,
} from "lucide-react";

import { getTrips } from "../../services/tripService";
import getDestinationImage from "../../utils/getDestinationImage";

// ======================================================
// HELPERS
// ======================================================

const getTripId = (trip) =>
  trip?.id ?? trip?.trip_id;

const getDestination = (trip) =>
  trip?.destination || "Unknown Destination";

const getBudget = (trip) => {
  const value = Number(trip?.budget);

  return Number.isFinite(value) ? value : 0;
};

const getTravelers = (trip) => {
  const value = Number(trip?.travelers);

  return Number.isFinite(value) ? value : 0;
};

const getDate = (trip, type) => {
  const value =
    type === "start"
      ? trip?.start_date || trip?.startDate
      : trip?.end_date || trip?.endDate;

  if (!value) return "--";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getDays = (trip) => {
  const start =
    trip?.start_date || trip?.startDate;

  const end =
    trip?.end_date || trip?.endDate;

  if (!start || !end) return "--";

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (
    Number.isNaN(startDate.getTime()) ||
    Number.isNaN(endDate.getTime())
  ) {
    return "--";
  }

  const difference =
    endDate.getTime() - startDate.getTime();

  const days =
    Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );

  return days > 0 ? days : "--";
};

const getAiScore = (trip) => {
  const score =
    trip?.ai_score ??
    trip?.aiScore ??
    98;

  const numericScore = Number(score);

  return Number.isFinite(numericScore)
    ? numericScore
    : 98;
};

const getWeather = (trip) => {
  const weather = trip?.weather;

  if (!weather) {
    return {
      temp: "--",
      condition: "Unavailable",
    };
  }

  const temp =
    weather.temp ??
    weather.temperature ??
    "--";

  const condition =
    weather.condition ??
    weather.description ??
    "Unavailable";

  return {
    temp,
    condition,
  };
};

const getInterests = (trip) => {
  if (!trip?.interests) return [];

  if (Array.isArray(trip.interests)) {
    return trip.interests;
  }

  try {
    const parsed = JSON.parse(trip.interests);

    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // Ignore invalid JSON
  }

  if (typeof trip.interests === "string") {
    return trip.interests
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const formatCurrency = (value) => {
  if (!Number.isFinite(Number(value))) {
    return "₹0";
  }

  return `₹${Number(value).toLocaleString("en-IN")}`;
};

// ======================================================
// INTEREST CONFIG
// ======================================================

const interestConfig = {
  Photography: {
    icon: Sparkles,
  },

  Nightlife: {
    icon: Moon,
  },

  Adventure: {
    icon: Mountain,
  },

  Food: {
    icon: Utensils,
  },

  Relaxation: {
    icon: Heart,
  },

  Nature: {
    icon: Mountain,
  },

  Shopping: {
    icon: ShoppingBag,
  },

  Hotels: {
    icon: Hotel,
  },
};

// ======================================================
// INTEREST ICON
// ======================================================

function InterestIcon({ interest }) {
  const config = interestConfig[interest];

  if (!config) {
    return <Sparkles size={17} />;
  }

  const Icon = config.icon;

  return <Icon size={17} />;
}

// ======================================================
// TRIP HEADER CARD
// ======================================================

function TripHeaderCard({ trip, label }) {
  const destination = getDestination(trip);
  const score = getAiScore(trip);

  return (
    <article className="compare-trip-card">

      <div className="compare-image-wrapper">

        <img
          src={getDestinationImage(destination)}
          alt={destination}
          className="compare-trip-image"
        />

        <div className="compare-image-overlay" />

        <div className="compare-match-badge">
          <Sparkles size={15} />
          {score}% Match
        </div>

        <div className="compare-trip-label">
          {label}
        </div>

      </div>

      <div className="compare-trip-info">

        <div className="compare-destination-row">

          <div>
            <h2>{destination}</h2>

            <div className="compare-location">

              <MapPin size={16} />

              <span>
                AI Planned Destination
              </span>

            </div>
          </div>

          <div className="compare-score">

            <Sparkles size={16} />

            <strong>{score}%</strong>

            <span>Match</span>

          </div>

        </div>

        <div className="compare-trip-meta">

          <div>
            <CalendarDays size={17} />

            <span>
              {getDate(trip, "start")}
              {" – "}
              {getDate(trip, "end")}
            </span>
          </div>

          <div>
            <Users size={17} />

            <span>
              {getTravelers(trip)}{" "}
              {getTravelers(trip) === 1
                ? "Traveler"
                : "Travelers"}
            </span>
          </div>

        </div>

      </div>

    </article>
  );
}

// ======================================================
// COMPARISON VALUE
// ======================================================

function ComparisonValue({
  icon,
  title,
  leftValue,
  rightValue,
  winner,
}) {
  const Icon = icon;

  return (
    <div className="comparison-row">

      <div
        className={`comparison-value ${
          winner === "left"
            ? "winner"
            : ""
        }`}
      >

        <span className="comparison-number">
          {leftValue}
        </span>

        {winner === "left" && (
          <span className="winner-badge">
            <Trophy size={13} />
            Better
          </span>
        )}

      </div>

      <div className="comparison-label">

        <Icon size={19} />

        <span>{title}</span>

      </div>

      <div
        className={`comparison-value ${
          winner === "right"
            ? "winner"
            : ""
        }`}
      >

        {winner === "right" && (
          <span className="winner-badge">
            <Trophy size={13} />
            Better
          </span>
        )}

        <span className="comparison-number">
          {rightValue}
        </span>

      </div>

    </div>
  );
}

// ======================================================
// INTEREST ROW
// ======================================================

function InterestRow({
  interest,
  leftHas,
  rightHas,
}) {
  return (
    <div className="interest-row">

      <div
        className={`interest-status ${
          leftHas ? "available" : "not-available"
        }`}
      >

        {leftHas ? (
          <Check size={17} />
        ) : (
          <X size={17} />
        )}

      </div>

      <div className="interest-name">

        <InterestIcon interest={interest} />

        <span>{interest}</span>

      </div>

      <div
        className={`interest-status ${
          rightHas ? "available" : "not-available"
        }`}
      >

        {rightHas ? (
          <Check size={17} />
        ) : (
          <X size={17} />
        )}

      </div>

    </div>
  );
}

// ======================================================
// MAIN COMPONENT
// ======================================================

function Compare() {

  const [trips, setTrips] = useState([]);

  const [loading, setLoading] = useState(true);

  const [leftId, setLeftId] = useState("");

  const [rightId, setRightId] = useState("");

  // ====================================================
  // LOAD SAVED TRIPS
  // ====================================================

  useEffect(() => {

    let mounted = true;

    const loadTrips = async () => {

      try {

        setLoading(true);

        const response = await getTrips();

        const savedTrips =
          response?.data?.trips || [];

        if (!mounted) return;

        setTrips(savedTrips);

        if (savedTrips.length >= 2) {

          setLeftId(
            String(getTripId(savedTrips[0]))
          );

          setRightId(
            String(getTripId(savedTrips[1]))
          );

        } else if (savedTrips.length === 1) {

          setLeftId(
            String(getTripId(savedTrips[0]))
          );

        }

      } catch (error) {

        console.error(
          "Failed to load trips for comparison:",
          error
        );

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

  // ====================================================
  // SELECTED TRIPS
  // ====================================================

  const leftTrip = useMemo(() => {

    return trips.find(
      (trip) =>
        String(getTripId(trip)) ===
        String(leftId)
    );

  }, [trips, leftId]);

  const rightTrip = useMemo(() => {

    return trips.find(
      (trip) =>
        String(getTripId(trip)) ===
        String(rightId)
    );

  }, [trips, rightId]);

  // ====================================================
  // COMPARISON DATA
  // ====================================================

  const comparison = useMemo(() => {

    if (!leftTrip || !rightTrip) {
      return null;
    }

    const leftBudget =
      getBudget(leftTrip);

    const rightBudget =
      getBudget(rightTrip);

    const leftDays =
      getDays(leftTrip);

    const rightDays =
      getDays(rightTrip);

    const leftTravelers =
      getTravelers(leftTrip);

    const rightTravelers =
      getTravelers(rightTrip);

    const leftWeather =
      getWeather(leftTrip);

    const rightWeather =
      getWeather(rightTrip);

    return {
      budgetWinner:
        leftBudget < rightBudget
          ? "left"
          : rightBudget < leftBudget
          ? "right"
          : "tie",

      durationWinner:
        leftDays !== "--" &&
        rightDays !== "--" &&
        Number(leftDays) <
          Number(rightDays)
          ? "left"
          : leftDays !== "--" &&
            rightDays !== "--" &&
            Number(rightDays) <
              Number(leftDays)
          ? "right"
          : "tie",

      travelersWinner:
        leftTravelers === rightTravelers
          ? "tie"
          : null,

      leftWeather,

      rightWeather,

      leftDays,

      rightDays,

      leftBudget,

      rightBudget,

      leftTravelers,

      rightTravelers,
    };

  }, [leftTrip, rightTrip]);

  // ====================================================
  // ALL INTERESTS
  // ====================================================

  const allInterests = useMemo(() => {

    if (!leftTrip || !rightTrip) {
      return [];
    }

    const interests = [
      ...getInterests(leftTrip),
      ...getInterests(rightTrip),
    ];

    return [
      ...new Set(
        interests.map((item) =>
          String(item)
        )
      ),
    ];

  }, [leftTrip, rightTrip]);

  // ====================================================
  // RECOMMENDATION
  // ====================================================

  const recommendation = useMemo(() => {

    if (!leftTrip || !rightTrip) {
      return null;
    }

    const leftBudget =
      getBudget(leftTrip);

    const rightBudget =
      getBudget(rightTrip);

    const leftScore =
      getAiScore(leftTrip);

    const rightScore =
      getAiScore(rightTrip);

    const leftName =
      getDestination(leftTrip);

    const rightName =
      getDestination(rightTrip);

    if (leftBudget < rightBudget) {

      return {
        winner: leftName,
        text: `${leftName} is the more budget-friendly option while still maintaining a strong AI trip match.`,
      };

    }

    if (rightBudget < leftBudget) {

      return {
        winner: rightName,
        text: `${rightName} is the more budget-friendly option while still maintaining a strong AI trip match.`,
      };

    }

    if (leftScore > rightScore) {

      return {
        winner: leftName,
        text: `${leftName} has a slightly stronger AI match based on the preferences used to generate your trip.`,
      };

    }

    if (rightScore > leftScore) {

      return {
        winner: rightName,
        text: `${rightName} has a slightly stronger AI match based on the preferences used to generate your trip.`,
      };

    }

    return {
      winner: "Both trips",
      text: "Both destinations are closely matched. Your final choice can depend on the experience you want most.",
    };

  }, [leftTrip, rightTrip]);

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {

    return (
      <main className="compare-page">

        <div className="compare-loading">

          <div className="loading-spinner" />

          <h2>
            Preparing your trip comparison...
          </h2>

          <p>
            We're comparing your saved destinations.
          </p>

        </div>

      </main>
    );

  }

  // ====================================================
  // LESS THAN TWO TRIPS
  // ====================================================

  if (trips.length < 2) {

    return (
      <main className="compare-page">

        <section className="compare-empty">

          <div className="empty-icon">
            <ArrowRightLeft size={34} />
          </div>

          <h1>
            Compare Your Trips
          </h1>

          <p>
            Generate at least two AI trips to compare
            destinations, budgets, weather and
            recommendations.
          </p>

          <button
            className="compare-primary-btn"
            onClick={() =>
              window.location.href = "/planner"
            }
          >
            <Plane size={18} />
            Generate Another Trip
          </button>

        </section>

      </main>
    );

  }

  // ====================================================
  // MAIN UI
  // ====================================================

  return (

    <main className="compare-page">

      {/* ================================================
          HEADER
      ================================================= */}

      <section className="compare-hero">

        <div className="compare-hero-icon">
          <ArrowRightLeft size={32} />
        </div>

        <div>

          <span className="compare-eyebrow">
            AI TRIP COMPARISON
          </span>

          <h1>
            Compare Your Trips
          </h1>

          <p>
            Compare destinations, budgets, duration,
            weather and AI recommendations side by side.
          </p>

        </div>

      </section>

      {/* ================================================
          SELECTORS
      ================================================= */}

      <section className="compare-selector-card">

        <div className="trip-selector">

          <label>
            First Trip
          </label>

          <select
            value={leftId}
            onChange={(event) =>
              setLeftId(event.target.value)
            }
          >

            {trips.map((trip) => (

              <option
                key={getTripId(trip)}
                value={getTripId(trip)}
                disabled={
                  String(getTripId(trip)) ===
                  String(rightId)
                }
              >
                {getDestination(trip)}
              </option>

            ))}

          </select>

        </div>

        <div className="vs-badge">
          VS
        </div>

        <div className="trip-selector">

          <label>
            Second Trip
          </label>

          <select
            value={rightId}
            onChange={(event) =>
              setRightId(event.target.value)
            }
          >

            {trips.map((trip) => (

              <option
                key={getTripId(trip)}
                value={getTripId(trip)}
                disabled={
                  String(getTripId(trip)) ===
                  String(leftId)
                }
              >
                {getDestination(trip)}
              </option>

            ))}

          </select>

        </div>

      </section>

      {leftTrip && rightTrip && (

        <>

          {/* ============================================
              DESTINATION CARDS
          ============================================= */}

          <section className="compare-destinations">

            <TripHeaderCard
              trip={leftTrip}
              label="FIRST TRIP"
            />

            <div className="versus-center">
              <span>VS</span>
            </div>

            <TripHeaderCard
              trip={rightTrip}
              label="SECOND TRIP"
            />

          </section>

          {/* ============================================
              QUICK COMPARISON
          ============================================= */}

          <section className="comparison-section">

            <div className="section-heading">

              <div className="section-heading-icon">
                <TrendingDown size={22} />
              </div>

              <div>
                <h2>
                  Quick Comparison
                </h2>

                <p>
                  See the key differences at a glance.
                </p>
              </div>

            </div>

            <div className="comparison-table">

              <ComparisonValue
                icon={Wallet}
                title="Total Budget"
                leftValue={formatCurrency(
                  comparison.leftBudget
                )}
                rightValue={formatCurrency(
                  comparison.rightBudget
                )}
                winner={
                  comparison.budgetWinner
                }
              />

              <ComparisonValue
                icon={Clock3}
                title="Duration"
                leftValue={
                  comparison.leftDays === "--"
                    ? "--"
                    : `${comparison.leftDays} Days`
                }
                rightValue={
                  comparison.rightDays === "--"
                    ? "--"
                    : `${comparison.rightDays} Days`
                }
                winner={
                  comparison.durationWinner
                }
              />

              <ComparisonValue
                icon={Users}
                title="Travelers"
                leftValue={
                  comparison.leftTravelers
                }
                rightValue={
                  comparison.rightTravelers
                }
                winner={
                  comparison.travelersWinner
                }
              />

              <ComparisonValue
                icon={CloudSun}
                title="Weather"
                leftValue={`${comparison.leftWeather.temp}°C`}
                rightValue={`${comparison.rightWeather.temp}°C`}
              />

              <ComparisonValue
                icon={Sparkles}
                title="AI Match"
                leftValue={`${getAiScore(leftTrip)}%`}
                rightValue={`${getAiScore(rightTrip)}%`}
                winner={
                  getAiScore(leftTrip) >
                  getAiScore(rightTrip)
                    ? "left"
                    : getAiScore(rightTrip) >
                      getAiScore(leftTrip)
                    ? "right"
                    : "tie"
                }
              />

            </div>

          </section>

          {/* ============================================
              WEATHER
          ============================================= */}

          <section className="weather-comparison-section">

            <div className="section-heading">

              <div className="section-heading-icon">
                <CloudSun size={22} />
              </div>

              <div>
                <h2>
                  Weather Comparison
                </h2>

                <p>
                  Compare the expected weather for each trip.
                </p>
              </div>

            </div>

            <div className="weather-grid">

              <div className="weather-compare-card">

                <div className="weather-card-top">

                  <div>

                    <span>
                      {getDestination(leftTrip)}
                    </span>

                    <h3>
                      {comparison.leftWeather.temp}°C
                    </h3>

                  </div>

                  <CloudSun size={38} />

                </div>

                <p>
                  {comparison.leftWeather.condition}
                </p>

              </div>

              <div className="weather-compare-card">

                <div className="weather-card-top">

                  <div>

                    <span>
                      {getDestination(rightTrip)}
                    </span>

                    <h3>
                      {comparison.rightWeather.temp}°C
                    </h3>

                  </div>

                  <CloudSun size={38} />

                </div>

                <p>
                  {comparison.rightWeather.condition}
                </p>

              </div>

            </div>

          </section>

          {/* ============================================
              INTERESTS
          ============================================= */}

          {allInterests.length > 0 && (

            <section className="comparison-section">

              <div className="section-heading">

                <div className="section-heading-icon">
                  <Heart size={22} />
                </div>

                <div>

                  <h2>
                    Travel Interests
                  </h2>

                  <p>
                    See which interests are covered by
                    each destination.
                  </p>

                </div>

              </div>

              <div className="interest-table">

                <div className="interest-table-header">

                  <span>
                    {getDestination(leftTrip)}
                  </span>

                  <span>
                    Interest
                  </span>

                  <span>
                    {getDestination(rightTrip)}
                  </span>

                </div>

                {allInterests.map((interest) => {

                  const leftHas =
                    getInterests(leftTrip)
                      .map((item) =>
                        String(item).toLowerCase()
                      )
                      .includes(
                        String(interest).toLowerCase()
                      );

                  const rightHas =
                    getInterests(rightTrip)
                      .map((item) =>
                        String(item).toLowerCase()
                      )
                      .includes(
                        String(interest).toLowerCase()
                      );

                  return (
                    <InterestRow
                      key={interest}
                      interest={interest}
                      leftHas={leftHas}
                      rightHas={rightHas}
                    />
                  );

                })}

              </div>

            </section>

          )}

          {/* ============================================
              AI RECOMMENDATION
          ============================================= */}

          {recommendation && (

            <section className="ai-recommendation">

              <div className="recommendation-icon">
                <Sparkles size={30} />
              </div>

              <div className="recommendation-content">

                <span className="recommendation-label">
                  AI RECOMMENDATION
                </span>

                <h2>
                  Which trip is better for you?
                </h2>

                <div className="recommendation-winner">

                  <Trophy size={19} />

                  <strong>
                    {recommendation.winner}
                  </strong>

                </div>

                <p>
                  {recommendation.text}
                </p>

              </div>

            </section>

          )}

        </>

      )}

    </main>
  );
}

export default Compare;