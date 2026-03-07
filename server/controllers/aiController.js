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
