import "./SummaryCard.css";

import {
  MapPin,
  CalendarDays,
  Users,
  Wallet,
  Download,
  Share2,
  Heart,
  Sparkles,
  Sun,
} from "lucide-react";

import { useState } from "react";

import generateTripPDF from "../../../utils/generateTripPDF";

function SummaryCard({ trip }) {
  if (!trip) {
    return null;
  }

  const weather = trip.weather || {};
  const interests = trip.interests || [];

  // ==========================================
  // AI SCORE
  // ==========================================

  const aiScore =
    trip.aiScore ??
    trip.ai_score ??
    trip.itinerary?.aiScore ??
    0;

  // ==========================================
  // SAVE STATE
  // ==========================================

  const [saved, setSaved] = useState(() => {
    try {
      const savedTrips = JSON.parse(
        localStorage.getItem("savedTrips") || "[]"
      );

      return savedTrips.some(
        (item) => item.id === trip.id
      );
    } catch {
      return false;
    }
  });

  // ==========================================
  // PDF DOWNLOAD
  // ==========================================

  const handleDownloadPDF = () => {
    console.log("Generating NEW PDF...");
    console.log("Trip data:", trip);

    generateTripPDF(trip);
  };

  // ==========================================
  // SHARE TRIP
  // ==========================================

  const handleShare = async () => {
    const shareText = `
✈️ AI Travel Planner

📍 Destination: ${trip.destination}

📅 ${trip.startDate} - ${trip.endDate}

👥 Travelers: ${trip.travelers}

💰 Budget: ₹${Number(
      trip.budget || 0
    ).toLocaleString()}

🤖 AI Trip Match: ${aiScore}%

Plan your trip with AI Travel Planner.
    `.trim();

    try {
      // Native sharing
      if (navigator.share) {
        await navigator.share({
          title: `${trip.destination} - AI Travel Planner`,
          text: shareText,
        });

        return;
      }

      // Clipboard fallback
      await navigator.clipboard.writeText(
        shareText
      );

      alert(
        "Trip details copied to clipboard!"
      );
    } catch (error) {
      // User cancelled sharing
      if (error?.name === "AbortError") {
        return;
      }

      console.error(
        "Share failed:",
        error
      );

      alert(
        "Unable to share the trip right now."
      );
    }
  };

  // ==========================================
  // SAVE TRIP
  // ==========================================

  const handleSave = () => {
    try {
      const existingTrips = JSON.parse(
        localStorage.getItem("savedTrips") || "[]"
      );

      // ========================================
      // REMOVE IF ALREADY SAVED
      // ========================================

      if (saved) {
        const updatedTrips =
          existingTrips.filter(
            (item) => item.id !== trip.id
          );

        localStorage.setItem(
          "savedTrips",
          JSON.stringify(updatedTrips)
        );

        setSaved(false);

        return;
      }

      // ========================================
      // SAVE NEW TRIP
      // ========================================

      const filteredTrips =
        existingTrips.filter(
          (item) => item.id !== trip.id
        );

      const updatedTrips = [
        trip,
        ...filteredTrips,
      ];

      localStorage.setItem(
        "savedTrips",
        JSON.stringify(updatedTrips)
      );

      setSaved(true);

      console.log(
        "Trip saved successfully:",
        trip
      );
    } catch (error) {
      console.error(
        "Save trip failed:",
        error
      );

      alert(
        "Unable to save this trip."
      );
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <section className="summary-card">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="summary-header">

        <div>

          <div className="summary-location">

            <MapPin size={20} />

            <h2>
              {trip.destination}
            </h2>

          </div>

          <div className="summary-meta">

            <span>

              <CalendarDays size={16} />

              {trip.startDate}

              {" - "}

              {trip.endDate}

            </span>

            <span>

              <Users size={16} />

              {trip.travelers} Travelers

            </span>

            <span>

              {trip.days ||
                calculateDays(
                  trip.startDate,
                  trip.endDate
                )}

              {" Days"}

            </span>

          </div>

        </div>

        {/* ==================================
            ACTION BUTTONS
        ================================== */}

        <div className="summary-buttons">

          {/* PDF */}

          <button
            type="button"
            onClick={handleDownloadPDF}
            title="Download trip as PDF"
          >

            <Download size={18} />

            PDF

          </button>


          {/* SHARE */}

          <button
            type="button"
            onClick={handleShare}
            title="Share this trip"
          >

            <Share2 size={18} />

            Share

          </button>


          {/* SAVE */}

          <button
            type="button"
            onClick={handleSave}
            className={
              saved
                ? "saved"
                : ""
            }
            title={
              saved
                ? "Remove from saved trips"
                : "Save this trip"
            }
          >

            <Heart
              size={18}
              fill={
                saved
                  ? "currentColor"
                  : "none"
              }
            />

            {saved
              ? "Saved"
              : "Save"}

          </button>

        </div>

      </div>


      {/* ======================================
          SUMMARY BODY
      ====================================== */}

      <div className="summary-body">

        {/* ==================================
            AI SCORE
        ================================== */}

        <div className="ai-score-card">

          <div className="score-circle">

            {aiScore}%

          </div>

          <div>

            <div className="score-title">

              <Sparkles size={18} />

              AI Trip Match

            </div>

            <p>
              {trip.itinerary?.summary ||
                "This itinerary was generated specifically for your travel preferences."}
            </p>

          </div>

        </div>


        {/* ==================================
            TRIP OVERVIEW
        ================================== */}

        <div className="trip-overview">

          {/* BUDGET */}

          <div className="overview-box">

            <Wallet size={20} />

            <h4>
              Budget
            </h4>

            <h3>

              ₹
              {Number(
                trip.budget || 0
              ).toLocaleString()}

            </h3>

          </div>


          {/* WEATHER */}

          <div className="overview-box">

            <Sun size={20} />

            <h4>
              Weather
            </h4>

            <h3>

              {weather.temp ??
                weather.temperature ??
                "--"}

              °C

            </h3>

            <small>

              {weather.condition ||
                weather.description ||
                "Unavailable"}

            </small>

          </div>

        </div>

      </div>


      {/* ======================================
          INTEREST TAGS
      ====================================== */}

      <div className="interest-tags">

        {interests.map(
          (interest, index) => (

            <span
              key={`${interest}-${index}`}
            >

              {interest}

            </span>

          )
        )}

      </div>

    </section>
  );
}


// ==========================================
// CALCULATE DAYS
// ==========================================

function calculateDays(
  startDate,
  endDate
) {
  if (
    !startDate ||
    !endDate
  ) {
    return "--";
  }

  const start =
    new Date(startDate);

  const end =
    new Date(endDate);

  const difference =
    Math.ceil(
      (end - start) /
        (1000 * 60 * 60 * 24)
    );

  return difference > 0
    ? difference
    : "--";
}

export default SummaryCard;