import "./RestaurantCard.css";

import {
  Star,
  MapPin,
  ChefHat,
  IndianRupee,
  ArrowRight,
  Utensils,
  ExternalLink,
  Navigation,
} from "lucide-react";

// =====================================================
// NORMALIZE URL
// =====================================================

const normalizeUrl = (url) => {

  if (!url) return null;

  const value =
    String(url).trim();

  if (!value) return null;

  if (
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  if (value.startsWith("www.")) {
    return `https://${value}`;
  }

  if (
    value.includes(".") &&
    !value.includes(" ")
  ) {
    return `https://${value}`;
  }

  return null;
};

// =====================================================
// MAP URL
// =====================================================

const getMapsUrl = (restaurant) => {

  if (restaurant?.mapsUrl) {
    return restaurant.mapsUrl;
  }

  if (
    restaurant?.latitude !== undefined &&
    restaurant?.longitude !== undefined
  ) {

    return (
      "https://www.google.com/maps/search/?api=1" +
      `&query=${restaurant.latitude},${restaurant.longitude}`
    );
  }

  if (restaurant?.name) {

    return (
      "https://www.google.com/maps/search/?api=1" +
      `&query=${encodeURIComponent(
        restaurant.name +
          " " +
          (restaurant.location ||
            restaurant.address ||
            "")
      )}`
    );
  }

  return null;
};

// =====================================================
// WEBSITE
// =====================================================

const getRestaurantWebsite =
  (restaurant) => {

    return (
      normalizeUrl(
        restaurant?.website
      ) ||
      normalizeUrl(
        restaurant?.bookingUrl
      ) ||
      normalizeUrl(
        restaurant?.booking
      ) ||
      null
    );
  };

// =====================================================
// RESTAURANT CARD
// =====================================================

function RestaurantCard({
  restaurants = [],
}) {

  const normalizedRestaurants =
    Array.isArray(restaurants)
      ? restaurants
      : [];

  return (
    <section className="restaurant-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="restaurant-header">

        <div>

          <span className="section-tag">
            🍽️ AI Restaurant Recommendations
          </span>

          <h2>
            Recommended Restaurants
          </h2>

          <p>
            Real restaurants discovered
            around your destination.
          </p>

        </div>

      </div>


      {/* =================================================
          EMPTY
      ================================================= */}

      {normalizedRestaurants.length === 0 ? (

        <div className="empty-recommendation">

          <div className="empty-restaurant-icon">

            <Utensils size={30} />

          </div>

          <h3>
            No restaurant recommendations
          </h3>

          <p>
            We couldn't find restaurants
            for this destination.
          </p>

        </div>

      ) : (

        <div className="restaurant-grid">

          {normalizedRestaurants.map(
            (restaurant, index) => {

              const name =
                restaurant?.name ||
                "Recommended Restaurant";

              const rating =
                restaurant?.rating;

              const cuisine =
                restaurant?.cuisine ||
                "Local Cuisine";

              const distance =
                restaurant?.distance;

              const speciality =
                restaurant?.speciality ||
                cuisine;

              const price =
                restaurant?.price ||
                "Price unavailable";

              const image =
                restaurant?.image ||
                null;

              const website =
                getRestaurantWebsite(
                  restaurant
                );

              const mapsUrl =
                getMapsUrl(
                  restaurant
                );

              return (

                <article
                  className="restaurant-card"
                  key={
                    restaurant?.id ||
                    `${name}-${index}`
                  }
                >

                  {/* =================================
                      IMAGE
                  ================================= */}

                  <div className="restaurant-image">

                    {image ? (

                      <img
                        src={image}
                        alt={name}
                        loading="lazy"
                      />

                    ) : (

                      <div className="restaurant-placeholder">

                        <Utensils
                          size={42}
                        />

                        <span>
                          {cuisine}
                        </span>

                      </div>

                    )}


                    {rating !== null &&
                    rating !== undefined && (

                      <div className="restaurant-rating">

                        <Star
                          size={15}
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

                  <div className="restaurant-content">

                    <h3>
                      {name}
                    </h3>


                    {/* CUISINE */}

                    <div className="restaurant-type">

                      <ChefHat size={16} />

                      <span>
                        {cuisine}
                      </span>

                    </div>


                    {/* SOURCE */}

                    <div className="restaurant-source">

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


                    {/* LOCATION */}

                    {distance && (

                      <div className="restaurant-location">

                        <MapPin size={16} />

                        <span>
                          {distance} away
                        </span>

                      </div>

                    )}


                    {/* SPECIALITY */}

                    <div className="restaurant-speciality">

                      <span>
                        Local Recommendation
                      </span>

                      <h4>
                        {speciality}
                      </h4>

                    </div>


                    {/* PRICE */}

                    <div className="restaurant-price">

                      <IndianRupee
                        size={18}
                      />

                      <span>
                        {price}
                      </span>

                    </div>


                    {/* =================================
                        ACTION BUTTON
                    ================================= */}

                    {website ? (

                      <a
                        href={website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="reserve-btn"
                      >

                        Visit Restaurant

                        <ExternalLink
                          size={17}
                        />

                      </a>

                    ) : mapsUrl ? (

                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="reserve-btn"
                      >

                        View Restaurant

                        <ArrowRight
                          size={18}
                        />

                      </a>

                    ) : (

                      <button
                        className="reserve-btn disabled"
                        type="button"
                        disabled
                      >

                        Website unavailable

                      </button>

                    )}


                    {/* MAP */}

                    {website &&
                    mapsUrl && (

                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="restaurant-map-link"
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

export default RestaurantCard;