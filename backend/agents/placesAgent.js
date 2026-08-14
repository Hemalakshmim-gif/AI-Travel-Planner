import axios from "axios";

// =====================================================
// PLACES AGENT
// Real places using OpenStreetMap + Overpass
// Multiple Overpass servers with fallback
// =====================================================

const placesAgent = async (trip) => {
  try {
    console.log("\n==============================");
    console.log("📍 PLACES AGENT");
    console.log("==============================");

    const destination =
      trip?.destination?.trim();

    if (!destination) {
      throw new Error(
        "Destination is required for places search"
      );
    }

    console.log(
      "🔎 Searching real places for:",
      destination
    );

    // =================================================
    // 1. GEOCODING
    // =================================================

    let searchName = destination;

    // Prevent Bali from resolving to Bāli, India
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
      "📌 Destination coordinates:",
      latitude,
      longitude
    );

    console.log(
      "🌍 Resolved Location:",
      location.name,
      location.country
    );

    // =================================================
    // 2. DISTANCE FUNCTION
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
    // 3. LIGHTWEIGHT OVERPASS QUERY
    // =================================================

    const radius = 12000;

    const query = `
      [out:json][timeout:45];

      (
        node["tourism"="attraction"](
          around:${radius},
          ${latitude},
          ${longitude}
        );

        way["tourism"="attraction"](
          around:${radius},
          ${latitude},
          ${longitude}
        );

        node["tourism"="viewpoint"](
          around:${radius},
          ${latitude},
          ${longitude}
        );

        way["tourism"="viewpoint"](
          around:${radius},
          ${latitude},
          ${longitude}
        );

        node["tourism"="museum"](
          around:${radius},
          ${latitude},
          ${longitude}
        );

        way["tourism"="museum"](
          around:${radius},
          ${latitude},
          ${longitude}
        );

        node["tourism"="gallery"](
          around:${radius},
          ${latitude},
          ${longitude}
        );

        way["tourism"="gallery"](
          around:${radius},
          ${latitude},
          ${longitude}
        );

        node["leisure"="park"](
          around:${radius},
          ${latitude},
          ${longitude}
        );

        way["leisure"="park"](
          around:${radius},
          ${latitude},
          ${longitude}
        );

        node["historic"="monument"](
          around:${radius},
          ${latitude},
          ${longitude}
        );

        node["historic"="memorial"](
          around:${radius},
          ${latitude},
          ${longitude}
        );

        node["natural"="beach"](
          around:${radius},
          ${latitude},
          ${longitude}
        );

        way["natural"="beach"](
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
          `📍 Server returned ${elements.length} places`
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
    // 6. NO RESULTS
    // =================================================

    if (
      elements.length === 0
    ) {

      console.warn(
        "⚠️ No places returned from Overpass."
      );

      return [];
    }

    // =================================================
    // 7. NORMALIZE PLACES
    // =================================================

    const places =
      elements
        .map((element) => {

          const tags =
            element.tags || {};

          // -------------------------------------------
          // Coordinates
          // -------------------------------------------

          const placeLatitude =
            element.lat ??
            element.center?.lat;

          const placeLongitude =
            element.lon ??
            element.center?.lon;

          if (
            placeLatitude ===
              undefined ||
            placeLongitude ===
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
            addressParts.length
              ? addressParts.join(", ")
              : destination;

          // -------------------------------------------
          // Category
          // -------------------------------------------

          let category =
            "Tourist Attraction";

          if (tags.tourism) {
            category =
              tags.tourism
                .replace(
                  /_/g,
                  " "
                )
                .replace(
                  /\b\w/g,
                  (char) =>
                    char.toUpperCase()
                );
          }

          if (tags.leisure) {
            category =
              tags.leisure
                .replace(
                  /_/g,
                  " "
                )
                .replace(
                  /\b\w/g,
                  (char) =>
                    char.toUpperCase()
                );
          }

          if (tags.historic) {
            category =
              tags.historic
                .replace(
                  /_/g,
                  " "
                )
                .replace(
                  /\b\w/g,
                  (char) =>
                    char.toUpperCase()
                );
          }

          if (tags.natural) {
            category =
              tags.natural
                .replace(
                  /_/g,
                  " "
                )
                .replace(
                  /\b\w/g,
                  (char) =>
                    char.toUpperCase()
                );
          }

          // -------------------------------------------
          // Distance
          // -------------------------------------------

          const distance =
            calculateDistance(
              latitude,
              longitude,
              Number(
                placeLatitude
              ),
              Number(
                placeLongitude
              )
            );

          // -------------------------------------------
          // Best time
          // -------------------------------------------

          let bestTime =
            "Daytime";

          if (
            tags.tourism ===
            "viewpoint"
          ) {
            bestTime =
              "Early morning or evening";
          }

          if (
            tags.natural ===
            "beach"
          ) {
            bestTime =
              "Morning or late afternoon";
          }

          if (
            tags.leisure ===
            "park"
          ) {
            bestTime =
              "Morning or evening";
          }

          // -------------------------------------------
          // Rating
          // -------------------------------------------

          const rating =
            tags.rating
              ? Number(
                  tags.rating
                )
              : null;

          // -------------------------------------------
          // Google Maps
          // -------------------------------------------

          const mapsUrl =
            `https://www.google.com/maps/search/?api=1&query=${placeLatitude},${placeLongitude}`;

          // -------------------------------------------
          // Return
          // -------------------------------------------

          return {

            id:
              element.id,

            name,

            description:
              tags.description ||
              `${category} in ${destination}`,

            category,

            bestTime,

            address,

            latitude:
              Number(
                placeLatitude
              ),

            longitude:
              Number(
                placeLongitude
              ),

            rating,

            website,

            mapsUrl,

            distance:
              `${distance.toFixed(
                1
              )} km`,

            imageKeyword:
              `${name} ${destination}`,

            source:
              "OpenStreetMap",
          };

        })

        .filter(Boolean)

        // =================================================
        // REMOVE DUPLICATES
        // =================================================

        .filter(
          (place, index, array) =>
            index ===
            array.findIndex(
              (item) =>
                item.name.toLowerCase() ===
                place.name.toLowerCase()
            )
        )

        // =================================================
        // SORT BY DISTANCE
        // =================================================

        .sort(
          (a, b) =>
            parseFloat(
              a.distance
            ) -
            parseFloat(
              b.distance
            )
        )

        // =================================================
        // MAXIMUM 15
        // =================================================

        .slice(0, 15);

    // =================================================
    // 8. FINAL OUTPUT
    // =================================================

    console.log(
      "\n✅ REAL PLACES:"
    );

    console.log(
      JSON.stringify(
        places,
        null,
        2
      )
    );

    console.log(
      `📍 Final places: ${places.length}`
    );

    return places;

  } catch (error) {

    console.error(
      "\n❌ PLACES AGENT ERROR"
    );

    console.error(
      error.response?.data ||
      error.message
    );

    return [];
  }
};

export default placesAgent;