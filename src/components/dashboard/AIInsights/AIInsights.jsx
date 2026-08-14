import {
  Sparkles,
  Lightbulb,
  Camera,
  Utensils,
  Moon,
  Shield,
  Compass,
  Wallet,
  Clock,
} from "lucide-react";

import "./AIInsights.css";


const insightIcons = [
  Lightbulb,
  Camera,
  Utensils,
  Moon,
  Shield,
  Compass,
  Wallet,
  Clock,
];


const insightTypes = [
  "Planning",
  "Photography",
  "Food",
  "Experience",
  "Safety",
  "Adventure",
  "Budget",
  "Timing",
];


function AIInsights({
  insights = [],
}) {

  const normalizedInsights =
    Array.isArray(insights)
      ? insights
          .map((item) => {

            if (
              typeof item === "string"
            ) {
              return item;
            }

            if (
              item &&
              typeof item === "object"
            ) {
              return (
                item.insight ||
                item.text ||
                item.description ||
                item.tip ||
                ""
              );
            }

            return "";

          })
          .filter(Boolean)
      : [];


  // =====================================================
  // EMPTY STATE
  // =====================================================

  if (
    normalizedInsights.length === 0
  ) {

    return (

      <section className="ai-insights-section">

        <div className="ai-insights-empty">

          <div className="ai-insights-empty-icon">

            <Sparkles size={28} />

          </div>

          <h2>
            No AI insights yet
          </h2>

          <p>
            Generate your trip to receive
            personalized recommendations
            and intelligent travel suggestions.
          </p>

        </div>

      </section>

    );
  }


  // =====================================================
  // MAIN
  // =====================================================

  return (

    <section className="ai-insights-section">

      {/* ===============================================
          HEADER
      =============================================== */}

      <div className="ai-insights-header">

        <div className="ai-insights-heading">

          <div className="ai-insights-icon">

            <Sparkles size={26} />

          </div>

          <div>

            <div className="ai-insights-eyebrow">

              <span className="ai-pulse"></span>

              AI TRAVEL INTELLIGENCE

            </div>

            <h2>
              AI Insights
            </h2>

            <p>
              Smart recommendations generated
              specifically for your journey.
            </p>

          </div>

        </div>


        <div className="ai-generated-badge">

          <Sparkles size={15} />

          AI Generated

        </div>

      </div>


      {/* ===============================================
          INSIGHTS
      =============================================== */}

      <div className="ai-insights-grid">

        {normalizedInsights.map(
          (insight, index) => {

            const Icon =
              insightIcons[
                index %
                insightIcons.length
              ];

            const type =
              insightTypes[
                index %
                insightTypes.length
              ];

            return (

              <article
                className="ai-insight-card"
                key={
                  `${index}-${insight}`
                }
              >

                <div className="ai-insight-top">

                  <div className="ai-insight-number">

                    {String(
                      index + 1
                    ).padStart(2, "0")}

                  </div>

                  <div className="ai-insight-type">

                    {type}

                  </div>

                  <div className="ai-insight-card-icon">

                    <Icon size={20} />

                  </div>

                </div>


                <div className="ai-insight-content">

                  <h3>
                    AI Insight {index + 1}
                  </h3>

                  <p>
                    {insight}
                  </p>

                </div>


                <div className="ai-insight-footer">

                  <span>

                    <Sparkles
                      size={14}
                    />

                    Personalized for your trip

                  </span>

                </div>

              </article>

            );
          }
        )}

      </div>


      {/* ===============================================
          FOOTER
      =============================================== */}

      <div className="ai-insights-footer">

        <div className="ai-footer-icon">

          <Sparkles size={18} />

        </div>

        <div>

          <strong>
            Your trip, enhanced by AI
          </strong>

          <p>
            These insights analyze your destination,
            interests, itinerary, weather and
            travel preferences.
          </p>

        </div>

      </div>

    </section>

  );
}

export default AIInsights;