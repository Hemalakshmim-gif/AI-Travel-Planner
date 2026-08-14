import "./AIThinking.css";
import { useEffect, useState } from "react";
import {
  Brain,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";

const thinkingSteps = [
  "Understanding your preferences",
  "Finding the best attractions",
  "Checking live weather",
  "Searching hotels within your budget",
  "Finding top-rated restaurants",
  "Calculating trip budget",
  "Building day-wise itinerary",
  "Preparing travel tips",
];

function AIThinking() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < thinkingSteps.length - 1) {
          return prev + 1;
        }

        clearInterval(interval);
        return prev;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="thinking container">

      <div className="thinking-card">

        <div className="thinking-header">

          <div className="brain-icon">
            <Brain size={30} />
          </div>

          <div>

            <h2>AI is Planning Your Journey</h2>

            <p>
              Our AI is analysing your preferences and
              generating a personalized travel itinerary.
            </p>

          </div>

        </div>

        <div className="thinking-steps">

          {thinkingSteps.map((step, index) => {

            let status = "pending";

            if (index < currentStep) {
              status = "done";
            } else if (index === currentStep) {
              status = "loading";
            }

            return (
              <div className="step" key={index}>

                {status === "done" && (
                  <CheckCircle2 className="done" />
                )}

                {status === "loading" && (
                  <LoaderCircle className="loading" />
                )}

                {status === "pending" && (
                  <div className="pending"></div>
                )}

                <span>{step}</span>

              </div>
            );
          })}

        </div>

      </div>

    </section>
  );
}

export default AIThinking;