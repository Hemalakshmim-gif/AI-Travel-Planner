import "./ThemeToggle.css";

import { Moon, Sun } from "lucide-react";
import useDarkMode from "../../hooks/useDarkMode";

function ThemeToggle() {
  const { darkMode, toggleTheme } = useDarkMode();

  return (
    <button
      className={`theme-toggle ${darkMode ? "dark" : ""}`}
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      title={darkMode ? "Light Mode" : "Dark Mode"}
    >
      <div className="toggle-circle">
        {darkMode ? <Moon size={15} /> : <Sun size={15} />}
      </div>
    </button>
  );
}

export default ThemeToggle;