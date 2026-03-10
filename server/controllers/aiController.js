const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

exports.chat = async (req, res) => {
    try {
        const { message } = req.body;

        // Acknowledge if API key is missing
        const apiKey = process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.trim() : '';
        if (!apiKey || apiKey === 'your_openai_api_key_here') {
            return res.json({
                role: 'assistant',
                content: "I am currently in demo mode as the OpenAI API key is missing. But I'm here to listen, so feel free to share your thoughts!"
            });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a supportive emotional listener for a platform called OkaySpace. Respond with empathy, kindness, and brevity. Encourage the user gently." },
                { role: "user", content: message }
            ]
        });

        res.json(response.choices[0].message);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'AI Service Error' });
    }
};

exports.moderate = async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) return res.status(400).json({ message: 'Content is required' });

        const apiKey = process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.trim() : '';
        if (!apiKey || apiKey === 'your_openai_api_key_here') {
            // If no key, be permissive but mark as unchecked
            return res.json({ flagged: false, reason: 'no_api_key' });
        }

        // Use OpenAI moderation endpoint
        const response = await openai.moderations.create({
            model: 'omni-moderation-latest',
            input: content,
        });

        const result = response.results && response.results[0];
        // Map categories to a simple flag
        const flagged = result && result.categories && Object.values(result.categories).some(Boolean);
        res.json({ flagged, categories: result?.categories, category_scores: result?.category_scores });
    } catch (err) {
        console.error('Moderation error:', err);
        res.status(500).json({ message: 'Moderation service error' });
    }
};

exports.analyzeMood = async (req, res) => {
    try {
        const { moodHistory } = req.body;
        if (!moodHistory || !moodHistory.length) return res.status(400).json({ message: 'History required' });

        const historyString = moodHistory.map(m => `${m.date}: ${m.mood}`).join('\n');

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a psychiatric data analyst. Analyze the following mood history (format: date: score 1-5). Provide a technical but supportive insight into the user's emotional trajectory. Be brief and use futurist/technical terminology." },
                { role: "user", content: `Analyze this trajectory:\n${historyString}` }
            ]
        });

        res.json({ analysis: response.choices[0].message.content });
    } catch (err) {
        res.status(500).json({ message: 'Analysis Error' });
    }
};

exports.matchTherapist = async (req, res) => {
    try {
        const { needs, therapists } = req.body;

        const therapistList = therapists.map(t => `${t.name} (ID: ${t._id}): ${t.specialization} - ${t.bio}`).join('\n');

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a specialist matching algorithm. Based on the user's described needs and the list of available specialists, recommend the best match. Explain why in technical/supportive terms. Keep it concise." },
                { role: "user", content: `NEEDS: ${needs}\n\nSPECIALISTS:\n${therapistList}` }
            ]
        });

        res.json({ recommendation: response.choices[0].message.content });
    } catch (err) {
        res.status(500).json({ message: 'Matching Error' });
    }
};

exports.triageEmergency = async (req, res) => {
    try {
        const { situation } = req.body;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are an URGENT_TRIAGE_BOT. The user is in distress. Provide immediate, grounding, and scientifically-backed stabilization advice. Be calm, technical, and prioritize safety. Use short, impactful instructions." },
                { role: "user", content: situation }
            ]
        });

        res.json({ advice: response.choices[0].message.content });
    } catch (err) {
        res.status(500).json({ message: 'Triage Error' });
    }
};
