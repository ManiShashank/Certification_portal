const express = require('express');
const { registerStudent, loginStudent } = require('../controllers/authController');
const { getDashboard } = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerStudent);
router.post('/login', loginStudent);
router.get('/dashboard', protect, getDashboard);

module.exports = router;
