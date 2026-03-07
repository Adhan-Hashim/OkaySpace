require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
// Security middlewares
app.use(helmet());
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/mood', require('./routes/moodRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/letters', require('./routes/letterRoutes'));
app.use('/api/therapists', require('./routes/therapistRoutes'));

// Temporary debug route - only enable in non-production for local debugging
if (process.env.NODE_ENV !== 'production') {
    const User = require('./models/User');
    app.get('/debug/users', async (req, res) => {
        try {
            const users = await User.find().select('-password');
            res.json(users);
        } catch (err) {
            res.status(500).json({ message: 'Unable to list users' });
        }
    });
    app.post('/debug/check-credentials', async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) return res.status(400).json({ message: 'email and password required' });
            const User = require('./models/User');
            const bcrypt = require('bcrypt');
            const user = await User.findOne({ email: email.toLowerCase() });
            if (!user) return res.json({ found: false });
            const match = await bcrypt.compare(password, user.password);
            return res.json({ found: true, isVerified: !!user.isVerified, passwordMatch: match });
        } catch (err) {
            console.error('Debug check-credentials error:', err);
            res.status(500).json({ message: 'error' });
        }
    });
}

app.get('/', (req, res) => {
    res.send('OkaySpace API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
