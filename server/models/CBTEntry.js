const mongoose = require('mongoose');

const cbtEntrySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    original_thought: { type: String, required: true },
    distortions: [{ type: String }],
    balanced_thought: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('CBTEntry', cbtEntrySchema);
