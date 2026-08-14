import "./TripCard.css";

import {
  CalendarDays,
  Users,
  Wallet,
  Heart,
  Eye,
  Pencil,
  Trash2,
  Sparkles,
  MapPin,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import getDestinationImage from "../../utils/getDestinationImage";

function TripCard({
  trip,
  onDelete,
  onView,
}) {
  const navigate = useNavigate();

  // =====================================================
  // EDIT TRIP
  // =====================================================

  const handleEdit = () => {
    navigate(`/edit-trip/${trip.id}`);
  };

  // =====================================================
  // GET REAL AI MATCH SCORE
  // =====================================================

  const getAIMatchScore = () => {
    if (!trip) {
      return 0;
    }

    // ---------------------------------------------------
    // 1. Direct matchScore
    // ---------------------------------------------------

    if (
      trip.matchScore !== undefined &&
      trip.matchScore !== null
    ) {
      return Number(trip.matchScore);
    }

    // ---------------------------------------------------
    // 2. itinerary.matchScore
    // ---------------------------------------------------

    if (
      trip.itinerary &&
      typeof trip.itinerary === "object" &&
      trip.itinerary.matchScore !== undefined &&
      trip.itinerary.matchScore !== null
    ) {
      return Number(
        trip.itinerary.matchScore
      );
    }

    // ---------------------------------------------------
    // 3. itinerary stored as JSON string
    // ---------------------------------------------------

    if (
      typeof trip.itinerary === "string"
    ) {
      try {
        const parsedItinerary =
          JSON.parse(trip.itinerary);

        if (
          parsedItinerary?.matchScore !==
            undefined &&
          parsedItinerary?.matchScore !== null
        ) {
          return Number(
            parsedItinerary.matchScore
          );
        }
      } catch (error) {
        console.warn(
          "Could not parse trip itinerary:",
          error
        );
      }
    }

    // ---------------------------------------------------
    // 4. Existing database ai_score
    // ---------------------------------------------------

    if (
      trip.ai_score !== undefined &&
      trip.ai_score !== null
    ) {
      return Number(trip.ai_score);
    }

    // ---------------------------------------------------
    // No score available
    // ---------------------------------------------------

    return 0;
  };

  const aiScore = getAIMatchScore();

  return (
    <div className="trip-card">

      {/* =================================================
          TRIP IMAGE
      ================================================= */}

      <div className="trip-image">

        <img
          src={getDestinationImage(
            trip.destination
          )}
          alt={trip.destination}
        />

        {/* ===============================================
            FAVORITE
        =============================================== */}

        <button
          className="favorite-btn"
          type="button"
          aria-label={`Favorite ${trip.destination}`}
        >
          <Heart size={18} />
        </button>


        {/* ===============================================
            REAL AI SCORE
        =============================================== */}

        <div className="score-badge">

          <Sparkles size={15} />

          {aiScore > 0
            ? `${aiScore}% Match`
            : "AI Match Pending"}

        </div>

      </div>


      {/* =================================================
          TRIP CONTENT
      ================================================= */}

      <div className="trip-content">

        {/* ===============================================
            DESTINATION
        =============================================== */}

        <h2>
          {trip.destination}
        </h2>


        {/* ===============================================
            TRIP INFORMATION
        =============================================== */}

        <div className="trip-info">

          {/* DATE */}

          <span>

            <CalendarDays size={16} />

            {trip.start_date
              ? new Date(
                  trip.start_date
                ).toLocaleDateString()
              : "--"}

            {" - "}

            {trip.end_date
              ? new Date(
                  trip.end_date
                ).toLocaleDateString()
              : "--"}

          </span>


          {/* TRAVELERS */}

          <span>

            <Users size={16} />

            {trip.travelers || 0}

            {" "}

            {Number(trip.travelers) === 1
              ? "Traveler"
              : "Travelers"}

          </span>


          {/* BUDGET */}

          <span>

            <Wallet size={16} />

            ₹
            {Number(
              trip.budget || 0
            ).toLocaleString()}

          </span>

        </div>


        {/* ===============================================
            TRIP TYPE
        =============================================== */}

        <div className="trip-location">

          <MapPin size={16} />

          AI Generated Itinerary

        </div>


        {/* ===============================================
            ACTIONS
        =============================================== */}

        <div className="trip-actions">

          {/* VIEW */}

          <button
            className="view-btn"
            type="button"
            onClick={() =>
              onView(trip)
            }
          >

            <Eye size={17} />

            View

          </button>


          {/* EDIT */}

          <button
            className="edit-btn"
            type="button"
            onClick={handleEdit}
          >

            <Pencil size={17} />

            Edit

          </button>


          {/* DELETE */}

          <button
            className="delete-btn"
            type="button"
            onClick={() =>
              onDelete(trip.id)
            }
          >

            <Trash2 size={17} />

            Delete

          </button>

        </div>

      </div>

    </div>
  );
}

export default TripCard;