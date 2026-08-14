import { Routes, Route } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import AppLayout from "./layouts/AppLayout";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

// ==========================================
// PUBLIC PAGES
// ==========================================

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";

// ==========================================
// PROTECTED PAGES
// ==========================================

import Planner from "./pages/Planner/Planner";
import SavedTrips from "./pages/SavedTrips/SavedTrips";
import Compare from "./pages/Compare/Compare";
import TripDetails from "./pages/TripDetails/TripDetails";
import EditTrip from "./pages/EditTrip/EditTrip";
import Settings from "./pages/Settings/Settings";
import Profile from "./pages/Profile/Profile";

// ==========================================
// COMPONENT PAGES
// ==========================================

import Dashboard from "./components/dashboard/Dashboard/Dashboard";
import AIProgress from "./components/AIProgress/AIProgress";

// ==========================================
// 404
// ==========================================

import NotFound from "./pages/NotFound/NotFound";


function App() {

  return (

    <Routes>

      {/* ==================================================
          PUBLIC ROUTES
      ================================================== */}

      <Route element={<PublicLayout />}>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

      </Route>


      {/* ==================================================
          PROTECTED ROUTES
      ================================================== */}

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >

        {/* =========================
            DASHBOARD
        ========================= */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />


        {/* =========================
            PLANNER
        ========================= */}

        <Route
          path="/planner"
          element={<Planner />}
        />


        {/* =========================
            SAVED TRIPS
        ========================= */}

        <Route
          path="/saved-trips"
          element={<SavedTrips />}
        />
        <Route
         path="/edit-trip/:id"
          element={<EditTrip />}
        />

        {/* =========================
            VIEW SINGLE TRIP
        ========================= */}

        <Route
          path="/trip/:id"
          element={<TripDetails />}
        />


        {/* =========================
            COMPARE TRIPS
        ========================= */}

        <Route
          path="/compare"
          element={<Compare />}
        />


        {/* =========================
            SETTINGS
        ========================= */}

        <Route
          path="/settings"
          element={<Settings />}
        />


        {/* =========================
            PROFILE
        ========================= */}

        <Route
          path="/profile"
          element={<Profile />}
        />


        {/* =========================
            AI PROGRESS
        ========================= */}

        <Route
          path="/ai-progress"
          element={<AIProgress />}
        />

      </Route>


      {/* ==================================================
          404
      ================================================== */}

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>

  );
}

export default App;