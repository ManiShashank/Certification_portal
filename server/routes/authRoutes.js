const express = require('express');
const { registerStudent, loginUser } = require('../controllers/authController');
const router = express.Router();

// @route   POST /api/auth/student/register
router.post('/student/register', registerStudent);

// @route   POST /api/auth/login
router.post('/login', loginUser);

module.exports = router;
