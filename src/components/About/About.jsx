import "./About.css";
import {
  Brain,
  Wallet,
  Hotel,
  Utensils,
  CloudSun,
  MapPinned,
} from "lucide-react";

function About() {
  return (
    <section id="about" className="features">

      <div className="container">

        <div className="section-header">

          <span className="section-badge">
            ✨ Why Choose AI Travel Planner
          </span>

          <h2>
            Everything You Need
            <br />
            For Your Perfect Trip
          </h2>

          <p>
            Our AI helps you plan faster, travel smarter, and enjoy
            every destination with personalized recommendations.
          </p>

        </div>

        <div className="features-grid">

          <div className="feature-card">
            <Brain size={40} />
            <h3>AI Itinerary</h3>
            <p>
              Personalized day-by-day travel plans generated in seconds.
            </p>
          </div>

          <div className="feature-card">
            <Wallet size={40} />
            <h3>Smart Budget</h3>
            <p>
              Estimate your complete travel expenses before you leave.
            </p>
          </div>

          <div className="feature-card">
            <Hotel size={40} />
            <h3>Best Hotels</h3>
            <p>
              Discover hotels that match your budget and preferences.
            </p>
          </div>

          <div className="feature-card">
            <Utensils size={40} />
            <h3>Restaurants</h3>
            <p>
              Explore top-rated restaurants and local cuisine nearby.
            </p>
          </div>

          <div className="feature-card">
            <CloudSun size={40} />
            <h3>Weather</h3>
            <p>
              Get live weather forecasts to plan every activity.
            </p>
          </div>

          <div className="feature-card">
            <MapPinned size={40} />
            <h3>Top Attractions</h3>
            <p>
              Never miss famous places and hidden gems at your destination.
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}

export default About;