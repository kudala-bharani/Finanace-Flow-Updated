#!/usr/bin/env node

console.log("🧪 Starting minimal server test...");

import express from "express";

const app = express();
const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.json({ message: "Minimal server is running!", port: PORT });
});

console.log(`🌐 Starting minimal server on port ${PORT}...`);
console.log(`📋 Environment: ${process.env.NODE_ENV || "development"}`);

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Minimal server running on port ${PORT}`);
  console.log(`✅ Server is ready to accept connections`);
});

server.on("error", (error) => {
  console.error("❌ Minimal server error:", error);
  process.exit(1);
});

// Keep the server running
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
  });
});
