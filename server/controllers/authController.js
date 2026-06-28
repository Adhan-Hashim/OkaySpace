const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

exports.register = async (req, res) => {
    try {
        const { name, email, password, concerns } = req.body;
        // Basic validation and logging to help diagnose duplicate-user reports
        logger.info('Register attempt', { hasEmail: !!email });
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide name, email and password' });
        }
        const normalizedEmail = email.toLowerCase();
        let user = await User.findOne({ email: normalizedEmail });
        if (user) {
            logger.warn('Registration failed: User already exists');
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create verification token
        const verifyToken = require('crypto').randomBytes(32).toString('hex');
        const verifyExpires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

        user = new User({
            name,
            email: normalizedEmail,
            password: hashedPassword,
            isVerified: false,
            verifyToken,
            verifyTokenExpires: verifyExpires,
            concerns: concerns || [],
        });
        await user.save();

        // Attempt to send verification email (will log link if SMTP not configured)
        try {
            const { sendVerificationEmail } = require('../utils/email');
            await sendVerificationEmail(normalizedEmail, verifyToken, name);
        } catch (emailErr) {
            logger.error('Verification email error:', emailErr);
        }

        res.status(201).json({ message: 'Registered. Please verify your email. Check your inbox (or server logs in dev).', user: { id: user._id, name, email: normalizedEmail, concerns: user.concerns } });
    } catch (error) {
        logger.error('Register error:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'User already exists' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        logger.info('Login attempt', { hasEmail: !!email });
        const user = await User.findOne({ email: email && email.toLowerCase() });
        logger.info('Login - User search result', { found: !!user, isVerified: user?.isVerified });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        logger.info('Login - Password match result', { isMatch });
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        if (!user.isVerified) {
            return res.status(403).json({ message: 'Please verify your email address to log in.' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, concerns: user.concerns } });
    } catch (error) {
        logger.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const { token, email } = req.query;
        if (!token || !email) return res.status(400).json({ message: 'Invalid verification link' });

        const user = await User.findOne({ email: email.toLowerCase(), verifyToken: token });
        if (!user) return res.status(400).json({ message: 'Invalid or expired verification link' });
        if (user.verifyTokenExpires && user.verifyTokenExpires < Date.now()) {
            return res.status(400).json({ message: 'Verification token expired' });
        }

        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpires = undefined;
        await user.save();

        res.json({ message: 'Email verified successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.resendVerification = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.isVerified) return res.status(400).json({ message: 'User already verified' });

        const verifyToken = require('crypto').randomBytes(32).toString('hex');
        user.verifyToken = verifyToken;
        user.verifyTokenExpires = new Date(Date.now() + 1000 * 60 * 60 * 24);
        await user.save();

        logger.debug('Resend verification link (DEV) generated');

        res.json({ message: 'Verification link sent' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
