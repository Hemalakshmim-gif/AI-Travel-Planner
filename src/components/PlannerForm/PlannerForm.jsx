import "./PlannerForm.css";
import { useState } from "react";

const interestsList = [
  "Adventure",
  "Food",
  "Nature",
  "Shopping",
  "History",
  "Nightlife",
  "Photography",
  "Relaxation",
];

function PlannerForm({ onGenerate }) {
  const [formData, setFormData] = useState({
    destination: "",
    budget: "",
    startDate: "",
    days: "",
    travelers: "",
    hotel: "",
    transport: "",
    interests: [],
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const toggleInterest = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((item) => item !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = () => {
    if (
      !formData.destination ||
      !formData.budget ||
      !formData.startDate ||
      !formData.days
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const start = new Date(formData.startDate);
    const end = new Date(start);

    end.setDate(start.getDate() + Number(formData.days) - 1);

    const endDate = end.toISOString().split("T")[0];

    const payload = {
      destination: formData.destination,
      startDate: formData.startDate,
      endDate,
      travelers: Number(formData.travelers || 1),
      budget: Number(formData.budget),
      interests: formData.interests,
    };

    console.log(payload);

    if (onGenerate) {
      onGenerate(payload);
    }
  };

  return (
    <section id="planner" className="planner container">
      <div className="planner-header">
        <h2>Where would you like to go?</h2>

        <p>
          Tell our AI about your trip and we'll create a
          personalized itinerary in seconds.
        </p>
      </div>

      <div className="planner-card">
        <div className="planner-grid">
          <input
            name="destination"
            type="text"
            placeholder="Destination"
            value={formData.destination}
            onChange={handleChange}
          />

          <input
            name="budget"
            type="number"
            placeholder="Budget (₹)"
            value={formData.budget}
            onChange={handleChange}
          />

          <input
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
          />

          <select
            name="days"
            value={formData.days}
            onChange={handleChange}
          >
            <option value="">Number of Days</option>
            <option value="2">2 Days</option>
            <option value="3">3 Days</option>
            <option value="5">5 Days</option>
            <option value="7">7 Days</option>
            <option value="10">10 Days</option>
          </select>

          <select
            name="travelers"
            value={formData.travelers}
            onChange={handleChange}
          >
            <option value="">Travelers</option>
            <option value="1">Solo</option>
            <option value="2">Couple</option>
            <option value="4">Family</option>
            <option value="6">Group</option>
          </select>

          <select
            name="hotel"
            value={formData.hotel}
            onChange={handleChange}
          >
            <option value="">Hotel Preference</option>
            <option value="Budget">Budget</option>
            <option value="Standard">Standard</option>
            <option value="Luxury">Luxury</option>
            <option value="Resort">Resort</option>
          </select>

          <select
            name="transport"
            value={formData.transport}
            onChange={handleChange}
          >
            <option value="">Transportation</option>
            <option value="Flight">Flight</option>
            <option value="Train">Train</option>
            <option value="Bus">Bus</option>
            <option value="Car">Car</option>
          </select>
        </div>

        <div className="interest-section">
          <h4>Select Interests</h4>

          <div className="chips">
            {interestsList.map((interest) => (
              <button
                key={interest}
                type="button"
                className={
                  formData.interests.includes(interest)
                    ? "chip active"
                    : "chip"
                }
                onClick={() => toggleInterest(interest)}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <button
          className="generate-btn"
          onClick={handleSubmit}
        >
          ✨ Generate My Trip
        </button>
      </div>
    </section>
  );
}

export default PlannerForm;