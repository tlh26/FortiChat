//
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./auth.router');

const app = express();

// Middleware
app.use(bodyParser.json());

// Authentication routes
app.use('/fortiChat/auth', authRoutes);

module.exports = app;
