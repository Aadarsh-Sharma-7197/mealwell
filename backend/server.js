const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static folder
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/ai", require("./routes/ai"));
app.use("/api/chefs", require("./routes/chefs"));
app.use("/api/customers", require("./routes/customers"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/dishes", require("./routes/dishes"));
app.use("/api/plans", require("./routes/plans"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/health-stats", require("./routes/health"));
app.use("/api/chef-applications", require("./routes/chefApplications"));
app.use("/api/admin", require("./routes/admin"));

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "MealWell API Server",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      chefs: "/api/chefs",
      customers: "/api/customers",
      orders: "/api/orders",
      payments: "/api/payments",
      health: "/api/health",
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err : {},
    debug_stack: process.env.NODE_ENV === 'production' ? err.stack : undefined // Templorary for Vercel debugging
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Server setup
const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
// Connect to MongoDB and start server
const connectDB = require('./config/db');

// Call connectDB immediately to start connection process
connectDB().catch(err => console.error(err));

if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log("\n" + "=".repeat(60));
    console.log("🚀 MealWell Backend Server Started Successfully!");
    console.log("=".repeat(60));
    console.log(`📍 Server URL: http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🤖 AI Model: gemini-flash-latest`);
    console.log("=".repeat(60) + "\n");
  });

  // Graceful shutdown
  const gracefulShutdown = (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(() => {
      console.log("✅ HTTP server closed");
      mongoose.connection.close(false, () => {
        console.log("✅ MongoDB connection closed");
        process.exit(0);
      });
    });
  };

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
}

module.exports = app;

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err.message);
  // Don't exit in production, just log
  if (process.env.NODE_ENV === "production") {
    console.error("Error details:", err);
  } else {
    process.exit(1);
  }
});
