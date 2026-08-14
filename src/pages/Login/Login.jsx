import "./Login.css";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Plane,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

import { loginUser } from "../../services/authService";

function Login() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  };

  // ===========================
  // Login
  // ===========================

  const handleLogin = async (e) => {

    e.preventDefault();

    if (!formData.email || !formData.password) {

      alert("Please enter Email and Password.");

      return;

    }

    try {

      setLoading(true);

      const { data } = await loginUser(formData);

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      alert("Login Successful!");

      navigate("/dashboard");

    } catch (error) {

      console.error(error);

      if (error.response) {

        alert(error.response.data.message);

      } else {

        alert("Server Error");

      }

    } finally {

      setLoading(false);

    }

  };

  return (

    <section className="login-page">

      <div className="login-container">

        {/* LEFT */}

        <div className="login-left">

          <div className="brand">

            <div className="brand-icon">

              <Plane size={28} />

            </div>

            <h1>AI Travel Planner</h1>

          </div>

          <h2>

            Plan smarter,

            <br />

            travel better.

          </h2>

          <p>

            Generate personalized itineraries,
            discover hotels, restaurants,
            budgets and much more using AI.

          </p>

          <div className="feature-list">

            <div>✈ AI Powered Itineraries</div>

            <div>🏨 Smart Hotel Suggestions</div>

            <div>🍽 Personalized Restaurants</div>

            <div>🎒 Packing Checklist</div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="login-right">

          <div className="login-card">

            <h2>Welcome Back 👋</h2>

            <p>Sign in to continue your journey.</p>

            <form onSubmit={handleLogin}>

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
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />

                {showPassword ? (

                  <EyeOff
                    size={18}
                    className="password-eye"
                    onClick={() => setShowPassword(false)}
                  />

                ) : (

                  <Eye
                    size={18}
                    className="password-eye"
                    onClick={() => setShowPassword(true)}
                  />

                )}

              </div>

              <div className="login-options">

                <label>

                  <input type="checkbox" />

                  Remember Me

                </label>

                <button
                  type="button"
                  className="forgot-btn"
                >
                  Forgot Password?
                </button>

              </div>

              <button
                className="login-btn"
                type="submit"
                disabled={loading}
              >

                {loading ? "Signing In..." : "Sign In"}

                <ArrowRight size={18} />

              </button>

            </form>

            <div className="divider">

              <span>OR</span>

            </div>

            <button className="google-btn">

              Continue with Google

            </button>

            <p className="signup-text">

              Don't have an account?

              <Link to="/signup">

                Sign Up

              </Link>

            </p>

          </div>

        </div>

      </div>

    </section>

  );

}

export default Login;