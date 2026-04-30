const express = require('express');
const { uploadCertificate } = require('../controllers/studentController');
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Route specifically requests a single file named 'certificate' in the multipart form data
router.post('/', protect, upload.single('certificate'), uploadCertificate);

module.exports = router;
