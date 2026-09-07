const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { registerUser, loginUser, updateProfile, changePassword } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);

module.exports = router;