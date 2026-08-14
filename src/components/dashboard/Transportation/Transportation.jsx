import "./Transportation.css";

import {
  Plane,
  TrainFront,
  Bus,
  Car,
  MapPin,
  CalendarDays,
  Users,
  ArrowRight,
  ExternalLink,
  Ticket,
  Sparkles,
} from "lucide-react";

import { useState } from "react";

function Transportation({ trip }) {
  const [transportType, setTransportType] = useState("flight");
  const [origin, setOrigin] = useState("");

  if (!trip) {
    return null;
  }

  const destination =
    trip.destination || "";

  const startDate =
    trip.startDate ||
    trip.start_date ||
    "";

  const travelers =
    trip.travelers || 1;

  // =====================================================
  // TRANSPORT OPTIONS
  // =====================================================

  const transportOptions = [
    {
      id: "flight",
      label: "Flights",
      icon: Plane,
      description: "Search flights to your destination",
      color: "blue",
    },
    {
      id: "train",
      label: "Trains",
      icon: TrainFront,
      description: "Find trains for your journey",
      color: "green",
    },
    {
      id: "bus",
      label: "Buses",
      icon: Bus,
      description: "Search comfortable bus routes",
      color: "orange",
    },
    {
      id: "cab",
      label: "Cabs",
      icon: Car,
      description: "Find local cab options",
      color: "purple",
    },
  ];

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formattedDate = startDate
    ? new Date(startDate).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      )
    : "Select date";

  // =====================================================
  // BOOKING LINKS
  // =====================================================

  const getBookingUrl = () => {
    const from =
      origin.trim() || "your city";

    const to =
      destination.trim();

    // -----------------------------------------------
    // FLIGHTS
    // -----------------------------------------------

    if (transportType === "flight") {
      const query = encodeURIComponent(
        `Flights from ${from} to ${to} on ${formattedDate}`
      );

      return `https://www.google.com/travel/flights?q=${query}`;
    }

    // -----------------------------------------------
    // TRAINS
    // -----------------------------------------------

    if (transportType === "train") {
      return "https://www.irctc.co.in/";
    }

    // -----------------------------------------------
    // BUS
    // -----------------------------------------------

    if (transportType === "bus") {
      return "https://www.redbus.in/";
    }

    // -----------------------------------------------
    // CAB
    // -----------------------------------------------

    if (transportType === "cab") {
      return "https://m.uber.com/";
    }

    return "https://www.google.com/";
  };

  // =====================================================
  // OPEN BOOKING WEBSITE
  // =====================================================

  const handleSearch = () => {
    if (!origin.trim()) {
      alert(
        "Please enter your starting city first."
      );

      return;
    }

    const bookingUrl =
      getBookingUrl();

    window.open(
      bookingUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <section className="transportation-section">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="transportation-header">

        <div className="transportation-heading">

          <div className="transportation-icon">
            <Ticket size={28} />
          </div>

          <div>

            <span className="transportation-eyebrow">
              <Sparkles size={13} />
              SMART TRAVEL BOOKING
            </span>

            <h2>
              Book Your Transportation
            </h2>

            <p>
              Find flights, trains, buses and
              cabs for your journey.
            </p>

          </div>

        </div>

        <div className="transportation-ai-badge">
          <Sparkles size={14} />
          Trip Based
        </div>

      </div>


      {/* =================================================
          TRIP SUMMARY
      ================================================= */}

      <div className="transportation-trip-info">

        <div className="transport-info-item">

          <div className="transport-info-icon">
            <MapPin size={18} />
          </div>

          <div>
            <span>Destination</span>
            <strong>
              {destination || "Not available"}
            </strong>
          </div>

        </div>


        <div className="transport-info-item">

          <div className="transport-info-icon">
            <CalendarDays size={18} />
          </div>

          <div>
            <span>Travel Date</span>
            <strong>
              {formattedDate}
            </strong>
          </div>

        </div>


        <div className="transport-info-item">

          <div className="transport-info-icon">
            <Users size={18} />
          </div>

          <div>
            <span>Travelers</span>
            <strong>
              {travelers}
            </strong>
          </div>

        </div>

      </div>


      {/* =================================================
          STARTING CITY
      ================================================= */}

      <div className="transportation-form">

        <div className="transport-input-group">

          <label htmlFor="transport-origin">
            Starting City
          </label>

          <div className="transport-input-wrapper">

            <MapPin size={18} />

            <input
              id="transport-origin"
              type="text"
              value={origin}
              onChange={(event) =>
                setOrigin(event.target.value)
              }
              placeholder="Enter your starting city"
            />

          </div>

        </div>

      </div>


      {/* =================================================
          TRANSPORT TYPE
      ================================================= */}

      <div className="transport-types">

        {transportOptions.map(
          (option) => {

            const Icon =
              option.icon;

            const active =
              transportType === option.id;

            return (
              <button
                type="button"
                key={option.id}
                className={`transport-type-card ${
                  active
                    ? "active"
                    : ""
                } ${option.color}`}
                onClick={() =>
                  setTransportType(
                    option.id
                  )
                }
              >

                <div className="transport-type-icon">

                  <Icon size={24} />

                </div>

                <div className="transport-type-content">

                  <strong>
                    {option.label}
                  </strong>

                  <span>
                    {option.description}
                  </span>

                </div>

                {active && (
                  <div className="transport-selected">
                    ✓
                  </div>
                )}

              </button>
            );
          }
        )}

      </div>


      {/* =================================================
          BOOKING ACTION
      ================================================= */}

      <div className="transportation-action">

        <div className="transport-action-text">

          <div className="transport-action-icon">
            <Ticket size={20} />
          </div>

          <div>

            <strong>
              Ready to travel?
            </strong>

            <p>
              Search real booking options
              for your journey.
            </p>

          </div>

        </div>

        <button
          type="button"
          className="transport-book-btn"
          onClick={handleSearch}
        >

          Search & Book

          <ArrowRight size={18} />

          <ExternalLink size={15} />

        </button>

      </div>


      {/* =================================================
          NOTE
      ================================================= */}

      <div className="transportation-note">

        <span>ℹ️</span>

        <p>
          You will be redirected to the
          selected transportation platform
          to complete your booking securely.
        </p>

      </div>

    </section>
  );
}

export default Transportation;