import {
  MapPin,
  Droplets,
  Umbrella,
  Wind,
  Sunrise,
  Sunset,
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudLightning,
  Snowflake,
} from "lucide-react";

import "./WeatherCard.css";

function WeatherCard({ weather, destination }) {

  // =====================================================
  // SAFE WEATHER VALUES
  // =====================================================

  const temperature =
    weather?.temperature !== null &&
    weather?.temperature !== undefined
      ? Math.round(Number(weather.temperature))
      : null;

  const humidity =
    weather?.humidity !== null &&
    weather?.humidity !== undefined
      ? weather.humidity
      : null;

  const precipitation =
    weather?.precipitation !== null &&
    weather?.precipitation !== undefined
      ? weather.precipitation
      : null;

  const windSpeed =
    weather?.windSpeed !== null &&
    weather?.windSpeed !== undefined
      ? weather.windSpeed
      : null;

  const description =
    weather?.description || "Weather unavailable";

  // =====================================================
  // WEATHER ICON
  // =====================================================

  const getWeatherIcon = (code) => {

    if (code === null || code === undefined) {
      return <CloudSun size={42} />;
    }

    if (code === 0) {
      return <Sun size={42} />;
    }

    if ([1, 2].includes(Number(code))) {
      return <CloudSun size={42} />;
    }

    if ([3, 45, 48].includes(Number(code))) {
      return <Cloud size={42} />;
    }

    if (
      [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82]
        .includes(Number(code))
    ) {
      return <CloudRain size={42} />;
    }

    if (
      [71, 73, 75, 77, 85, 86]
        .includes(Number(code))
    ) {
      return <Snowflake size={42} />;
    }

    if ([95, 96, 99].includes(Number(code))) {
      return <CloudLightning size={42} />;
    }

    return <CloudSun size={42} />;
  };

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (value) => {

    if (!value) return "--";

    try {

      const date = new Date(value);

      if (Number.isNaN(date.getTime())) {
        return "--";
      }

      return date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });

    } catch {
      return "--";
    }
  };

  // =====================================================
  // WEATHER STATE
  // =====================================================

  const hasWeather =
    temperature !== null ||
    humidity !== null ||
    precipitation !== null ||
    windSpeed !== null;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <section className="weather-card">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="weather-card-header">

        <div className="weather-header-content">

          <div className="weather-live-badge">
            <span className="weather-live-dot"></span>
            Live Weather
          </div>

          <h2>Weather Forecast</h2>

          <div className="weather-destination">
            <MapPin size={18} />
            <span>
              {destination || "Your destination"}
            </span>
          </div>

        </div>

        <div className="weather-icon-box">
          {getWeatherIcon(weather?.weatherCode)}
        </div>

      </div>


      {/* =================================================
          CURRENT WEATHER
      ================================================= */}

      <div className="weather-current">

        <div className="weather-temperature">

          {temperature !== null
            ? temperature
            : "--"}

          <span>°C</span>

        </div>

        <div className="weather-condition">

          <h3>
            {hasWeather
              ? description
              : "Weather unavailable"}
          </h3>

          <p>
            Current conditions
          </p>

        </div>

      </div>


      {/* =================================================
          WEATHER METRICS
      ================================================= */}

      <div className="weather-metrics">

        <div className="weather-metric">

          <div className="weather-metric-icon">
            <Droplets size={22} />
          </div>

          <div>
            <strong>
              {humidity !== null
                ? `${humidity}%`
                : "--"}
            </strong>

            <span>
              Humidity
            </span>
          </div>

        </div>


        <div className="weather-metric">

          <div className="weather-metric-icon">
            <Umbrella size={22} />
          </div>

          <div>
            <strong>
              {precipitation !== null
                ? `${precipitation} mm`
                : "--"}
            </strong>

            <span>
              Precipitation
            </span>
          </div>

        </div>


        <div className="weather-metric">

          <div className="weather-metric-icon">
            <Wind size={22} />
          </div>

          <div>
            <strong>
              {windSpeed !== null
                ? `${windSpeed} km/h`
                : "--"}
            </strong>

            <span>
              Wind speed
            </span>
          </div>

        </div>

      </div>


      {/* =================================================
          SUN INFORMATION
      ================================================= */}

      <div className="weather-sun-row">

        <div className="weather-sun-item">

          <div className="sun-icon sunrise-icon">
            <Sunrise size={22} />
          </div>

          <div>
            <span>
              Sunrise
            </span>

            <strong>
              {formatTime(weather?.sunrise)}
            </strong>
          </div>

        </div>


        <div className="weather-sun-divider"></div>


        <div className="weather-sun-item">

          <div className="sun-icon sunset-icon">
            <Sunset size={22} />
          </div>

          <div>
            <span>
              Sunset
            </span>

            <strong>
              {formatTime(weather?.sunset)}
            </strong>
          </div>

        </div>

      </div>

    </section>
  );
}

export default WeatherCard;