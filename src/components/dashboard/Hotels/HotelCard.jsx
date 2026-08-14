import "./HotelCard.css";

import {
  MapPin,
  Star,
  Heart,
  Wifi,
  Coffee,
  Waves,
  Dumbbell,
  Utensils,
  Car,
  ArrowRight,
  ExternalLink,
  Navigation,
} from "lucide-react";

const amenityIcons = {
  "Free WiFi": Wifi,
  Breakfast: Coffee,
  Pool: Waves,
  Spa: Star,
  Gym: Dumbbell,
  Restaurant: Utensils,
  Parking: Car,
};

// =====================================================
// MAKE SURE URL IS EXTERNAL
// =====================================================

const normalizeUrl = (url) => {
  if (!url) return null;

  const value = String(url).trim();

  if (!value) return null;

  // Already a proper URL
  if (
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  // Website like www.hotel.com
  if (value.startsWith("www.")) {
    return `https://${value}`;
  }

  // Domain like hotel.com
  if (
    value.includes(".") &&
    !value.includes(" ")
  ) {
    return `https://${value}`;
  }

  return null;
};

// =====================================================
// GOOGLE MAPS URL
// =====================================================

const getMapsUrl = (hotel) => {
  if (hotel?.mapsUrl) {
    return hotel.mapsUrl;
  }

  if (
    hotel?.latitude !== undefined &&
    hotel?.longitude !== undefined
  ) {
    return (
      "https://www.google.com/maps/search/?api=1" +
      `&query=${hotel.latitude},${hotel.longitude}`
    );
  }

  if (hotel?.name) {
    return (
      "https://www.google.com/maps/search/?api=1" +
      `&query=${encodeURIComponent(
        hotel.name +
          " " +
          (hotel.location || "")
      )}`
    );
  }

  return null;
};

// =====================================================
// HOTEL WEBSITE / BOOKING URL
// =====================================================

const getHotelWebsite = (hotel) => {
  return (
    normalizeUrl(hotel?.website) ||
    normalizeUrl(hotel?.bookingUrl) ||
    normalizeUrl(hotel?.booking) ||
    null
  );
};

// =====================================================
// HOTEL CARD
// =====================================================

function HotelCard({
  hotels = [],
}) {

  const normalizedHotels =
    Array.isArray(hotels)
      ? hotels
      : [];

  return (
    <section className="hotel-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="hotel-header">

        <div>

          <span className="section-tag">
            🏨 AI Hotel Recommendations
          </span>

          <h2>
            Recommended Hotels
          </h2>

          <p>
            Real hotels discovered around
            your destination.
          </p>

        </div>

      </div>


      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {normalizedHotels.length === 0 ? (

        <div className="empty-recommendation">

          <div className="empty-hotel-icon">
            🏨
          </div>

          <h3>
            No hotel recommendations available
          </h3>

          <p>
            We couldn't find hotels for
            this destination right now.
          </p>

        </div>

      ) : (

        <div className="hotel-grid">

          {normalizedHotels.map(
            (hotel, index) => {

              const name =
                hotel?.name ||
                "Recommended Hotel";

              const rating =
                hotel?.rating;

              const location =
                hotel?.location ||
                hotel?.address ||
                "Location unavailable";

              const price =
                hotel?.price ||
                "Price unavailable";

              const amenities =
                Array.isArray(
                  hotel?.amenities
                )
                  ? hotel.amenities
                  : [];

              const image =
                hotel?.image ||
                null;

              const website =
                getHotelWebsite(hotel);

              const mapsUrl =
                getMapsUrl(hotel);

              return (

                <article
                  className="hotel-card"
                  key={
                    hotel?.id ||
                    `${name}-${index}`
                  }
                >

                  {/* =================================
                      IMAGE
                  ================================= */}

                  <div className="hotel-image">

                    {image ? (

                      <img
                        src={image}
                        alt={name}
                        loading="lazy"
                      />

                    ) : (

                      <div className="hotel-placeholder">

                        <span>
                          🏨
                        </span>

                        <small>
                          Real hotel
                        </small>

                      </div>

                    )}


                    <button
                      className="favorite-btn"
                      type="button"
                      aria-label={`Favorite ${name}`}
                    >
                      <Heart size={18} />
                    </button>


                    {rating !== null &&
                    rating !== undefined && (

                      <div className="rating-badge">

                        <Star
                          size={14}
                          fill="#FACC15"
                          color="#FACC15"
                        />

                        <span>
                          {rating}
                        </span>

                      </div>

                    )}

                  </div>


                  {/* =================================
                      CONTENT
                  ================================= */}

                  <div className="hotel-content">

                    <h3>
                      {name}
                    </h3>


                    {/* LOCATION */}

                    <div className="hotel-location">

                      <MapPin size={16} />

                      <span>
                        {location}
                      </span>

                    </div>


                    {/* SOURCE */}

                    <div className="hotel-source">

                      <span className="source-dot"></span>

                      <span>
                        Real place
                      </span>

                      <span>
                        •
                      </span>

                      <span>
                        OpenStreetMap
                      </span>

                    </div>


                    {/* DISTANCE */}

                    {hotel?.distance && (

                      <div className="hotel-distance">

                        <Navigation
                          size={15}
                        />

                        <span>
                          {hotel.distance}
                          {" "}from destination
                        </span>

                      </div>

                    )}


                    {/* PRICE */}

                    <div className="hotel-price">

                      {typeof price ===
                      "number"
                        ? `₹${price.toLocaleString()}`
                        : price}

                    </div>


                    {/* AMENITIES */}

                    {amenities.length > 0 && (

                      <div className="amenities">

                        {amenities.map(
                          (item, itemIndex) => {

                            const Icon =
                              amenityIcons[
                                item
                              ] || Star;

                            return (

                              <div
                                className="amenity"
                                key={
                                  `${item}-${itemIndex}`
                                }
                              >

                                <Icon
                                  size={15}
                                />

                                <span>
                                  {item}
                                </span>

                              </div>

                            );
                          }
                        )}

                      </div>

                    )}


                    {/* =================================
                        ACTIONS
                    ================================= */}

                    <div className="hotel-actions">

                      {website ? (

                        <a
                          href={website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hotel-btn"
                        >

                          Visit Hotel

                          <ExternalLink
                            size={17}
                          />

                        </a>

                      ) : mapsUrl ? (

                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hotel-btn"
                        >

                          View Hotel

                          <ArrowRight
                            size={18}
                          />

                        </a>

                      ) : (

                        <button
                          className="hotel-btn disabled"
                          type="button"
                          disabled
                        >

                          Website unavailable

                        </button>

                      )}

                    </div>


                    {/* MAP LINK */}

                    {website &&
                    mapsUrl && (

                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hotel-map-link"
                      >

                        <MapPin
                          size={15}
                        />

                        View location on Google Maps

                      </a>

                    )}

                  </div>

                </article>

              );
            }
          )}

        </div>

      )}

    </section>
  );
}

export default HotelCard;