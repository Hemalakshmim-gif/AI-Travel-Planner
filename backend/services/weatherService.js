import axios from "axios";

// ==========================================
// GET DESTINATION COORDINATES
// ==========================================

const getCoordinates = async (destination) => {
  const response = await axios.get(
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

  if (
    !response.data ||
    !response.data.results ||
    response.data.results.length === 0
  ) {
    throw new Error(
      `Location not found: ${destination}`
    );
  }

  const location = response.data.results[0];

  return {
    latitude: location.latitude,
    longitude: location.longitude,
    name: location.name,
    country: location.country,
  };
};

// ==========================================
// WEATHER CODE → DESCRIPTION
// ==========================================

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

    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",

    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",

    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",

    95: "Thunderstorm",
    96: "Thunderstorm with hail",
    99: "Thunderstorm with heavy hail",
  };

  return weatherCodes[code] || "Weather unavailable";
};

// ==========================================
// GET WEATHER
// ==========================================

export const getWeather = async (destination) => {
  try {
    console.log("\n==============================");
    console.log("🌤️ WEATHER API");
    console.log("==============================");

    console.log(
      "Destination:",
      destination
    );

    // --------------------------------------
    // STEP 1: GET COORDINATES
    // --------------------------------------

    const location =
      await getCoordinates(destination);

    console.log(
      "Latitude:",
      location.latitude
    );

    console.log(
      "Longitude:",
      location.longitude
    );

    // --------------------------------------
    // STEP 2: GET WEATHER
    // --------------------------------------

    const response = await axios.get(
      "https://api.open-meteo.com/v1/forecast",
      {
        params: {
          latitude: location.latitude,
          longitude: location.longitude,

          current:
            "temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m",

          daily:
            "sunrise,sunset,weather_code,temperature_2m_max,temperature_2m_min",

          timezone: "auto",

          forecast_days: 7,
        },
      }
    );

    const data = response.data;

    const weatherCode =
      data.current?.weather_code;

    const weather = {
      destination: location.name,

      country: location.country,

      latitude: location.latitude,

      longitude: location.longitude,

      timezone: data.timezone,

      temperature:
        data.current?.temperature_2m ?? null,

      humidity:
        data.current?.relative_humidity_2m ?? null,

      precipitation:
        data.current?.precipitation ?? null,

      weatherCode:
        weatherCode ?? null,

      description:
        getWeatherDescription(weatherCode),

      windSpeed:
        data.current?.wind_speed_10m ?? null,

      time:
        data.current?.time ?? null,

      daily: data.daily ?? null,
    };

    console.log(
      "\n✅ WEATHER DATA"
    );

    console.log(
      JSON.stringify(weather, null, 2)
    );

    return weather;

  } catch (error) {

    console.error(
      "\n❌ WEATHER API ERROR"
    );

    console.error(
      error.message
    );

    throw error;
  }
};

export default getWeather;