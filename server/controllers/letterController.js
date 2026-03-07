const Letter = require('../models/Letter');

// Send a new kindness letter
exports.sendLetter = async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) return res.status(400).json({ message: 'Content is required.' });

        const newLetter = new Letter({
            userId: req.user.id,
            content
        });

        await newLetter.save();
        res.status(201).json({ message: 'Letter sent successfully.', letter: newLetter });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error while sending letter.' });
    }
};

// Get a random unread lette, mark it as read, and return it.
// To handle the logic easily for now: grab a random letter not written by this user,
// We could either mark it read globally or just return random ones.
// Let's just return a random letter not written by the user.
exports.getRandomLetter = async (req, res) => {
    try {
        // Find a random letter where the author is NOT the current logged-in user
        const letters = await Letter.aggregate([
            { $match: { userId: { $ne: req.user._id } } }, // In aggregation, req.user._id must match objectId, we'll try to match as string or construct ObjectId if needed. 
            { $sample: { size: 1 } }
        ]);

        if (!letters || letters.length === 0) {
            // Fallback: If no letters exist from others, just return any letter to test
            const fallback = await Letter.aggregate([{ $sample: { size: 1 } }]);
            if (!fallback || fallback.length === 0) {
                return res.status(404).json({ message: 'No letters available yet. Be the first to write one!' });
            }
            return res.status(200).json(fallback[0]);
        }

        res.status(200).json(letters[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error while fetching letter.' });
    }
};
