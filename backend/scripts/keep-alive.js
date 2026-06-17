const https = require('https');
const http = require('http');
const sequelize = require('../config/db');

const keepAlive = async () => {
  console.log(`[${new Date().toISOString()}] Starting Keep-Alive task...`);

  // 1. Ping Database
  try {
    await sequelize.authenticate();
    // Perform a simple query to ensure activity
    await sequelize.query('SELECT 1');
    console.log('✅ Database connection is active.');
  } catch (error) {
    console.error('❌ Database ping failed:', error.message);
  }

  // 2. Ping Self (if BACKEND_URL is set)
  const backendUrl = process.env.BACKEND_URL;
  if (backendUrl) {
    const targetUrl = `${backendUrl}/api`;
    console.log(`📡 Pinging Backend: ${targetUrl}`);
    
    try {
      const client = backendUrl.startsWith('https') ? https : http;
      client.get(targetUrl, (res) => {
        console.log(`✅ Backend pinged successfully: ${res.statusCode}`);
        process.exit(0);
      }).on('error', (err) => {
        if (err.code === 'ECONNREFUSED') {
          console.warn(`⚠️ Backend ping failed: Connection refused at ${targetUrl}. Is the server running?`);
        } else {
          console.error('❌ Backend ping failed:', err.message || err);
        }
        process.exit(0); // Exit with 0 to not break CI/scripts if server is just down
      });
    } catch (error) {
      console.error('❌ Backend ping failed:', error.message || error);
      process.exit(0);
    }
  } else {
    console.log('ℹ️ BACKEND_URL not set, skipping self-ping.');
    process.exit(0);
  }
};

keepAlive();
