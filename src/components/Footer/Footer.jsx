import "./Footer.css";

import { Plane, Send } from "lucide-react";
import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaXTwitter,
} from "react-icons/fa6";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand */}

        <div className="footer-brand">

          <div className="footer-logo">

            <div className="footer-logo-icon">
              <Plane size={20} />
            </div>

            <h2>AI Travel Planner</h2>

          </div>

          <p>
            Plan smarter with AI. Discover destinations, hotels,
            restaurants, itineraries and budgets in one place.
          </p>

          <div className="social-icons">

            <a href="https://github.com" target="_blank" rel="noreferrer">
              <FaGithub size={20} />
            </a>

            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              <FaLinkedin size={20} />
            </a>

            <a href="https://x.com" target="_blank" rel="noreferrer">
              <FaXTwitter size={20} />
            </a>

            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <FaInstagram size={20} />
            </a>

          </div>

        </div>

        {/* Quick Links */}

        <div className="footer-links">

          <h3>Quick Links</h3>

          <p>Home</p>
          <p>Planner</p>
          <p>Saved Trips</p>
          <p>Compare</p>

        </div>

        {/* Company */}

        <div className="footer-links">

          <h3>Company</h3>

          <p>About</p>
          <p>Contact</p>
          <p>Privacy Policy</p>
          <p>Terms & Conditions</p>

        </div>

        {/* Newsletter */}

        <div className="footer-newsletter">

          <h3>Newsletter</h3>

          <p>
            Subscribe to receive AI travel tips and destination updates.
          </p>

          <div className="newsletter-box">

            <input
              type="email"
              placeholder="Enter your email"
            />

            <button>
              <Send size={18} />
            </button>

          </div>

        </div>

      </div>

      <div className="footer-bottom">

        <p>© 2026 AI Travel Planner. All Rights Reserved.</p>

        <span>Made with ❤️ using React & AI</span>

      </div>
    </footer>
  );
}

export default Footer;