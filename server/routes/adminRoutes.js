const express = require('express');
const { getValidCertificates } = require('../controllers/adminController');
const { loginAdmin } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/certificates', protect, admin, getValidCertificates);

module.exports = router;
