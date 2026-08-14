import axios from "axios";

// =====================================================
// Weather Agent
// Open-Meteo — No API key required
// =====================================================

const weatherAgent = async (trip) => {
  try {
    console.log("\n==============================");
    console.log("🌤️ WEATHER AGENT");
    console.log("==============================");

    const destination = trip.destination;

    if (!destination) {
      throw new Error("Destination is required for weather lookup");
    }

    console.log("📍 Destination:", destination);

    // =================================================
    // 1. GEOCODING
    // =================================================

    const geoResponse = await axios.get(
      "https://geocoding-api.open-meteo.com/v1/search",
      {
        params: {
          name: destination,
          count: 1,
          language: "en",
          format: "json",
        },
      }
    );

    const location = geoResponse.data?.results?.[0];

    if (!location) {
      throw new Error(
        `Could not find coordinates for ${destination}`
      );
    }

    const latitude = location.latitude;
    const longitude = location.longitude;

    console.log("📌 Latitude:", latitude);
    console.log("📌 Longitude:", longitude);

    // =================================================
    // 2. WEATHER API
    // =================================================

    const weatherResponse = await axios.get(
      "https://api.open-meteo.com/v1/forecast",
      {
        params: {
          latitude,
          longitude,

          current:
            "temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m",

          daily:
            "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset",

          timezone: "auto",

          forecast_days: 7,
        },
      }
    );

    const data = weatherResponse.data;

    const current = data.current || {};
    const daily = data.daily || {};

    // =================================================
    // 3. WEATHER CODE → DESCRIPTION
    // =================================================

    const getWeatherDescription = (code) => {
      const weatherCodes = {
        0: "Clear sky",

        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",

        45: "Fog",
        48: "Depositing rime fog",

        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",

        56: "Light freezing drizzle",
        57: "Dense freezing drizzle",

        61: "Slight rain",
        63: "Moderate rain",
        65: "Heavy rain",

        66: "Light freezing rain",
        67: "Heavy freezing rain",

        71: "Slight snow",
        73: "Moderate snow",
        75: "Heavy snow",

        77: "Snow grains",

        80: "Slight rain showers",
        81: "Moderate rain showers",
        82: "Violent rain showers",

        85: "Slight snow showers",
        86: "Heavy snow showers",

        95: "Thunderstorm",

        96: "Thunderstorm with slight hail",
        99: "Thunderstorm with heavy hail",
      };

      return weatherCodes[code] || "Unknown weather";
    };

    // =================================================
    // 4. NORMALIZED WEATHER OBJECT
    // =================================================

    const weather = {
      location: {
        name: location.name,
        country: location.country,
        latitude,
        longitude,
      },

      temperature:
        current.temperature_2m ?? null,

      humidity:
        current.relative_humidity_2m ?? null,

      precipitation:
        current.precipitation ?? null,

      windSpeed:
        current.wind_speed_10m ?? null,

      weatherCode:
        current.weather_code ?? null,

      description:
        getWeatherDescription(current.weather_code),

      timezone:
        data.timezone || location.timezone || "auto",

      sunrise:
        daily.sunrise?.[0] || null,

      sunset:
        daily.sunset?.[0] || null,

      forecast: Array.isArray(daily.time)
        ? daily.time.map((date, index) => ({
            date,

            weatherCode:
              daily.weather_code?.[index] ?? null,

            description:
              getWeatherDescription(
                daily.weather_code?.[index]
              ),

            temperatureMax:
              daily.temperature_2m_max?.[index] ?? null,

            temperatureMin:
              daily.temperature_2m_min?.[index] ?? null,

            sunrise:
              daily.sunrise?.[index] ?? null,

            sunset:
              daily.sunset?.[index] ?? null,
          }))
        : [],
    };

    // =================================================
    // 5. LOG RESULT
    // =================================================

    console.log("\n✅ WEATHER DATA GENERATED");

    console.log(
      JSON.stringify(weather, null, 2)
    );

    return weather;

  } catch (error) {

    console.error("\n❌ WEATHER AGENT ERROR");

    console.error(
      error.response?.data ||
      error.message
    );

    // Do NOT crash the entire planner if weather fails.
    return {
      location: {
        name: trip.destination || "Unknown",
      },

      temperature: null,
      humidity: null,
      precipitation: null,
      windSpeed: null,
      weatherCode: null,

      description: "Weather unavailable",

      timezone: null,
      sunrise: null,
      sunset: null,

      forecast: [],

      error: true,
    };
  }
};

export default weatherAgent;