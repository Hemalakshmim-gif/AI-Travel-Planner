import "./EditTrip.css";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Users,
  Wallet,
  Sparkles,
  Save,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";

import {
  getTripById,
  updateTrip,
  regenerateTrip,
} from "../../services/tripService";


const INTEREST_OPTIONS = [
  "Adventure",
  "Food",
  "Relaxation",
  "Nature",
  "Photography",
  "Nightlife",
  "Shopping",
  "Culture",
];


function EditTrip() {

  const {
    id,
  } = useParams();

  const navigate =
    useNavigate();


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    saving,
    setSaving,
  ] = useState(false);


  const [
    regenerating,
    setRegenerating,
  ] = useState(false);


  const [
    showRegenerate,
    setShowRegenerate,
  ] = useState(false);


  const [
    formData,
    setFormData,
  ] = useState({

    destination: "",

    startDate: "",

    endDate: "",

    travelers: 1,

    budget: "",

    interests: [],

  });


  // ======================================
  // Load Trip
  // ======================================

  useEffect(() => {

    let mounted = true;


    const loadTrip = async () => {

      try {

        const response =
          await getTripById(id);


        const trip =
          response.data.trip;


        if (!mounted) return;


        let interests = [];


        try {

          if (
            Array.isArray(
              trip.interests
            )
          ) {

            interests =
              trip.interests;

          } else if (
            typeof trip.interests ===
            "string"
          ) {

            interests =
              JSON.parse(
                trip.interests
              );

          }

        } catch {

          interests = [];

        }


        setFormData({

          destination:
            trip.destination || "",

          startDate:
            trip.start_date
              ? trip.start_date
                  .toString()
                  .slice(0, 10)
              : "",

          endDate:
            trip.end_date
              ? trip.end_date
                  .toString()
                  .slice(0, 10)
              : "",

          travelers:
            trip.travelers || 1,

          budget:
            trip.budget || "",

          interests,

        });

      } catch (error) {

        console.error(
          "Failed to load trip:",
          error
        );

        alert(
          error.response?.data?.message ||
          "Unable to load trip."
        );

        navigate(
          "/saved-trips"
        );

      } finally {

        if (mounted) {

          setLoading(false);

        }

      }

    };


    loadTrip();


    return () => {

      mounted = false;

    };

  }, [
    id,
    navigate,
  ]);


  // ======================================
  // Input Change
  // ======================================

  const handleChange = (
    event
  ) => {

    const {
      name,
      value,
    } = event.target;


    setFormData(
      (prev) => ({

        ...prev,

        [name]: value,

      })
    );

  };


  // ======================================
  // Toggle Interest
  // ======================================

  const toggleInterest = (
    interest
  ) => {

    setFormData(
      (prev) => {

        const exists =
          prev.interests.includes(
            interest
          );


        return {

          ...prev,

          interests: exists

            ? prev.interests.filter(
                (item) =>
                  item !== interest
              )

            : [
                ...prev.interests,
                interest,
              ],

        };

      }
    );

  };


  // ======================================
  // Save Basic Changes
  // ======================================

  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();


    if (
      !formData.destination.trim()
    ) {

      alert(
        "Please enter a destination."
      );

      return;

    }


    if (
      !formData.startDate ||
      !formData.endDate
    ) {

      alert(
        "Please select both dates."
      );

      return;

    }


    if (
      new Date(
        formData.endDate
      ) <
      new Date(
        formData.startDate
      )
    ) {

      alert(
        "End date cannot be before start date."
      );

      return;

    }


    if (
      Number(
        formData.travelers
      ) < 1
    ) {

      alert(
        "Travelers must be at least 1."
      );

      return;

    }


    if (
      Number(
        formData.budget
      ) <= 0
    ) {

      alert(
        "Please enter a valid budget."
      );

      return;

    }


    try {

      setSaving(true);


      await updateTrip(

        id,

        {

          destination:
            formData.destination.trim(),

          startDate:
            formData.startDate,

          endDate:
            formData.endDate,

          travelers:
            Number(
              formData.travelers
            ),

          budget:
            Number(
              formData.budget
            ),

          interests:
            formData.interests,

        }

      );


      setShowRegenerate(true);

    } catch (error) {

      console.error(
        "Update Trip Error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to update trip."
      );

    } finally {

      setSaving(false);

    }

  };


  // ======================================
  // Regenerate AI
  // ======================================

  const handleRegenerate = async () => {

    try {

      setRegenerating(true);


      await regenerateTrip(id);


      alert(
        "✨ Your AI travel plan has been regenerated successfully!"
      );


      navigate(
        `/trip/${id}`
      );

    } catch (error) {

      console.error(
        "AI Regeneration Error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "AI regeneration failed. Please try again."
      );

    } finally {

      setRegenerating(false);

    }

  };


  // ======================================
  // Continue Without Regeneration
  // ======================================

  const handleContinue = () => {

    navigate(
      `/trip/${id}`
    );

  };


  // ======================================
  // Loading
  // ======================================

  if (loading) {

    return (

      <section className="edit-trip-page">

        <div className="edit-loading">

          <LoaderCircle
            size={36}
            className="spin"
          />

          <h2>
            Loading trip...
          </h2>

          <p>
            Preparing your trip details.
          </p>

        </div>

      </section>

    );

  }


  // ======================================
  // Regeneration Choice
  // ======================================

  if (showRegenerate) {

    return (

      <section className="edit-trip-page">

        <div className="regenerate-container">


          <div className="regenerate-icon">

            <Sparkles
              size={38}
            />

          </div>


          <span className="edit-label">

            TRIP UPDATED

          </span>


          <h1>
            Your trip has changed ✨
          </h1>


          <p>

            Would you like our AI to
            regenerate your itinerary,
            hotels, restaurants, budget,
            packing list and other
            recommendations based on
            your new trip details?

          </p>


          <div className="regenerate-preview">

            <div>

              <span>
                Destination
              </span>

              <strong>
                {formData.destination}
              </strong>

            </div>


            <div>

              <span>
                Budget
              </span>

              <strong>
                ₹
                {Number(
                  formData.budget
                ).toLocaleString()}
              </strong>

            </div>


            <div>

              <span>
                Travelers
              </span>

              <strong>
                {formData.travelers}
              </strong>

            </div>

          </div>


          <button
            className="regenerate-btn"
            onClick={
              handleRegenerate
            }
            disabled={
              regenerating
            }
          >

            {regenerating ? (

              <>

                <LoaderCircle
                  size={20}
                  className="spin"
                />

                AI is rebuilding
                your trip...

              </>

            ) : (

              <>

                <RefreshCw
                  size={20}
                />

                Regenerate AI Plan

              </>

            )}

          </button>


          <button
            className="continue-btn"
            onClick={
              handleContinue
            }
            disabled={
              regenerating
            }
          >

            Keep Existing AI Plan

          </button>


        </div>

      </section>

    );

  }


  // ======================================
  // Main UI
  // ======================================

  return (

    <section className="edit-trip-page">

      <div className="edit-trip-container">


        <button
          className="back-btn"
          onClick={() =>
            navigate(
              "/saved-trips"
            )
          }
        >

          <ArrowLeft size={18} />

          Back to Saved Trips

        </button>


        <div className="edit-header">

          <div className="edit-header-icon">

            <Sparkles size={30} />

          </div>


          <div>

            <span className="edit-label">

              AI TRAVEL PLANNER

            </span>

            <h1>
              Edit Your Trip
            </h1>

            <p>

              Update your trip details
              and regenerate your AI
              recommendations whenever
              you need.

            </p>

          </div>

        </div>


        <form
          className="edit-form"
          onSubmit={
            handleSubmit
          }
        >


          {/* Destination */}

          <div className="form-group">

            <label>
              Destination
            </label>

            <div className="input-wrapper">

              <MapPin size={19} />

              <input
                type="text"
                name="destination"
                value={
                  formData.destination
                }
                onChange={
                  handleChange
                }
                placeholder="Enter destination"
              />

            </div>

          </div>


          {/* Dates */}

          <div className="form-row">

            <div className="form-group">

              <label>
                Start Date
              </label>

              <div className="input-wrapper">

                <CalendarDays
                  size={19}
                />

                <input
                  type="date"
                  name="startDate"
                  value={
                    formData.startDate
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

            </div>


            <div className="form-group">

              <label>
                End Date
              </label>

              <div className="input-wrapper">

                <CalendarDays
                  size={19}
                />

                <input
                  type="date"
                  name="endDate"
                  value={
                    formData.endDate
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

            </div>

          </div>


          {/* Travelers + Budget */}

          <div className="form-row">

            <div className="form-group">

              <label>
                Travelers
              </label>

              <div className="input-wrapper">

                <Users size={19} />

                <input
                  type="number"
                  name="travelers"
                  min="1"
                  value={
                    formData.travelers
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

            </div>


            <div className="form-group">

              <label>
                Budget
              </label>

              <div className="input-wrapper">

                <Wallet size={19} />

                <span className="currency">
                  ₹
                </span>

                <input
                  type="number"
                  name="budget"
                  min="1"
                  value={
                    formData.budget
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="60000"
                />

              </div>

            </div>

          </div>


          {/* Interests */}

          <div className="form-group">

            <label>
              Travel Interests
            </label>

            <p className="interest-description">

              Select the experiences
              you're interested in.

            </p>


            <div className="interest-grid">

              {INTEREST_OPTIONS.map(
                (interest) => {

                  const selected =
                    formData.interests.includes(
                      interest
                    );


                  return (

                    <button
                      type="button"
                      key={interest}
                      className={
                        selected
                          ? "interest-btn selected"
                          : "interest-btn"
                      }
                      onClick={() =>
                        toggleInterest(
                          interest
                        )
                      }
                    >

                      {interest}

                    </button>

                  );

                }
              )}

            </div>

          </div>


          {/* Notice */}

          <div className="edit-notice">

            <Sparkles size={20} />

            <div>

              <strong>
                AI-powered regeneration
              </strong>

              <p>

                After saving, you can ask
                the AI to rebuild your
                itinerary and recommendations
                using your updated trip details.

              </p>

            </div>

          </div>


          {/* Actions */}

          <div className="edit-actions">

            <button
              type="button"
              className="cancel-btn"
              onClick={() =>
                navigate(
                  "/saved-trips"
                )
              }
              disabled={saving}
            >

              Cancel

            </button>


            <button
              type="submit"
              className="save-btn"
              disabled={saving}
            >

              {saving ? (

                <>

                  <LoaderCircle
                    size={18}
                    className="spin"
                  />

                  Saving...

                </>

              ) : (

                <>

                  <Save size={18} />

                  Save Changes

                </>

              )}

            </button>

          </div>


        </form>

      </div>

    </section>

  );

}


export default EditTrip;