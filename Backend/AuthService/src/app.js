const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./auth.router');
const pool = require('./config/db'); // Import the database pool configuration

const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON requests

// Authentication routes
app.use('/auth', authRoutes); // Use appropriate path for auth routes

// Health check endpoint
app.get('/auth/health', async (req, res) => {
    try {
        // Test DB connection
        const healthCheckResponse = await pool.query('SELECT NOW()');
        console.log('Health check DB response:', healthCheckResponse); // Log DB response
        res.status(200).json({ status: 'Auth Service is UP & running', timestamp: new Date() });
    } catch (err) {
        console.error('Health check failed:', err.message);
        res.status(500).json({ error: 'Database connection failed' });
    }
});


// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
