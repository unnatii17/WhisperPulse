const dotenv = require('dotenv');
const { createClient } = require('redis');

dotenv.config();

const client = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        connectTimeout: 4000,
        reconnectStrategy: false
    }
});

// Suppress unhandled crash on Redis Error
client.on('error', (err) => {
    console.warn('Redis Client Notice (Bypassing Redis cache):', err.message);
});

// Connect safely without crashing server
client.connect().catch((err) => {
    console.warn('Redis Cloud connection unavailable (continuing without Redis):', err.message);
});

module.exports = client;