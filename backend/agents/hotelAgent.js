import axios from "axios";

// =====================================================
// HOTEL AGENT
// Real hotels using OpenStreetMap + Overpass
// =====================================================

const hotelAgent = async (trip) => {
  try {
    console.log("\n==============================");
    console.log("🏨 HOTEL AGENT");
    console.log("==============================");

    const destination = trip?.destination?.trim();

    if (!destination) {
      throw new Error("Destination is required for hotel search");
    }

    console.log("📍 Searching real hotels for:", destination);

    // =================================================
    // 1. DESTINATION SEARCH
    // =================================================

    let searchName = destination;

    // Bali must resolve to Indonesia.
    if (destination.toLowerCase() === "bali") {
      searchName = "Bali, Indonesia";
    }

    const geoResponse = await axios.get(
      "https://geocoding-api.open-meteo.com/v1/search",
      {
        params: {
          name: searchName,
          count: 5,
          language: "en",
          format: "json",
        },
        timeout: 10000,
      }
    );

    const results = geoResponse.data?.results || [];

    // Prefer Indonesia for Bali
    let location;

    if (destination.toLowerCase() === "bali") {
      location =
        results.find(
          (item) =>
            item.country?.toLowerCase() === "indonesia"
        ) || results[0];
    } else {
      location = results[0];
    }

    if (!location) {
      throw new Error(
        `Could not find location for ${destination}`
      );
    }

    const latitude = Number(location.latitude);
    const longitude = Number(location.longitude);

    console.log("📌 Coordinates:", latitude, longitude);
    console.log(
      "🌍 Resolved Location:",
      location.name,
      location.country
    );

    // =================================================
    // 2. OVERPASS QUERY
    // =================================================

    const query = `
      [out:json][timeout:60];

      (
        node["tourism"="hotel"](around:15000,${latitude},${longitude});
        way["tourism"="hotel"](around:15000,${latitude},${longitude});
        relation["tourism"="hotel"](around:15000,${latitude},${longitude});
      );

      out center tags;
    `;

    // =================================================
    // 3. OVERPASS REQUEST
    // =================================================

    const overpassUrl =
      "https://overpass-api.de/api/interpreter";

    const body = new URLSearchParams();

    body.append("data", query);

    const overpassResponse = await axios.post(
      overpassUrl,
      body.toString(),
      {
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
          "User-Agent":
            "AI-Travel-Planner/1.0",
        },
        timeout: 70000,
      }
    );

    const elements =
      overpassResponse.data?.elements || [];

    console.log(
      `🏨 Overpass returned ${elements.length} hotels`
    );

    // =================================================
    // 4. DISTANCE CALCULATION
    // =================================================

    const calculateDistance = (
      lat1,
      lon1,
      lat2,
      lon2
    ) => {
      const R = 6371;

      const dLat =
        ((lat2 - lat1) * Math.PI) / 180;

      const dLon =
        ((lon2 - lon1) * Math.PI) / 180;

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
    // 5. NORMALIZE HOTELS
    // =================================================

    const hotels = elements
      .map((element) => {
        const tags = element.tags || {};

        const hotelLatitude =
          element.lat ??
          element.center?.lat;

        const hotelLongitude =
          element.lon ??
          element.center?.lon;

        if (
          hotelLatitude === undefined ||
          hotelLongitude === undefined
        ) {
          return null;
        }

        const name =
          tags.name ||
          tags["name:en"];

        if (!name) {
          return null;
        }

        const website =
          tags.website ||
          tags["contact:website"] ||
          tags["booking:website"] ||
          tags.booking ||
          tags.url ||
          tags["contact:url"] ||
          null;

        const addressParts = [
          tags["addr:housenumber"],
          tags["addr:street"],
          tags["addr:suburb"],
          tags["addr:city"],
        ].filter(Boolean);

        const address =
          addressParts.length
            ? addressParts.join(", ")
            : null;

        const distance =
          calculateDistance(
            latitude,
            longitude,
            Number(hotelLatitude),
            Number(hotelLongitude)
          );

        const amenities = [];

        if (
          tags.internet_access ||
          tags.wifi === "yes"
        ) {
          amenities.push("Free WiFi");
        }

        if (tags.breakfast === "yes") {
          amenities.push("Breakfast");
        }

        if (tags.swimming_pool === "yes") {
          amenities.push("Pool");
        }

        if (tags.spa === "yes") {
          amenities.push("Spa");
        }

        if (tags.parking === "yes") {
          amenities.push("Parking");
        }

        if (tags.restaurant === "yes") {
          amenities.push("Restaurant");
        }

        const mapsUrl =
          `https://www.google.com/maps/search/?api=1&query=${hotelLatitude},${hotelLongitude}`;

        return {
          id: element.id,
          name,
          rating: tags.stars
            ? Number(tags.stars)
            : null,
          price:
            tags.price ||
            "Price unavailable",
          location:
            address ||
            destination,
          address,
          latitude:
            Number(hotelLatitude),
          longitude:
            Number(hotelLongitude),
          distance:
            `${distance.toFixed(1)} km`,
          website,
          mapsUrl,
          amenities,
          image: null,
          imageKeyword: `${name} hotel ${destination}`,
          source: "OpenStreetMap",
        };
      })
      .filter(Boolean)
      .sort(
        (a, b) =>
          parseFloat(a.distance) -
          parseFloat(b.distance)
      )
      .slice(0, 6);

    console.log("\n✅ REAL HOTELS:");
    console.log(
      JSON.stringify(
        hotels,
        null,
        2
      )
    );

    return hotels;

  } catch (error) {
    console.error(
      "\n❌ HOTEL AGENT ERROR"
    );

    console.error(
      error.response?.data ||
      error.message
    );

    return [];
  }
};

export default hotelAgent;