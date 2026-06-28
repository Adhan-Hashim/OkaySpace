const CBTEntry = require('../models/CBTEntry');
const logger = require('../utils/logger');

exports.saveEntry = async (req, res) => {
    try {
        const { original_thought, distortions, balanced_thought } = req.body;
        
        const entry = new CBTEntry({
            userId: req.user.id,
            original_thought,
            distortions,
            balanced_thought
        });
        
        await entry.save();
        res.status(201).json(entry);
    } catch (err) {
        logger.error('Error saving CBT entry', err);
        res.status(500).json({ message: 'Server error saving CBT entry' });
    }
};

exports.getEntries = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : null;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const entries = await CBTEntry.find({ userId }).sort({ createdAt: -1 });
        res.json(entries);
    } catch (err) {
        logger.error('Error fetching CBT entries', err);
        res.status(500).json({ message: 'Server error fetching CBT entries' });
    }
};

exports.getAnalytics = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : null;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const entries = await CBTEntry.find({ userId }).sort({ createdAt: 1 });
        
        // Compute distortion frequency
        const distortionCounts = {};
        entries.forEach(entry => {
            if (entry.distortions) {
                entry.distortions.forEach(d => {
                    distortionCounts[d] = (distortionCounts[d] || 0) + 1;
                });
            }
        });

        // Basic timeline aggregation (entries per day)
        const timeline = {};
        entries.forEach(entry => {
            const date = entry.createdAt.toISOString().split('T')[0];
            timeline[date] = (timeline[date] || 0) + 1;
        });

        res.json({
            totalEntries: entries.length,
            distortions: distortionCounts,
            timeline: Object.keys(timeline).map(date => ({ date, count: timeline[date] }))
        });
    } catch (err) {
        logger.error('Error fetching CBT analytics', err);
        res.status(500).json({ message: 'Server error fetching CBT analytics' });
    }
};
