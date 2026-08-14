import "./Profile.css";

import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Heart,
  Edit3,
  Plane,
  Calendar,
  Wallet,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import { getTrips } from "../../services/tripService";

function Profile() {

  // =====================================================
  // USER
  // =====================================================

  const [user, setUser] = useState(null);

  // =====================================================
  // TRIPS
  // =====================================================

  const [trips, setTrips] = useState([]);

  const [loading, setLoading] = useState(true);

  // =====================================================
  // LOAD USER + TRIPS
  // =====================================================

  useEffect(() => {

    const loadProfile = async () => {

      try {

        // ================================================
        // LOAD LOGGED-IN USER
        // ================================================

        const storedUser =
          localStorage.getItem("user");

        if (storedUser) {

          try {

            setUser(
              JSON.parse(storedUser)
            );

          } catch (error) {

            console.error(
              "Failed to parse user:",
              error
            );

          }

        }

        // ================================================
        // LOAD USER'S TRIPS
        // ================================================

        const response =
          await getTrips();

        const data =
          response?.data;

        if (
          data?.success &&
          Array.isArray(data.trips)
        ) {

          setTrips(data.trips);

        } else {

          setTrips([]);

        }

      } catch (error) {

        console.error(
          "Profile loading error:",
          error
        );

        setTrips([]);

      } finally {

        setLoading(false);

      }

    };

    loadProfile();

  }, []);


  // =====================================================
  // USER NAME
  // =====================================================

  const fullName =
    user?.fullName ||
    user?.full_name ||
    "Traveler";

  const firstName =
    fullName
      .trim()
      .split(/\s+/)[0] ||
    "Traveler";


  // =====================================================
  // USER EMAIL
  // =====================================================

  const email =
    user?.email ||
    "Email not available";


  // =====================================================
  // PROFILE INITIAL
  // =====================================================

  const profileInitial =
    fullName
      .trim()
      .charAt(0)
      .toUpperCase() ||
    "T";


  // =====================================================
  // PROFILE IMAGE
  // =====================================================

  const profileImage =
    user?.profileImage ||
    user?.profile_image ||
    null;


  // =====================================================
  // TRIP STATISTICS
  // =====================================================

  const statistics = useMemo(() => {

    if (!Array.isArray(trips)) {

      return {
        tripCount: 0,
        travelDays: 0,
        totalBudget: 0,
        favoriteDestination: "—",
      };

    }


    // ================================================
    // TRIPS PLANNED
    // ================================================

    const tripCount =
      trips.length;


    // ================================================
    // TOTAL TRAVEL DAYS
    // ================================================

    let travelDays = 0;


    trips.forEach((trip) => {

      const startDate =
        trip.startDate ||
        trip.start_date;

      const endDate =
        trip.endDate ||
        trip.end_date;

      if (
        !startDate ||
        !endDate
      ) {
        return;
      }

      const start =
        new Date(startDate);

      const end =
        new Date(endDate);

      if (
        Number.isNaN(
          start.getTime()
        ) ||
        Number.isNaN(
          end.getTime()
        )
      ) {
        return;
      }

      const difference =
        end.getTime() -
        start.getTime();

      // Inclusive calculation
      const days =
        Math.round(
          difference /
            (1000 * 60 * 60 * 24)
        ) + 1;

      if (days > 0) {

        travelDays += days;

      }

    });


    // ================================================
    // TOTAL BUDGET
    // ================================================

    const totalBudget =
      trips.reduce(
        (total, trip) => {

          const budget =
            Number(
              trip.budget
            ) || 0;

          return total + budget;

        },
        0
      );


    // ================================================
    // FAVORITE DESTINATION
    // ================================================

    const destinationCount =
      {};

    trips.forEach((trip) => {

      const destination =
        trip.destination
          ?.trim();

      if (!destination) {
        return;
      }

      const key =
        destination.toLowerCase();

      if (
        !destinationCount[key]
      ) {

        destinationCount[key] = {
          name: destination,
          count: 0,
        };

      }

      destinationCount[key].count += 1;

    });


    let favoriteDestination =
      "—";

    const destinations =
      Object.values(
        destinationCount
      );

    if (destinations.length > 0) {

      destinations.sort(
        (a, b) =>
          b.count - a.count
      );

      favoriteDestination =
        destinations[0].name;

    }


    return {
      tripCount,
      travelDays,
      totalBudget,
      favoriteDestination,
    };

  }, [trips]);


  // =====================================================
  // TRAVEL INTERESTS
  // =====================================================

  const interests = useMemo(() => {

    const interestMap =
      new Map();

    trips.forEach((trip) => {

      const tripInterests =
        Array.isArray(
          trip.interests
        )
          ? trip.interests
          : [];

      tripInterests.forEach(
        (interest) => {

          if (
            typeof interest !==
            "string"
          ) {
            return;
          }

          const clean =
            interest.trim();

          if (!clean) {
            return;
          }

          const key =
            clean.toLowerCase();

          if (!interestMap.has(key)) {

            interestMap.set(
              key,
              clean
            );

          }

        }
      );

    });

    return Array.from(
      interestMap.values()
    );

  }, [trips]);


  // =====================================================
  // DISPLAY INTERESTS
  // =====================================================

  const displayInterests =
    interests.length > 0
      ? interests
      : [
          "No travel interests yet",
        ];


  // =====================================================
  // EDIT PROFILE
  // =====================================================

  const handleEditProfile = () => {

    alert(
      "Profile editing will be available soon."
    );

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <section className="profile-page">

        <div className="profile-loading">

          <div className="profile-loading-icon">

            <User size={32} />

          </div>

          <h2>
            Loading your profile...
          </h2>

          <p>
            Fetching your travel information.
          </p>

        </div>

      </section>

    );

  }


  // =====================================================
  // UI
  // =====================================================

  return (

    <section className="profile-page">

      {/* ============================================
          COVER
      ============================================ */}

      <div className="profile-cover"></div>


      {/* ============================================
          PROFILE HEADER
      ============================================ */}

      <div className="profile-card">

        <div className="profile-avatar">

          {profileImage ? (

            <img
              src={profileImage}
              alt={fullName}
            />

          ) : (

            <span>
              {profileInitial}
            </span>

          )}

        </div>


        <h1>
          {fullName}
        </h1>


        <p className="profile-role">

          AI Travel Enthusiast

        </p>


        <button
          type="button"
          className="edit-profile-btn"
          onClick={
            handleEditProfile
          }
        >

          <Edit3 size={18} />

          Edit Profile

        </button>

      </div>


      {/* ============================================
          PROFILE INFORMATION
      ============================================ */}

      <div className="profile-grid">

        {/* ==========================================
            PERSONAL INFORMATION
        ========================================== */}

        <div className="profile-section">

          <h2>
            Personal Information
          </h2>


          {/* EMAIL */}

          <div className="profile-item">

            <Mail size={18} />

            <span>
              {email}
            </span>

          </div>


          {/* PHONE */}

          <div className="profile-item">

            <Phone size={18} />

            <span>
              Phone number not added
            </span>

          </div>


          {/* LOCATION */}

          <div className="profile-item">

            <MapPin size={18} />

            <span>
              Location not added
            </span>

          </div>


          {/* LANGUAGE */}

          <div className="profile-item">

            <Globe size={18} />

            <span>
              English
            </span>

          </div>

        </div>


        {/* ==========================================
            TRAVEL INTERESTS
        ========================================== */}

        <div className="profile-section">

          <h2>
            Travel Interests
          </h2>


          <div className="interest-list">

            {displayInterests.map(
              (interest, index) => (

                <span
                  key={
                    `${interest}-${index}`
                  }
                >

                  {interest}

                </span>

              )
            )}

          </div>

        </div>

      </div>


      {/* ============================================
          TRAVEL STATISTICS
      ============================================ */}

      <div className="travel-stats">


        {/* ==========================================
            TRIPS
        ========================================== */}

        <div className="stat-box">

          <Plane size={28} />

          <h3>
            {statistics.tripCount}
          </h3>

          <p>
            Trips Planned
          </p>

        </div>


        {/* ==========================================
            TRAVEL DAYS
        ========================================== */}

        <div className="stat-box">

          <Calendar size={28} />

          <h3>
            {statistics.travelDays}
          </h3>

          <p>
            Travel Days
          </p>

        </div>


        {/* ==========================================
            TOTAL BUDGET
        ========================================== */}

        <div className="stat-box">

          <Wallet size={28} />

          <h3>
            ₹
            {statistics.totalBudget.toLocaleString(
              "en-IN"
            )}
          </h3>

          <p>
            Total Budget
          </p>

        </div>


        {/* ==========================================
            FAVORITE DESTINATION
        ========================================== */}

        <div className="stat-box">

          <Heart size={28} />

          <h3
            title={
              statistics.favoriteDestination
            }
          >
            {
              statistics.favoriteDestination
            }
          </h3>

          <p>
            Favorite Destination
          </p>

        </div>

      </div>

    </section>

  );

}

export default Profile;