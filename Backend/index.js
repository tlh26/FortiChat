//Apps entry point
const express = require('express');
const cors = require('cors');
const { json, urlencoded } = require('body-parser');
require('dotenv').config();

// Import routers from other microservices
const authRoutes = require('./AuthService/src/auth.router');

const app = express();

// Middleware
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

// Microservice routes
app.use('/auth', authRoutes); // Authentication microservice

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Backend is UP & running', timestamp: new Date() });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
