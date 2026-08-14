import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import plannerRoutes from "./routes/plannerRoutes.js";
import testRoutes from "./routes/testRoutes.js";

const app = express();

// =====================================================
// CORS
// =====================================================

// Development frontend URLs
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",

  // Production frontend
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman / server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ CORS blocked:", origin);

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],

    credentials: true,
  })
);

// =====================================================
// BODY PARSER
// =====================================================

app.use(
  express.json({
    limit: "1mb",
  })
);

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Travel Planner API Running",
  });
});

// =====================================================
// API ROUTES
// =====================================================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/trips",
  tripRoutes
);

app.use(
  "/api/planner",
  plannerRoutes
);

app.use(
  "/api/test",
  testRoutes
);

// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {
  console.error(
    "❌ Server Error:",
    err.message
  );

  // CORS error
  if (
    err.message ===
    "Not allowed by CORS"
  ) {
    return res.status(403).json({
      success: false,
      message:
        "Request blocked by server security policy.",
    });
  }

  res.status(
    err.status || 500
  ).json({
    success: false,
    message:
      err.status
        ? err.message
        : "Internal server error.",
  });
});

export default app;