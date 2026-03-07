const mongoose = require('mongoose');

const TherapistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    bio: { type: String, required: true },
    photoUrl: { type: String }, // optional placeholder
    availability: [{ type: String }] // e.g., ["Monday 10:00 AM", "Wednesday 2:00 PM"]
}, { timestamps: true });

module.exports = mongoose.model('Therapist', TherapistSchema);
