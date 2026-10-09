// Import the Express framework used to create the HTTP server.
const express = require("express");

// Import Mongoose used to connect the application to MongoDB.
const mongoose = require("mongoose");

// Import path to build an absolute path to the .env file.
const path = require("path");

// Import and configure dotenv using the directory of this file so the
// correct .env is loaded regardless of where the process is started from.
require("dotenv").config({ path: path.join(__dirname, ".env") });

// Create an Express application.
const server = express();

// Read PORT, convert it to a number, and use 5000 when it is not configured.
const PORT = Number(process.env.PORT || 5000);

// Read the MongoDB connection string from the loaded environment variables.
const MONGO_URL = process.env.MONGO_URL;

// Check whether the required MongoDB connection string was provided.
if (!MONGO_URL) {
  console.error("MONGO_URL is not configured");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Global middleware
// ---------------------------------------------------------------------------

// Parse JSON request bodies.
server.use(express.json());

// Parse URL-encoded request bodies (form submissions).
server.use(express.urlencoded({ extended: true }));

// Apply permissive CORS headers so a frontend on any origin can call the API.
server.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

// Import the routes that manage student resources.
const userRoutes = require("./Routes/usersRoutes");

// Import the routes that manage authentication resources.
const authRoutes = require("./Routes/authRoutes");

// Health-check endpoint — confirms the API is reachable.
server.get("/", (req, res) => {
  res.status(200).json({
    message: "School Management API is running",
    version: "1.0.0",
    endpoints: {
      auth: ["POST /register", "POST /login", "GET /me"],
      students: [
        "GET    /students",
        "POST   /students",
        "GET    /students/stats",
        "GET    /students/:id",
        "PATCH  /students/:id",
        "DELETE /students/:id",
        "POST   /students/:id/grades",
        "PATCH  /students/:id/attendance",
      ],
    },
  });
});

// Register the student routes with the Express application.
server.use(userRoutes);

// Register the authentication routes with the Express application.
server.use(authRoutes);

// ---------------------------------------------------------------------------
// 404 handler — catches any request that did not match a route above.
// ---------------------------------------------------------------------------
server.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
});

// ---------------------------------------------------------------------------
// Global error handler — catches errors passed via next(err).
// ---------------------------------------------------------------------------
server.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Internal server error" });
});

// ---------------------------------------------------------------------------
// Database connection → start listening
// ---------------------------------------------------------------------------
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exitCode = 1;
  });
