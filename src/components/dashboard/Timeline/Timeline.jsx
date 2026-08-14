import "./Timeline.css";

import {
  Clock3,
  MapPin,
  Wallet,
  Timer,
  ArrowRight,
  CalendarDays,
  Sun,
  CloudSun,
  Moon,
  Utensils,
  Mountain,
  Camera,
  ShoppingBag,
  Hotel,
  Compass,
} from "lucide-react";


// =====================================================
// PERIOD ICON
// =====================================================

const getPeriodIcon = (period, type) => {

  const value =
    String(
      period || type || ""
    ).toLowerCase();

  if (
    value.includes("morning")
  ) {
    return <Sun size={20} />;
  }

  if (
    value.includes("afternoon")
  ) {
    return <CloudSun size={20} />;
  }

  if (
    value.includes("evening") ||
    value.includes("night")
  ) {
    return <Moon size={20} />;
  }

  if (
    value.includes("food") ||
    value.includes("restaurant") ||
    value.includes("meal")
  ) {
    return <Utensils size={20} />;
  }

  if (
    value.includes("nature") ||
    value.includes("adventure")
  ) {
    return <Mountain size={20} />;
  }

  if (
    value.includes("shopping")
  ) {
    return <ShoppingBag size={20} />;
  }

  if (
    value.includes("hotel")
  ) {
    return <Hotel size={20} />;
  }

  if (
    value.includes("travel")
  ) {
    return <Compass size={20} />;
  }

  return <Camera size={20} />;
};


// =====================================================
// FORMAT DATE
// =====================================================

const formatDate = (dateValue) => {

  if (!dateValue) {
    return null;
  }

  const date =
    new Date(dateValue);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return null;
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
};


// =====================================================
// NORMALIZE ACTIVITY
// =====================================================

const normalizeActivity = (
  activity
) => {

  if (
    typeof activity === "string"
  ) {

    return {
      title: activity,
      description: "",
      time: null,
      period: null,
      location: null,
      duration: null,
      cost: null,
      type: null,
    };
  }

  return {
    title:
      activity?.title ||
      activity?.activity ||
      activity?.name ||
      activity?.description ||
      "Travel activity",

    description:
      activity?.description ||
      "",

    time:
      activity?.time ||
      null,

    period:
      activity?.period ||
      null,

    location:
      activity?.location ||
      null,

    duration:
      activity?.duration ||
      null,

    cost:
      activity?.cost ||
      null,

    type:
      activity?.type ||
      null,
  };
};


// =====================================================
// TIMELINE
// =====================================================

function Timeline({
  itinerary = [],
}) {

  const normalizedDays =
    Array.isArray(itinerary)
      ? itinerary
      : [];

  return (

    <section className="timeline-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="timeline-header">

        <div>

          <span className="section-tag">
            📅 AI Itinerary Planner
          </span>

          <h2>
            Your Travel Itinerary
          </h2>

          <p>
            A personalized day-by-day schedule
            designed around your destination,
            interests and trip duration.
          </p>

        </div>

        <div className="timeline-header-icon">

          <CalendarDays
            size={30}
          />

        </div>

      </div>


      {/* =================================================
          EMPTY
      ================================================= */}

      {normalizedDays.length === 0 ? (

        <div className="empty-recommendation">

          <div className="empty-itinerary-icon">
            📅
          </div>

          <h3>
            No itinerary available
          </h3>

          <p>
            Generate a trip to create your
            personalized itinerary.
          </p>

        </div>

      ) : (

        <div className="timeline-days">

          {normalizedDays.map(
            (day, dayIndex) => {

              const dayNumber =
                day?.day ||
                dayIndex + 1;

              const title =
                day?.title ||
                `Day ${dayNumber}`;

              const date =
                formatDate(
                  day?.date
                );

              const activities =
                Array.isArray(
                  day?.activities
                )
                  ? day.activities
                  : [];

              return (

                <div
                  className="timeline-day"
                  key={
                    `${dayNumber}-${dayIndex}`
                  }
                >

                  {/* =================================
                      DAY HEADER
                  ================================= */}

                  <div className="timeline-day-header">

                    <div className="day-number">

                      <span>
                        DAY
                      </span>

                      <strong>
                        {dayNumber}
                      </strong>

                    </div>

                    <div className="day-heading">

                      <h3>
                        {title}
                      </h3>

                      {date && (

                        <div className="day-date">

                          <CalendarDays
                            size={15}
                          />

                          {date}

                        </div>

                      )}

                    </div>

                  </div>


                  {/* =================================
                      ACTIVITIES
                  ================================= */}

                  {activities.length === 0 ? (

                    <div className="day-empty">

                      No activities planned
                      for this day.

                    </div>

                  ) : (

                    <div className="timeline-list">

                      {activities.map(
                        (
                          rawActivity,
                          activityIndex
                        ) => {

                          const activity =
                            normalizeActivity(
                              rawActivity
                            );

                          const isLast =
                            activityIndex ===
                            activities.length - 1;

                          return (

                            <div
                              className="timeline-item"
                              key={
                                `${dayNumber}-${activityIndex}`
                              }
                            >

                              {/* LEFT */}

                              <div className="timeline-left">

                                <div className="timeline-dot">

                                  {getPeriodIcon(
                                    activity.period,
                                    activity.type
                                  )}

                                </div>

                                {!isLast && (

                                  <div className="timeline-line" />

                                )}

                              </div>


                              {/* CARD */}

                              <article className="timeline-card">

                                {/* TIME */}

                                {activity.time && (

                                  <div className="timeline-time">

                                    <Clock3
                                      size={15}
                                    />

                                    {activity.time}

                                    {activity.period && (

                                      <span>
                                        •{" "}
                                        {activity.period}
                                      </span>

                                    )}

                                  </div>

                                )}


                                <div className="timeline-content">

                                  <div className="timeline-icon">

                                    {getPeriodIcon(
                                      activity.period,
                                      activity.type
                                    )}

                                  </div>


                                  <div className="timeline-info">

                                    <h3>
                                      {activity.title}
                                    </h3>


                                    {activity.description && (

                                      <p className="timeline-description">

                                        {activity.description}

                                      </p>

                                    )}


                                    {activity.location && (

                                      <div className="timeline-location">

                                        <MapPin
                                          size={15}
                                        />

                                        <span>
                                          {activity.location}
                                        </span>

                                      </div>

                                    )}


                                    {(activity.duration ||
                                      activity.cost ||
                                      activity.type) && (

                                      <div className="timeline-meta">

                                        {activity.duration && (

                                          <span>

                                            <Timer
                                              size={15}
                                            />

                                            {activity.duration}

                                          </span>

                                        )}

                                        {activity.cost && (

                                          <span>

                                            <Wallet
                                              size={15}
                                            />

                                            {activity.cost}

                                          </span>

                                        )}

                                        {activity.type && (

                                          <span>

                                            <Compass
                                              size={15}
                                            />

                                            {activity.type}

                                          </span>

                                        )}

                                      </div>

                                    )}

                                  </div>


                                  <button
                                    className="timeline-btn"
                                    type="button"
                                  >

                                    Details

                                    <ArrowRight
                                      size={16}
                                    />

                                  </button>

                                </div>

                              </article>

                            </div>

                          );
                        }
                      )}

                    </div>

                  )}

                </div>

              );
            }
          )}

        </div>

      )}

    </section>
  );
}

export default Timeline;