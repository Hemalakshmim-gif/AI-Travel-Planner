import "./Stats.css";

import {
  MapPinned,
  Plane,
  Globe2,
  Sparkles,
} from "lucide-react";

const stats = [
  {
    icon: <Plane size={34} />,
    number: "10K+",
    title: "Trips Planned",
  },
  {
    icon: <Globe2 size={34} />,
    number: "150+",
    title: "Destinations",
  },
  {
    icon: <MapPinned size={34} />,
    number: "98%",
    title: "Happy Travelers",
  },
  {
    icon: <Sparkles size={34} />,
    number: "24/7",
    title: "AI Assistance",
  },
];

function Stats() {
  return (
    <section className="stats-section">

      <div className="container">

        <div className="stats-grid">

          {stats.map((item, index) => (

            <div
              className="stat-card"
              key={index}
            >

              <div className="stat-icon">

                {item.icon}

              </div>

              <h2>{item.number}</h2>

              <p>{item.title}</p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default Stats;