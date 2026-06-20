const https = require('https');
const http = require('http');
const sequelize = require('../config/db');

const keepAlive = async () => {
  console.log(`[${new Date().toISOString()}] Запуск завдання Keep-Alive...`);

  // 1. Ping Database
  try {
    await sequelize.authenticate();
    // Perform a simple query to ensure activity
    await sequelize.query('SELECT 1');
    console.log('✅ З’єднання з базою даних активне.');
  } catch (error) {
    console.error('❌ Пінг бази даних не вдався:', error.message);
  }

  // 2. Ping Self (if BACKEND_URL is set)
  const backendUrl = process.env.BACKEND_URL;
  if (backendUrl) {
    const targetUrl = `${backendUrl}/api`;
    console.log(`📡 Пінг backend: ${targetUrl}`);
    
    try {
      const client = backendUrl.startsWith('https') ? https : http;
      client.get(targetUrl, (res) => {
        console.log(`✅ Backend успішно пропінговано: ${res.statusCode}`);
        process.exit(0);
      }).on('error', (err) => {
        if (err.code === 'ECONNREFUSED') {
          console.warn(`⚠️ Пінг backend не вдався: з'єднання відхилено на ${targetUrl}. Сервер запущено?`);
        } else {
          console.error('❌ Пінг backend не вдався:', err.message || err);
        }
        process.exit(0); // Exit with 0 to not break CI/scripts if server is just down
      });
    } catch (error) {
      console.error('❌ Пінг backend не вдався:', error.message || error);
      process.exit(0);
    }
  } else {
    console.log('ℹ️ BACKEND_URL не задано, self-ping пропущено.');
    process.exit(0);
  }
};

keepAlive();
