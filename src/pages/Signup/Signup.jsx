import "./Signup.css";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Plane,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

import { registerUser } from "../../services/authService";

function Signup() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  // ============================
  // Handle Input Change
  // ============================

  const handleChange = (e) => {

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  };

  // ============================
  // Register User
  // ============================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      alert("Passwords do not match.");
      return;
    }

    try {

      setLoading(true);

      const { data } = await registerUser({

        fullName: formData.fullName,

        email: formData.email,

        password: formData.password,

      });

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      alert("Registration Successful!");

      navigate("/dashboard");

    } catch (error) {

      console.error(error);

      if (error.response) {

        alert(
          error.response.data.message
        );

      } else {

        alert("Server Error");

      }

    } finally {

      setLoading(false);

    }

  };

  return (

    <section className="signup-page">

      <div className="signup-container">

        {/* LEFT */}

        <div className="signup-left">

          <div className="brand">

            <div className="brand-icon">

              <Plane size={28} />

            </div>

            <h1>AI Travel Planner</h1>

          </div>

          <h2>

            Create your

            <br />

            travel account.

          </h2>

          <p>

            Join thousands of travelers using AI
            to discover destinations, build itineraries,
            estimate budgets and save unforgettable trips.

          </p>

          <div className="feature-list">

            <div>🌍 Explore New Destinations</div>

            <div>🤖 AI Travel Assistant</div>

            <div>💰 Smart Budget Planning</div>

            <div>📅 Save Unlimited Trips</div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="signup-right">

          <div className="signup-card">

            <h2>Create Account 🚀</h2>

            <p>

              Let's start planning your next adventure.

            </p>

            <form onSubmit={handleSubmit}>

              <div className="input-group">

                <User size={18} />

                <input

                  type="text"

                  name="fullName"

                  placeholder="Full Name"

                  value={formData.fullName}

                  onChange={handleChange}

                />

              </div>

              <div className="input-group">

                <Mail size={18} />

                <input

                  type="email"

                  name="email"

                  placeholder="Email Address"

                  value={formData.email}

                  onChange={handleChange}

                />

              </div>

              <div className="input-group">

                <Lock size={18} />

                <input

                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }

                  name="password"

                  placeholder="Password"

                  value={formData.password}

                  onChange={handleChange}

                />

                {showPassword ? (

                  <EyeOff

                    size={18}

                    className="password-eye"

                    onClick={() =>
                      setShowPassword(false)
                    }

                  />

                ) : (

                  <Eye

                    size={18}

                    className="password-eye"

                    onClick={() =>
                      setShowPassword(true)
                    }

                  />

                )}

              </div>

              <div className="input-group">

                <Lock size={18} />

                <input

                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }

                  name="confirmPassword"

                  placeholder="Confirm Password"

                  value={
                    formData.confirmPassword
                  }

                  onChange={handleChange}

                />

                {showConfirmPassword ? (

                  <EyeOff

                    size={18}

                    className="password-eye"

                    onClick={() =>
                      setShowConfirmPassword(
                        false
                      )
                    }

                  />

                ) : (

                  <Eye

                    size={18}

                    className="password-eye"

                    onClick={() =>
                      setShowConfirmPassword(
                        true
                      )
                    }

                  />

                )}

              </div>

              <div className="signup-options">

                <label>

                  <input
                    type="checkbox"
                    required
                  />

                  I agree to the Terms &
                  Privacy Policy

                </label>

              </div>

              <button

                className="signup-btn"

                type="submit"

                disabled={loading}

              >

                {loading
                  ? "Creating..."
                  : "Create Account"}

                <ArrowRight size={18} />

              </button>

            </form>

            <div className="divider">

              <span>OR</span>

            </div>

            <button className="google-btn">

              Continue with Google

            </button>

            <p className="login-text">

              Already have an account?

              <Link to="/login">

                Sign In

              </Link>

            </p>

          </div>

        </div>

      </div>

    </section>

  );

}

export default Signup;