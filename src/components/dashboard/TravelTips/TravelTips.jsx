import "./TravelTips.css";

import {
  Lightbulb,
  Sparkles,
  ShieldCheck,
  Wallet,
  Map,
  Clock3,
  Utensils,
} from "lucide-react";


// =====================================================
// TIP ICONS
// =====================================================

const tipIcons = [
  Lightbulb,
  ShieldCheck,
  Wallet,
  Map,
  Clock3,
  Utensils,
];


// =====================================================
// TRAVEL TIPS
// =====================================================

function TravelTips({ tips = [] }) {

  const normalizedTips =
    Array.isArray(tips)
      ? tips
          .map((tip) => {

            if (typeof tip === "string") {
              return tip;
            }

            if (
              tip &&
              typeof tip === "object"
            ) {
              return (
                tip.tip ||
                tip.description ||
                tip.text ||
                ""
              );
            }

            return "";

          })
          .filter(Boolean)
      : [];


  // ===================================================
  // EMPTY STATE
  // ===================================================

  if (
    normalizedTips.length === 0
  ) {

    return (

      <section className="travel-tips">

        <div className="tips-header">

          <div>

            <span className="section-tag">
              💡 AI Travel Guide
            </span>

            <h2>
              Travel Tips
            </h2>

            <p>
              Personalized advice generated
              specifically for your journey.
            </p>

          </div>

          <div className="tips-icon">

            <Lightbulb size={30} />

          </div>

        </div>


        <div className="tips-empty">

          <div className="tips-empty-icon">

            <Lightbulb size={28} />

          </div>

          <h3>
            No travel tips available
          </h3>

          <p>
            Generate a trip to receive
            personalized travel advice.
          </p>

        </div>

      </section>

    );
  }


  // ===================================================
  // MAIN UI
  // ===================================================

  return (

    <section className="travel-tips">

      {/* ===============================================
          HEADER
      =============================================== */}

      <div className="tips-header">

        <div>

          <span className="section-tag">
            💡 AI Travel Guide
          </span>

          <h2>
            Travel Tips
          </h2>

          <p>
            Practical advice to help you travel
            smarter, safer and more comfortably.
          </p>

        </div>

        <div className="tips-icon">

          <Lightbulb size={30} />

        </div>

      </div>


      {/* ===============================================
          TIP GRID
      =============================================== */}

      <div className="tips-grid">

        {normalizedTips.map(
          (tip, index) => {

            const Icon =
              tipIcons[
                index %
                tipIcons.length
              ];

            return (

              <article
                className="tip-card"
                key={`${index}-${tip}`}
              >

                <div className="tip-card-top">

                  <div className="tip-number">

                    {String(
                      index + 1
                    ).padStart(2, "0")}

                  </div>

                  <div className="tip-icon">

                    <Icon size={20} />

                  </div>

                </div>


                <div className="tip-content">

                  <h3>
                    Travel Tip {index + 1}
                  </h3>

                  <p>
                    {tip}
                  </p>

                </div>


                <div className="tip-footer">

                  <Sparkles
                    size={14}
                  />

                  <span>
                    Personalized for your trip
                  </span>

                </div>

              </article>

            );

          }
        )}

      </div>


      {/* ===============================================
          BOTTOM MESSAGE
      =============================================== */}

      <div className="tips-footer">

        <div className="tips-footer-icon">

          <Sparkles size={19} />

        </div>

        <div>

          <strong>
            Travel smarter with AI
          </strong>

          <p>
            These tips are generated using
            your destination, itinerary,
            interests and travel conditions.
          </p>

        </div>

      </div>

    </section>

  );
}

export default TravelTips;