import "./Navbar.css";

import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  Plane,
  Menu,
  X,
  LogOut,
} from "lucide-react";

import SearchBar from "../Search/SearchBar";
import NotificationBell from "../Notifications/NotificationBell";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import ProfileMenu from "../ProfileMenu/ProfileMenu";

function Navbar() {

  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);

  // ===========================================
  // LOGIN STATUS
  // ===========================================

  const isLoggedIn =
    !!localStorage.getItem("token");

  // ===========================================
  // GET LOGGED-IN USER
  // ===========================================

  const storedUser =
    localStorage.getItem("user");

  let user = {};

  try {

    user = storedUser
      ? JSON.parse(storedUser)
      : {};

  } catch (error) {

    console.error(
      "Failed to read user:",
      error
    );

    user = {};

  }

  // ===========================================
  // USER NAME
  // ===========================================

  const userName =
    user?.fullName ||
    user?.name ||
    "User";

  // ===========================================
  // USER INITIAL
  // ===========================================

  const userInitial =
    userName
      .trim()
      .charAt(0)
      .toUpperCase() || "U";

  // ===========================================
  // CLOSE MOBILE MENU
  // ===========================================

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // ===========================================
  // HOME
  // ===========================================

  const goHome = () => {

    navigate("/");

    closeMenu();

  };

  // ===========================================
  // ABOUT
  // ===========================================

  const goToAbout = () => {

    navigate("/");

    setTimeout(() => {

      const section =
        document.getElementById("about");

      if (section) {

        section.scrollIntoView({
          behavior: "smooth",
        });

      }

    }, 200);

    closeMenu();

  };

  // ===========================================
  // LOGOUT
  // ===========================================

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    setProfileOpen(false);

    closeMenu();

    navigate("/");

  };

  // ===========================================
  // CLOSE PROFILE DROPDOWN
  // ===========================================

  useEffect(() => {

    const handleClickOutside = (event) => {

      if (
        profileRef.current &&
        !profileRef.current.contains(
          event.target
        )
      ) {

        setProfileOpen(false);

      }

    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);

  // ===========================================
  // RENDER
  // ===========================================

  return (

    <header className="navbar">

      <div className="container navbar-container">

        {/* ===========================================
            LOGO
        =========================================== */}

        <div
          className="logo"
          onClick={() => {

            if (isLoggedIn) {

              navigate("/dashboard");

            } else {

              goHome();

            }

          }}
        >

          <div className="logo-icon">

            <Plane size={20} />

          </div>

          <span>
            AI Travel Planner
          </span>

        </div>


        {/* ===========================================
            NAVIGATION
        =========================================== */}

        <nav
          className={
            menuOpen
              ? "nav active"
              : "nav"
          }
        >

          {!isLoggedIn ? (

            <>

              <NavLink
                to="/"
                onClick={closeMenu}
              >
                Home
              </NavLink>

              <button
                className="nav-link-btn"
                onClick={goToAbout}
              >
                About
              </button>

            </>

          ) : (

            <>

              <NavLink
                to="/dashboard"
                onClick={closeMenu}
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/planner"
                onClick={closeMenu}
              >
                Planner
              </NavLink>

              <NavLink
                to="/saved-trips"
                onClick={closeMenu}
              >
                My Trips
              </NavLink>

              <NavLink
                to="/compare"
                onClick={closeMenu}
              >
                Compare
              </NavLink>

            </>

          )}

        </nav>


        {/* ===========================================
            RIGHT SIDE
        =========================================== */}

        <div className="nav-actions">

          {/* DARK MODE */}

          <ThemeToggle />


          {isLoggedIn ? (

            <>

              {/* SEARCH */}

              <SearchBar />


              {/* NOTIFICATIONS */}

              <NotificationBell />


              {/* ===========================================
                  PROFILE
              =========================================== */}

              <div
                className="profile-wrapper"
                ref={profileRef}
              >

                <button
                  className="avatar-btn"
                  onClick={() =>
                    setProfileOpen(
                      !profileOpen
                    )
                  }
                  aria-label={`Open ${userName} profile`}
                >

                  {userInitial}

                </button>


                <ProfileMenu
                  open={profileOpen}
                  navigate={navigate}
                  onLogout={handleLogout}
                />

              </div>


              {/* ===========================================
                  LOGOUT ICON
              =========================================== */}

              <button
                className="logout-btn"
                onClick={handleLogout}
                aria-label="Logout"
                title="Logout"
              >

                <LogOut size={18} />

              </button>

            </>

          ) : (

            <>

              {/* SIGN IN */}

              <button
                className="signin-btn"
                onClick={() =>
                  navigate("/login")
                }
              >
                Sign In
              </button>


              {/* GET STARTED */}

              <button
                className="start-btn"
                onClick={() =>
                  navigate("/signup")
                }
              >
                Get Started
              </button>

            </>

          )}

        </div>


        {/* ===========================================
            MOBILE MENU
        =========================================== */}

        <button
          className="mobile-menu"
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
          aria-label="Toggle navigation menu"
        >

          {menuOpen ? (

            <X size={24} />

          ) : (

            <Menu size={24} />

          )}

        </button>

      </div>

    </header>

  );

}

export default Navbar;