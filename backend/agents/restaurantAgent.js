import axios from "axios";

// =====================================================
// RESTAURANT AGENT
// Real restaurants using OpenStreetMap + Overpass
// =====================================================

const restaurantAgent = async (trip) => {
  try {
    console.log("\n==============================");
    console.log("🍽️ RESTAURANT AGENT");
    console.log("==============================");

    const destination =
      trip?.destination?.trim();

    if (!destination) {
      throw new Error(
        "Destination is required for restaurant search"
      );
    }

    console.log(
      "📍 Searching real restaurants for:",
      destination
    );

    // =================================================
    // 1. DESTINATION / GEOCODING
    // =================================================

    let searchName = destination;

    // Important:
    // "Bali" can incorrectly resolve to Bāli, India.
    if (
      destination.toLowerCase() === "bali"
    ) {
      searchName = "Bali, Indonesia";
    }

    const geoResponse =
      await axios.get(
        "https://geocoding-api.open-meteo.com/v1/search",
        {
          params: {
            name: searchName,
            count: 10,
            language: "en",
            format: "json",
          },

          timeout: 10000,
        }
      );

    const results =
      geoResponse.data?.results || [];

    let location = null;

    // -------------------------------------------------
    // Prefer Indonesia for Bali
    // -------------------------------------------------

    if (
      destination.toLowerCase() ===
      "bali"
    ) {
      location =
        results.find(
          (item) =>
            item.country?.toLowerCase() ===
            "indonesia"
        );
    }

    // Fallback
    if (!location) {
      location = results[0];
    }

    if (!location) {
      throw new Error(
        `Could not find location for ${destination}`
      );
    }

    const latitude =
      Number(location.latitude);

    const longitude =
      Number(location.longitude);

    console.log(
      "📌 Coordinates:",
      latitude,
      longitude
    );

    console.log(
      "🌍 Resolved Location:",
      location.name,
      location.country
    );

    // =================================================
    // 2. DISTANCE CALCULATION
    // =================================================

    const calculateDistance = (
      lat1,
      lon1,
      lat2,
      lon2
    ) => {

      const R = 6371;

      const dLat =
        ((lat2 - lat1) * Math.PI) /
        180;

      const dLon =
        ((lon2 - lon1) * Math.PI) /
        180;

      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(
          (lat1 * Math.PI) / 180
        ) *
          Math.cos(
            (lat2 * Math.PI) / 180
          ) *
          Math.sin(dLon / 2) ** 2;

      const c =
        2 *
        Math.atan2(
          Math.sqrt(a),
          Math.sqrt(1 - a)
        );

      return R * c;
    };

    // =================================================
    // 3. OVERPASS QUERY
    // =================================================

    // Use a smaller radius first.
    // This makes the request much lighter.
    const radius = 10000;

    const query = `
      [out:json][timeout:45];

      (
        node["amenity"="restaurant"](
          around:${radius},
          ${latitude},
          ${longitude}
        );

        way["amenity"="restaurant"](
          around:${radius},
          ${latitude},
          ${longitude}
        );

        node["amenity"="fast_food"](
          around:${radius},
          ${latitude},
          ${longitude}
        );

        way["amenity"="fast_food"](
          around:${radius},
          ${latitude},
          ${longitude}
        );
      );

      out center tags;
    `;

    // =================================================
    // 4. OVERPASS SERVERS
    // =================================================

    const overpassServers = [
      "https://overpass-api.de/api/interpreter",
      "https://overpass.kumi.systems/api/interpreter",
      "https://overpass.private.coffee/api/interpreter",
    ];

    let elements = [];

    // =================================================
    // 5. TRY SERVERS
    // =================================================

    for (
      const server of overpassServers
    ) {

      try {

        console.log(
          "🌐 Trying Overpass:",
          server
        );

        const body =
          new URLSearchParams();

        body.append(
          "data",
          query
        );

        const response =
          await axios.post(
            server,
            body.toString(),
            {
              headers: {
                "Content-Type":
                  "application/x-www-form-urlencoded",

                "User-Agent":
                  "AI-Travel-Planner/1.0",
              },

              timeout: 60000,
            }
          );

        elements =
          response.data?.elements || [];

        console.log(
          `🍽️ Server returned ${elements.length} results`
        );

        if (
          elements.length > 0
        ) {
          break;
        }

      } catch (serverError) {

        console.warn(
          "⚠️ Overpass server failed:"
        );

        console.warn(
          serverError.response?.status ||
          serverError.message
        );

      }
    }

    // =================================================
    // 6. CHECK RESULTS
    // =================================================

    if (
      elements.length === 0
    ) {

      console.warn(
        "⚠️ No restaurants found from Overpass."
      );

      return [];
    }

    // =================================================
    // 7. NORMALIZE RESTAURANTS
    // =================================================

    const restaurants =
      elements
        .map((element) => {

          const tags =
            element.tags || {};

          // -------------------------------------------
          // Coordinates
          // -------------------------------------------

          const restaurantLatitude =
            element.lat ??
            element.center?.lat;

          const restaurantLongitude =
            element.lon ??
            element.center?.lon;

          if (
            restaurantLatitude ===
              undefined ||
            restaurantLongitude ===
              undefined
          ) {

            return null;
          }

          // -------------------------------------------
          // Name
          // -------------------------------------------

          const name =
            tags.name ||
            tags["name:en"];

          if (!name) {
            return null;
          }

          // -------------------------------------------
          // Website
          // -------------------------------------------

          const website =
            tags.website ||
            tags["contact:website"] ||
            tags.url ||
            tags["contact:url"] ||
            null;

          // -------------------------------------------
          // Address
          // -------------------------------------------

          const addressParts = [
            tags["addr:housenumber"],
            tags["addr:street"],
            tags["addr:suburb"],
            tags["addr:city"],
          ].filter(Boolean);

          const address =
            addressParts.length > 0
              ? addressParts.join(", ")
              : null;

          // -------------------------------------------
          // Distance
          // -------------------------------------------

          const distance =
            calculateDistance(
              latitude,
              longitude,
              Number(
                restaurantLatitude
              ),
              Number(
                restaurantLongitude
              )
            );

          // -------------------------------------------
          // Cuisine
          // -------------------------------------------

          const cuisine =
            tags.cuisine
              ? tags.cuisine
                  .split(";")
                  .map(
                    (item) =>
                      item
                        .trim()
                        .replace(
                          /\b\w/g,
                          (char) =>
                            char.toUpperCase()
                        )
                  )
                  .join(" • ")
              : "Local Cuisine";

          // -------------------------------------------
          // Price
          // -------------------------------------------

          const price =
            tags.price_range ||
            tags.price ||
            "Price unavailable";

          // -------------------------------------------
          // Restaurant Type
          // -------------------------------------------

          const restaurantType =
            tags.amenity ===
            "fast_food"
              ? "Fast Food"
              : "Restaurant";

          // -------------------------------------------
          // Google Maps
          // -------------------------------------------

          const mapsUrl =
            `https://www.google.com/maps/search/?api=1&query=${restaurantLatitude},${restaurantLongitude}`;

          // -------------------------------------------
          // Return
          // -------------------------------------------

          return {

            id:
              element.id,

            name,

            rating:
              tags.rating
                ? Number(
                    tags.rating
                  )
                : null,

            cuisine,

            price,

            distance:
              `${distance.toFixed(
                1
              )} km`,

            address,

            latitude:
              Number(
                restaurantLatitude
              ),

            longitude:
              Number(
                restaurantLongitude
              ),

            website,

            mapsUrl,

            speciality:
              tags["cuisine:en"] ||
              cuisine,

            restaurantType,

            image:
              null,

            imageKeyword:
              `${name} restaurant ${destination}`,

            source:
              "OpenStreetMap",
          };

        })

        .filter(Boolean)

        // -------------------------------------------
        // Remove duplicate names
        // -------------------------------------------

        .filter(
          (restaurant, index, array) =>
            index ===
            array.findIndex(
              (item) =>
                item.name.toLowerCase() ===
                restaurant.name.toLowerCase()
            )
        )

        // -------------------------------------------
        // Nearest first
        // -------------------------------------------

        .sort(
          (a, b) =>
            parseFloat(
              a.distance
            ) -
            parseFloat(
              b.distance
            )
        )

        // -------------------------------------------
        // Maximum 6
        // -------------------------------------------

        .slice(0, 6);

    // =================================================
    // 8. FINAL RESULT
    // =================================================

    console.log(
      "\n✅ REAL RESTAURANTS:"
    );

    console.log(
      JSON.stringify(
        restaurants,
        null,
        2
      )
    );

    console.log(
      `🍽️ Final restaurants: ${restaurants.length}`
    );

    return restaurants;

  } catch (error) {

    console.error(
      "\n❌ RESTAURANT AGENT ERROR"
    );

    console.error(
      error.response?.data ||
      error.message
    );

    return [];
  }
};

export default restaurantAgent;