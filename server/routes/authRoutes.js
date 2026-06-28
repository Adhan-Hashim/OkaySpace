const express = require('express');
const router = express.Router();
const { register, login, getMe, exportData, deleteUser } = require('../controllers/authController');
const { verifyEmail, resendVerification } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/verify', verifyEmail);
router.post('/resend-verification', resendVerification);
router.get('/me', authMiddleware, getMe);
router.get('/export', authMiddleware, exportData);
router.delete('/delete', authMiddleware, deleteUser);

module.exports = router;
