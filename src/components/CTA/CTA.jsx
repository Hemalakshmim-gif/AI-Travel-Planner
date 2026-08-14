import "./CTA.css";

import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function CTA() {
  const navigate = useNavigate();

  return (
    <section className="cta-section">

      <div className="container">

        <div className="cta-card">

          <h2>
            Ready for Your Next Adventure?
          </h2>

          <p>
            Let AI create your perfect itinerary in just a few
            seconds.
          </p>

          <div className="cta-buttons">

            <button
              className="cta-primary"
              onClick={() => navigate("/planner")}
            >
              Start Planning

              <ArrowRight size={18} />

            </button>

            <button
              className="cta-secondary"
              onClick={() => navigate("/compare")}
            >
              Compare Destinations
            </button>

          </div>

        </div>

      </div>

    </section>
  );
}

export default CTA;