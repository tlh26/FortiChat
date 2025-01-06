// Entry point
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Microservices
const authService = require('./AuthService/src/app');
// Add other microservices as they are implemented
// const anotherService = require('./AnotherService/src/app');
// const yetAnotherService = require('./YetAnotherService/src/app');

const app = express();

// Middleware for all services
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check for the main gateway
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Main Gateway is UP & running', timestamp: new Date() });
});

// Register microservices with unique base paths
app.use('/fortiChat', authService);
// app.use('/another-service', anotherService);
// app.use('/yet-another-service', yetAnotherService);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Export the app for testing
module.exports = app;


// Start the server (only if this is the main module)
if (require.main === module) {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`Main gateway running  at http://localhost:${PORT}`);
    });
}
// // Start the server
// const PORT = process.env.PORT || 4000;
// console.log("Look at the App in Index.js" +app);

// app.listen(PORT, () => {
//     console.log(`Main gateway running  at http://localhost:${PORT}`);
// });
