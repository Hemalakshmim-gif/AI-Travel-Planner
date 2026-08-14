import { useEffect, useState } from "react";

function useDarkMode() {

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {

    if (darkMode) {

      document.documentElement.setAttribute(
        "data-theme",
        "dark"
      );

      localStorage.setItem(
        "theme",
        "dark"
      );

    } else {

      document.documentElement.removeAttribute(
        "data-theme"
      );

      localStorage.setItem(
        "theme",
        "light"
      );

    }

  }, [darkMode]);


  const toggleTheme = () => {

    setDarkMode((prev) => !prev);

  };


  return {
    darkMode,
    toggleTheme,
  };
}

export default useDarkMode;