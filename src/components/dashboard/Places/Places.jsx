import "./Places.css";

import {
  MapPin,
  Star,
  Clock3,
  Navigation,
  ExternalLink,
  Landmark,
  TreePine,
  Building2,
  Mountain,
  Info,
} from "lucide-react";

import PlacesMap from "./PlacesMap";

function Places({ places = [] }) {
  const safePlaces = Array.isArray(places)
    ? places
    : [];

  // =====================================================
  // CATEGORY ICON
  // =====================================================

  const getCategoryIcon = (category) => {
    const value = String(category || "").toLowerCase();

    if (
      value.includes("nature") ||
      value.includes("park")
    ) {
      return <TreePine size={18} />;
    }

    if (
      value.includes("viewpoint") ||
      value.includes("mountain")
    ) {
      return <Mountain size={18} />;
    }

    if (
      value.includes("museum") ||
      value.includes("gallery")
    ) {
      return <Building2 size={18} />;
    }

    if (value.includes("historic")) {
      return <Landmark size={18} />;
    }

    return <Landmark size={18} />;
  };

  // =====================================================
  // GOOGLE MAPS URL
  // =====================================================

  const getMapsUrl = (place) => {
    if (
      place?.latitude === undefined ||
      place?.latitude === null ||
      place?.longitude === undefined ||
      place?.longitude === null
    ) {
      return null;
    }

    return (
      "https://www.google.com/maps/search/?api=1" +
      `&query=${place.latitude},${place.longitude}`
    );
  };

  // =====================================================
  // EMPTY STATE
  // =====================================================

  if (safePlaces.length === 0) {
    return (
      <section className="places-page">

        {/* =============================================
            HEADER
        ============================================= */}

        <div className="places-header">

          <div>

            <span className="places-tag">
              📍 AI Destination Guide
            </span>

            <h2>
              Places to Explore
            </h2>

            <p>
              Discover real attractions and interesting
              places around your destination.
            </p>

          </div>

        </div>


        {/* =============================================
            EMPTY MAP
        ============================================= */}

        <PlacesMap
          places={[]}
        />


        {/* =============================================
            EMPTY STATE
        ============================================= */}

        <div className="places-empty">

          <div className="places-empty-icon">

            <MapPin size={30} />

          </div>

          <h3>
            No places found
          </h3>

          <p>
            We couldn't find any places for this
            destination right now.
          </p>

        </div>

      </section>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <section className="places-page">

      {/* ===============================================
          HEADER
      =============================================== */}

      <div className="places-header">

        <div>

          <span className="places-tag">
            📍 AI Destination Guide
          </span>

          <h2>
            Places to Explore
          </h2>

          <p>
            Real places discovered around your destination
            using OpenStreetMap.
          </p>

        </div>


        {/* =============================================
            PLACE COUNT
        ============================================= */}

        <div className="places-count">

          <MapPin size={17} />

          <span>
            {safePlaces.length} Places
          </span>

        </div>

      </div>


      {/* ===============================================
          INTERACTIVE MAP
      =============================================== */}

      <PlacesMap
        places={safePlaces}
      />


      {/* ===============================================
          PLACE GRID
      =============================================== */}

      <div className="places-grid">

        {safePlaces.map((place, index) => {

          const mapsUrl =
            getMapsUrl(place);

          const rating =
            place?.rating;

          return (
            <article
              className="place-card"
              key={
                place?.id ||
                `${place?.name}-${index}`
              }
            >

              {/* =====================================
                  CARD TOP
              ===================================== */}

              <div className="place-card-top">

                <div className="place-icon">

                  {getCategoryIcon(
                    place?.category
                  )}

                </div>


                {/* =================================
                    RATING
                ================================= */}

                {rating !== null &&
                rating !== undefined ? (

                  <div className="place-rating">

                    <Star
                      size={14}
                      fill="currentColor"
                    />

                    <span>
                      {rating}
                    </span>

                  </div>

                ) : (

                  <div className="place-rating unavailable">

                    <Info size={13} />

                    <span>
                      No rating
                    </span>

                  </div>

                )}

              </div>


              {/* =====================================
                  PLACE CONTENT
              ===================================== */}

              <div className="place-content">

                {/* PLACE NAME */}

                <h3>
                  {place?.name ||
                    "Unnamed Place"}
                </h3>


                {/* CATEGORY */}

                <div className="place-category">

                  {getCategoryIcon(
                    place?.category
                  )}

                  <span>
                    {place?.category ||
                      "Attraction"}
                  </span>

                </div>


                {/* DESCRIPTION */}

                {place?.description && (

                  <p className="place-description">
                    {place.description}
                  </p>

                )}


                {/* LOCATION */}

                <div className="place-detail">

                  <MapPin size={16} />

                  <span>
                    {place?.address ||
                      place?.location ||
                      "Location unavailable"}
                  </span>

                </div>


                {/* BEST TIME */}

                {place?.bestTime && (

                  <div className="place-detail">

                    <Clock3 size={16} />

                    <span>

                      Best time:

                      <strong>
                        {" "}
                        {place.bestTime}
                      </strong>

                    </span>

                  </div>

                )}


                {/* OPENING HOURS */}

                {place?.openingHours && (

                  <div className="place-detail">

                    <Clock3 size={16} />

                    <span>
                      {place.openingHours}
                    </span>

                  </div>

                )}

              </div>


              {/* =====================================
                  ACTIONS
              ===================================== */}

              <div className="place-actions">

                {/* =================================
                    GOOGLE MAPS
                ================================= */}

                {mapsUrl && (

                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="place-map-btn"
                  >

                    <Navigation size={16} />

                    View on Map

                  </a>

                )}


                {/* =================================
                    WEBSITE
                ================================= */}

                {place?.website && (

                  <a
                    href={place.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="place-website-btn"
                  >

                    <ExternalLink size={16} />

                    Website

                  </a>

                )}

              </div>

            </article>
          );
        })}

      </div>

    </section>
  );
}

export default Places;