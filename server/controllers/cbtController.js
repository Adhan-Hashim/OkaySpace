const CBTEntry = require('../models/CBTEntry');

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
        console.error(err);
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
        console.error(err);
        res.status(500).json({ message: 'Server error fetching CBT entries' });
    }
};
