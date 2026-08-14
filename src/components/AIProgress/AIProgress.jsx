import "./AIProgress.css";

import {
  Brain,
  MapPinned,
  Wallet,
  Hotel,
  Utensils,
  CloudSun,
  Backpack,
  CalendarCheck,
  CheckCircle2,
} from "lucide-react";

const steps = [
  {
    icon: <Brain size={24} />,
    title: "Understanding your requirements",
    status: "completed",
  },
  {
    icon: <MapPinned size={24} />,
    title: "Analyzing destination",
    status: "completed",
  },
  {
    icon: <Wallet size={24} />,
    title: "Estimating travel budget",
    status: "completed",
  },
  {
    icon: <Hotel size={24} />,
    title: "Finding best hotels",
    status: "loading",
  },
  {
    icon: <Utensils size={24} />,
    title: "Finding restaurants",
    status: "pending",
  },
  {
    icon: <CloudSun size={24} />,
    title: "Checking weather",
    status: "pending",
  },
  {
    icon: <Backpack size={24} />,
    title: "Preparing packing list",
    status: "pending",
  },
  {
    icon: <CalendarCheck size={24} />,
    title: "Building itinerary",
    status: "pending",
  },
];

function AIProgress() {
  return (
    <section className="ai-progress">

      <h1>AI is Planning Your Trip ✈️</h1>

      <p>
        Please wait while our AI agents prepare your personalized travel plan.
      </p>

      <div className="progress-card">

        {steps.map((step, index) => (

          <div
            className={`progress-item ${step.status}`}
            key={index}
          >

            <div className="progress-icon">

              {step.status === "completed" ? (
                <CheckCircle2 size={24} />
              ) : (
                step.icon
              )}

            </div>

            <span>{step.title}</span>

            {step.status === "loading" && (
              <div className="loader"></div>
            )}

          </div>

        ))}

      </div>

    </section>
  );
}

export default AIProgress;