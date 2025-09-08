#!/usr/bin/env node

console.log("🚀 Starting Finance Flow Backend...");

// Import and start the server
import("./index.mjs").catch((error) => {
  console.error("❌ Failed to start server:", error);
  process.exit(1);
});
