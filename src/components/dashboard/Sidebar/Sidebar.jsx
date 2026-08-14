import "./Sidebar.css";

import {
  LayoutDashboard,
  CalendarDays,
  Hotel,
  Utensils,
  Backpack,
  ShieldCheck,
  MapPin,
  Sparkles,
} from "lucide-react";

const menuItems = [
  {
    id: "summary",
    title: "Trip Summary",
    icon: <LayoutDashboard size={22} />,
  },
  {
    id: "itinerary",
    title: "Itinerary",
    icon: <CalendarDays size={22} />,
  },
  {
    id: "hotels",
    title: "Hotels",
    icon: <Hotel size={22} />,
  },
  {
    id: "restaurants",
    title: "Restaurants",
    icon: <Utensils size={22} />,
  },
  {
    id: "places",
    title: "Places",
    icon: <MapPin size={22} />,
  },
  {
    id: "packing",
    title: "Packing",
    icon: <Backpack size={22} />,
  },
  {
    id: "traveltips",
    title: "Travel Tips",
    icon: <ShieldCheck size={22} />,
  },
];

function Sidebar({
  activePage,
  setActivePage,
  matchScore,
  matchReason,
}) {
  const validScore =
    typeof matchScore === "number"
      ? Math.round(matchScore)
      : null;

  return (
    <aside className="sidebar">

      {/* =========================================
          HEADER
      ========================================= */}

      <div>

        <div className="sidebar-header">

          <h2>
            AI Travel
          </h2>

          <p>
            Your Personal Planner
          </p>

        </div>

        {/* =========================================
            MENU
        ========================================= */}

        <nav className="sidebar-menu">

          {menuItems.map(
            (item) => (
              <button
                key={item.id}
                type="button"
                className={`sidebar-item ${
                  activePage === item.id
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActivePage(
                    item.id
                  )
                }
              >

                {item.icon}

                <span>
                  {item.title}
                </span>

              </button>
            )
          )}

        </nav>

      </div>

      {/* =========================================
          AI MATCH SCORE
      ========================================= */}

      <div className="sidebar-bottom">

        <div className="ai-card">

          <Sparkles size={22} />

          <h3>
            {validScore !== null
              ? `${validScore}%`
              : "—"}
          </h3>

          <p>
            AI Match Score
          </p>

          {matchReason && (
            <span className="ai-score-reason">
              {matchReason}
            </span>
          )}

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;