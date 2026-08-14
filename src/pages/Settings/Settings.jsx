import "./Settings.css";
import { Globe, DollarSign, Ruler, Bell, Moon, Save } from "lucide-react";

function Settings() {
  return (
    <section className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Customize your travel experience.</p>
      </div>

      <div className="settings-card">

        <div className="setting-item">
          <div className="setting-info">
            <Globe size={20} />
            <span>Language</span>
          </div>

          <select>
            <option>English</option>
            <option>Hindi</option>
            <option>Kannada</option>
          </select>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <DollarSign size={20} />
            <span>Currency</span>
          </div>

          <select>
            <option>₹ INR</option>
            <option>$ USD</option>
            <option>€ EUR</option>
            <option>£ GBP</option>
          </select>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <Ruler size={20} />
            <span>Distance Unit</span>
          </div>

          <select>
            <option>Kilometers</option>
            <option>Miles</option>
          </select>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <Bell size={20} />
            <span>Notifications</span>
          </div>

          <input type="checkbox" defaultChecked />
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <Moon size={20} />
            <span>Dark Mode</span>
          </div>

          <input type="checkbox" />
        </div>

        <button className="save-settings-btn">
          <Save size={18} />
          Save Settings
        </button>

      </div>
    </section>
  );
}

export default Settings;