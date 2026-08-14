import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const PlannerContext = createContext(null);

export function PlannerProvider({ children }) {

  const [trip, setTripState] = useState(() => {

    try {

      const savedTrip = localStorage.getItem("generatedTrip");

      if (!savedTrip) {
        return null;
      }

      return JSON.parse(savedTrip);

    } catch (error) {

      console.error(
        "Failed to load saved trip:",
        error
      );

      return null;

    }

  });

  const setTrip = (newTrip) => {

    setTripState(newTrip);

    if (newTrip) {

      localStorage.setItem(
        "generatedTrip",
        JSON.stringify(newTrip)
      );

    } else {

      localStorage.removeItem("generatedTrip");

    }

  };

  const clearTrip = () => {

    setTripState(null);

    localStorage.removeItem("generatedTrip");

  };

  useEffect(() => {

    const handleStorageChange = () => {

      try {

        const savedTrip =
          localStorage.getItem("generatedTrip");

        setTripState(
          savedTrip
            ? JSON.parse(savedTrip)
            : null
        );

      } catch (error) {

        console.error(
          "Failed to synchronize trip:",
          error
        );

      }

    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {

      window.removeEventListener(
        "storage",
        handleStorageChange
      );

    };

  }, []);

  return (
    <PlannerContext.Provider
      value={{
        trip,
        setTrip,
        clearTrip,
      }}
    >
      {children}
    </PlannerContext.Provider>
  );

}

export function usePlanner() {

  const context = useContext(PlannerContext);

  if (!context) {

    throw new Error(
      "usePlanner must be used inside PlannerProvider"
    );

  }

  return context;
}