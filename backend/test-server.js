#!/usr/bin/env node

// Simple test to verify server can start
import express from 'express';

const app = express();
const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.json({ message: 'Test server is running!' });
});

console.log(`🧪 Starting test server on port ${PORT}...`);

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Test server running on port ${PORT}`);
  console.log('✅ Server test successful - shutting down');
  server.close(() => {
    console.log('✅ Test completed successfully');
    process.exit(0);
  });
});

server.on('error', (error) => {
  console.error('❌ Test server error:', error);
  process.exit(1);
});

// Timeout after 5 seconds
setTimeout(() => {
  console.error('❌ Test server timeout');
  server.close(() => {
    process.exit(1);
  });
}, 5000);
