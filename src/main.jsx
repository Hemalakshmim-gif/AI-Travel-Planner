import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

import { PlannerProvider } from "./context/PlannerContext";

import "./styles/Variables.css";
import "./styles/Global.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <React.StrictMode>

    <BrowserRouter>

      <PlannerProvider>

        <App />

      </PlannerProvider>

    </BrowserRouter>

  </React.StrictMode>

);