import "./HowItWorks.css";

import {
  MapPinned,
  BrainCircuit,
  Route,
  Plane,
} from "lucide-react";

const steps = [
  {
    icon: <MapPinned size={34} />,
    number: "01",
    title: "Enter Trip Details",
    description:
      "Choose your destination, travel dates, budget and preferences.",
  },
  {
    icon: <BrainCircuit size={34} />,
    number: "02",
    title: "AI Analyzes",
    description:
      "Our AI searches hotels, restaurants, weather and attractions.",
  },
  {
    icon: <Route size={34} />,
    number: "03",
    title: "Generate Itinerary",
    description:
      "Receive a personalized travel plan with budget and packing list.",
  },
  {
    icon: <Plane size={34} />,
    number: "04",
    title: "Travel Smart",
    description:
      "Enjoy your trip with all your travel information in one place.",
  },
];

function HowItWorks() {
  return (
    <section className="how-section">

      <div className="container">

        <div className="section-title">

          <span>How It Works</span>

          <h2>
            Plan Your Entire Journey in
            <span> 4 Simple Steps</span>
          </h2>

          <p>
            Let AI do the planning while you enjoy your journey.
          </p>

        </div>

        <div className="steps-grid">

          {steps.map((step) => (

            <div
              className="step-card"
              key={step.number}
            >

              <div className="step-number">
                {step.number}
              </div>

              <div className="step-icon">
                {step.icon}
              </div>

              <h3>{step.title}</h3>

              <p>{step.description}</p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default HowItWorks;