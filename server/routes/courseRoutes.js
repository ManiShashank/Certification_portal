const express = require('express');
const { addCourses } = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', protect, addCourses);

module.exports = router;
