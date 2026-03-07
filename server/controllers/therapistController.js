const Therapist = require('../models/Therapist');
const Appointment = require('../models/Appointment');

// Seed dummy therapists if none exist
const seedTherapists = async () => {
    const count = await Therapist.countDocuments();
    if (count === 0) {
        await Therapist.insertMany([
            {
                name: "Dr. Sarah Jenkins",
                specialization: "Anxiety & Stress",
                bio: "Specializes in cognitive behavioral therapy with a focus on high-functioning anxiety.",
                availability: ["Monday 10:00 AM", "Tuesday 1:00 PM", "Thursday 4:00 PM"]
            },
            {
                name: "Dr. Marcus Chen",
                specialization: "Trauma & PTSD",
                bio: "EMDR certified therapist helping patients process past traumas safely.",
                availability: ["Wednesday 9:00 AM", "Friday 3:00 PM"]
            },
            {
                name: "Lisa Rodriguez, LCSW",
                specialization: "Depression & Mood Disorders",
                bio: "Provides a safe, non-judgmental space for exploring deep emotional blocks.",
                availability: ["Monday 2:00 PM", "Wednesday 11:00 AM", "Thursday 2:00 PM"]
            }
        ]);
        console.log("Seeded dummy therapists.");
    }
};

exports.getTherapists = async (req, res) => {
    try {
        await seedTherapists(); // Ensure data exists
        const therapists = await Therapist.find({});
        res.status(200).json(therapists);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching therapists' });
    }
};

exports.bookAppointment = async (req, res) => {
    try {
        const { therapistId, timeSlot } = req.body;
        if (!therapistId || !timeSlot) {
            return res.status(400).json({ message: 'Therapist and time slot are required.' });
        }

        const newAppointment = new Appointment({
            userId: req.user.id,
            therapistId,
            timeSlot
        });

        await newAppointment.save();
        res.status(201).json({ message: 'Appointment booked successfully.', appointment: newAppointment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error while booking appointment.' });
    }
};
