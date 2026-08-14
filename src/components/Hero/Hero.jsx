import "./Hero.css";

import { Sparkles, ArrowRight, Compass } from "lucide-react";
import heroImage from "../../assets/images/hero-image.png";

function Hero() {
  return (
    <section className="hero">

      <div className="hero-container container">

        {/* ================= LEFT ================= */}

        <div className="hero-left">

          <div className="hero-tag">
            <Sparkles size={18} />
            AI Travel Planner
          </div>

          <h1>
            Plan Smarter.
            <br />
            <span>Travel Better.</span>
          </h1>

          <p>
            Let our AI craft the perfect itinerary tailored to your
            destination, budget, interests, and travel style in just
            a few seconds.
          </p>

          <div className="hero-buttons">

            <button className="primary-btn">

              Start Planning

              <ArrowRight size={18} />

            </button>

            <button className="secondary-btn">

              <Compass size={18} />

              Explore Destinations

            </button>

          </div>

          {/* Stats */}

          <div className="hero-stats">

            <div className="stat-box">

              <h3>50K+</h3>

              <p>Trips Planned</p>

            </div>

            <div className="stat-box">

              <h3>4.9/5</h3>

              <p>User Rating</p>

            </div>

            <div className="stat-box">

              <h3>200+</h3>

              <p>Destinations</p>

            </div>

          </div>

        </div>

        {/* ================= RIGHT ================= */}

        <div className="hero-right">

          <img
            src={heroImage}
            alt="AI Travel Planner"
          />

        </div>

      </div>

    </section>
  );
}

export default Hero;