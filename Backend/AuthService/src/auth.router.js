const express = require('express');
const { registerUser, loginUser, fetchAllUsers } = require('./auth.controller');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
// Fetch all users endpoint
router.get('/users', fetchAllUsers);

module.exports = router;
