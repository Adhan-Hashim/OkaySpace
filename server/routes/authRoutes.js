const express = require('express');
const router = express.Router();
const { register, login, getMe, exportData, deleteUser } = require('../controllers/authController');
const { verifyEmail, resendVerification } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const passport = require('passport');

router.post('/register', register);
router.post('/login', login);
router.get('/verify', verifyEmail);
router.post('/resend-verification', resendVerification);
router.get('/me', authMiddleware, getMe);
router.get('/export', authMiddleware, exportData);
router.delete('/delete', authMiddleware, deleteUser);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}?error=GoogleAuthFailed` }), (req, res) => {
    // Generate JWT token
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?token=${token}`);
});

module.exports = router;
