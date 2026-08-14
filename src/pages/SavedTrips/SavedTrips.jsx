import "./SavedTrips.css";

import {
  useState,
  useEffect,
  useCallback,
} from "react";

import { useNavigate } from "react-router-dom";

import { Plus } from "lucide-react";

import {
  getTrips,
  deleteTrip,
} from "../../services/tripService";

import TripCard from "./TripCard";

function SavedTrips() {

  const [trips, setTrips] = useState([]);

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ===========================================
  // Load Trips
  // ===========================================

  const loadTrips = useCallback(async () => {

    try {

      const response = await getTrips();

      setTrips(response.data.trips);

    }

    catch (error) {

      console.error("Failed to load trips:", error);

    }

    finally {

      setLoading(false);

    }

  }, []);

  // ===========================================
  // Load On Mount
  // ===========================================

  useEffect(() => {

    loadTrips();

  }, [loadTrips]);

  // ===========================================
  // Delete Trip
  // ===========================================

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this trip?"
    );

    if (!confirmDelete) return;

    try {

      await deleteTrip(id);

      setTrips((prevTrips) =>
        prevTrips.filter(
          (trip) => trip.id !== id
        )
      );

    }

    catch (error) {

      console.error("Delete failed:", error);

    }

  };

  // ===========================================
  // View Trip
  // ===========================================

  const handleView = (trip) => {

    navigate(`/trip/${trip.id}`);

  };

  // ===========================================
  // Loading State
  // ===========================================

  if (loading) {

    return (

      <section className="saved-trips-page">

        <div className="container">

          <h2>Loading your trips...</h2>

        </div>

      </section>

    );

  }

  // ===========================================
  // Empty State
  // ===========================================

  if (trips.length === 0) {

    return (

      <section className="saved-trips-page">

        <div className="container">

          <div className="saved-header">

            <div>

              <h1>Saved Trips</h1>

              <p>
                You haven't generated any AI trips yet.
              </p>

            </div>

            <button
              className="new-trip-btn"
              onClick={() => navigate("/planner")}
            >

              <Plus size={18} />

              Generate Trip

            </button>

          </div>

        </div>

      </section>

    );

  }

  // ===========================================
  // UI
  // ===========================================

  return (

    <section className="saved-trips-page">

      <div className="container">

        <div className="saved-header">

          <div>

            <h1>Saved Trips</h1>

            <p>

              Access, edit and manage all your AI generated trips.

            </p>

          </div>

          <button
            className="new-trip-btn"
            onClick={() => navigate("/planner")}
          >

            <Plus size={18} />

            New Trip

          </button>

        </div>

        <div className="saved-grid">

          {trips.map((trip) => (

            <TripCard

              key={trip.id}

              trip={trip}

              onDelete={handleDelete}

              onView={handleView}

            />

          ))}

        </div>

      </div>

    </section>

  );

}

export default SavedTrips;