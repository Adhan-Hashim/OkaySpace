const Mood = require('../models/Mood');

exports.logMood = async (req, res) => {
    try {
        const { mood } = req.body;

        const newMood = new Mood({
            userId: req.user.id,
            mood
        });

        const savedMood = await newMood.save();
        res.status(201).json(savedMood);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getMoodHistory = async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 7;
        const moods = await Mood.find({ userId: req.user.id })
            .sort({ date: -1 })
            .limit(limit);

        res.json(moods);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};
