// ========================================
// OkaySpace Neural OS — AI Controller
// Handles: Echo, Prism, Sentiment, Insights
// ========================================

const getOpenAI = () => {
    const apiKey = process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.trim() : '';
    if (!apiKey || apiKey === 'your_openai_api_key_here') return null;
    const OpenAI = require('openai');
    return new OpenAI({ apiKey });
};

// Simple in-memory sentiment analysis fallback
const EMOTION_KEYWORDS = {
    joy: ['happy', 'glad', 'excited', 'wonderful', 'amazing', 'great', 'love', 'grateful', 'blessed', 'fantastic', 'awesome'],
    sadness: ['sad', 'depressed', 'lonely', 'hurt', 'crying', 'tears', 'lost', 'empty', 'hopeless', 'miserable', 'grief'],
    anxiety: ['anxious', 'worried', 'nervous', 'scared', 'afraid', 'panic', 'stressed', 'overwhelmed', 'tense', 'dread', 'fear'],
    anger: ['angry', 'furious', 'frustrated', 'annoyed', 'mad', 'rage', 'hate', 'pissed', 'irritated', 'resentful'],
    calm: ['calm', 'peaceful', 'relaxed', 'serene', 'content', 'okay', 'fine', 'chill', 'balanced', 'centered'],
    hope: ['hope', 'optimistic', 'better', 'forward', 'growth', 'progress', 'improving', 'bright', 'possible'],
    confusion: ['confused', 'lost', 'uncertain', 'unsure', 'complicated', 'mess', "don't know", 'unclear'],
    gratitude: ['thankful', 'grateful', 'appreciate', 'blessed', 'fortune'],
};

function detectSentiment(text) {
    const lower = text.toLowerCase();
    let maxEmotion = 'neutral';
    let maxScore = 0;

    for (const [emotion, keywords] of Object.entries(EMOTION_KEYWORDS)) {
        const score = keywords.filter(kw => lower.includes(kw)).length;
        if (score > maxScore) {
            maxScore = score;
            maxEmotion = emotion;
        }
    }

    return {
        emotion: maxEmotion,
        intensity: Math.min(0.3 + maxScore * 0.15, 1),
    };
}

// Cognitive distortion detection
const DISTORTIONS = [
    { name: 'Catastrophizing', patterns: ['worst', 'never', 'disaster', 'terrible', 'end of', 'ruined', 'everything is'] },
    { name: 'All-or-Nothing', patterns: ['always', 'never', 'nothing', 'everything', 'completely', 'totally', 'entirely'] },
    { name: 'Mind Reading', patterns: ['they think', 'everyone thinks', 'people think', 'they must', 'they probably'] },
    { name: 'Overgeneralization', patterns: ['always happens', 'never works', 'every time', 'nobody', 'no one ever'] },
    { name: 'Emotional Reasoning', patterns: ['i feel like', 'because i feel', 'feels like'] },
    { name: 'Should Statements', patterns: ['i should', 'i must', 'i have to', 'i ought to', 'i need to be'] },
];

function detectDistortion(text) {
    const lower = text.toLowerCase();
    for (const d of DISTORTIONS) {
        if (d.patterns.some(p => lower.includes(p))) {
            return d.name;
        }
    }
    return null;
}

// =============== ECHO — AI Companion ===============

exports.echo = async (req, res) => {
    try {
        const { message, history = [], mode } = req.body;
        if (!message) return res.status(400).json({ message: 'Message is required' });

        const sentiment = detectSentiment(message);
        const openai = getOpenAI();

        if (!openai) {
            // Smart mock responses based on sentiment
            const responses = {
                sadness: [
                    "I can feel the weight in your words. Sadness is a signal that something important to you is being affected. What feels most heavy right now?",
                    "It takes courage to sit with sadness rather than push it away. I'm here with you in this space. What's beneath the surface?",
                    "Your sadness is valid. It shows the depth of your capacity to feel. Would you like to explore what might help lighten this?",
                ],
                anxiety: [
                    "I notice the tension in what you're sharing. Let's slow down together. What is the single most pressing worry right now?",
                    "Anxiety often tries to protect us by imagining worst-case scenarios. What's the story your mind is telling you?",
                    "When everything feels urgent, nothing gets processed. Let's take this one piece at a time. What's the first thread to pull?",
                ],
                anger: [
                    "Anger is a powerful emotion — it often means a boundary has been crossed. What feels violated or unfair to you?",
                    "I hear the intensity in your words. Anger can be a messenger. What is it trying to tell you?",
                    "It's okay to feel angry. Let's channel that energy — what change would make this situation feel more just?",
                ],
                joy: [
                    "That brightness in your words is beautiful. What sparked this feeling, and how can you create more of it?",
                    "I love seeing this energy! Joy is worth savoring. Take a moment to really sit with this good feeling.",
                    "What a wonderful state to be in. Notice this moment — it's data for your mind that good things happen too.",
                ],
                calm: [
                    "There's a groundedness in your words. This calm is a powerful state — it's where your clearest thinking happens.",
                    "I can sense your equilibrium. From this centered place, what feels most true to you right now?",
                ],
                hope: [
                    "I can feel the forward momentum in your words. Hope is the mind's way of saying 'there's a path.' What direction do you want to move in?",
                    "That spark of hope is powerful. Let's nurture it — what would the next small step look like?",
                ],
                neutral: [
                    "Thank you for sharing. I'm curious to understand more — what's the feeling underneath these words?",
                    "I hear you. Sometimes the most important conversations start from a neutral place. What would you like to explore?",
                    "Tell me more. I want to understand not just what you're thinking, but what you're feeling about it.",
                ],
                confusion: [
                    "Confusion can actually be a sign of growth — it means your old framework isn't fitting anymore. What feels most unclear?",
                    "Let's untangle this together. If you had to name just one thing that feels confusing, what would it be?",
                ],
            };

            const pool = responses[sentiment.emotion] || responses.neutral;
            const response = pool[Math.floor(Math.random() * pool.length)];

            return res.json({ response, sentiment });
        }

        // OpenAI-powered response
        const systemPrompt = `You are Echo, a deeply empathetic AI neural companion in OkaySpace. You combine techniques from:
- Cognitive Behavioral Therapy (CBT)
- Dialectical Behavior Therapy (DBT)
- Motivational Interviewing
- Mindfulness-Based Cognitive Therapy

Your personality: warm, perceptive, gently challenging. You don't give advice unless asked — you reflect, ask insightful questions, and help users discover their own insights.

Guidelines:
- Keep responses 2-4 sentences
- Ask exactly one thoughtful question per response
- Validate emotions before exploring them
- Never say "I understand" — show understanding through your response
- Reference specific words the user used
- If the user is in crisis, gently suggest professional help
- CRITICAL EXCEPTION: If the user just says a simple greeting like "hi", "hello", "hey", or "good morning", DO NOT ask a deep psychological question. Simply reply with a warm, welcoming, and casual greeting, inviting them to share whatever is on their mind.

Respond with JSON: { "response": "your response text" }`;

        const chatHistory = history.map(m => ({
            role: m.role,
            content: m.content,
        }));

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            response_format: { type: "json_object" },
            messages: [
                { role: "system", content: systemPrompt },
                ...chatHistory,
                { role: "user", content: message },
            ],
        });

        const parsed = JSON.parse(response.choices[0].message.content);
        res.json({ response: parsed.response, sentiment });

    } catch (err) {
        console.error('Echo error:', err);
        res.json({
            response: "I'm here with you. Even when connections flicker, the space for reflection remains. What's on your mind?",
            sentiment: { emotion: 'neutral', intensity: 0.5 },
        });
    }
};

// =============== ECHO REFRAME — Cognitive Restructuring ===============

exports.echoReframe = async (req, res) => {
    try {
        const { message, history = [] } = req.body;
        if (!message) return res.status(400).json({ message: 'Message is required' });

        const sentiment = detectSentiment(message);
        const distortion = detectDistortion(message);
        const openai = getOpenAI();

        if (!openai) {
            const distortionInfo = distortion
                ? `I notice a cognitive pattern here: **${distortion}**. This is when our mind ${
                    distortion === 'Catastrophizing' ? 'jumps to the worst possible outcome' :
                    distortion === 'All-or-Nothing' ? 'sees things in absolute black-and-white terms' :
                    distortion === 'Mind Reading' ? 'assumes we know what others are thinking' :
                    distortion === 'Overgeneralization' ? 'takes one event and applies it to everything' :
                    distortion === 'Emotional Reasoning' ? 'treats feelings as facts' :
                    'creates rigid rules with "should" and "must"'
                }.\n\n`
                : '';

            return res.json({
                response: `${distortionInfo}Let me ask you this: If you were giving advice to someone you deeply care about who shared this exact thought, what would you say to them? Often we're much kinder to others than to ourselves.`,
                sentiment,
                distortion,
            });
        }

        const systemPrompt = `You are Echo in Reframe Mode — a cognitive restructuring specialist. When the user shares a negative thought:

1. Identify the cognitive distortion (catastrophizing, all-or-nothing thinking, mind reading, overgeneralization, emotional reasoning, should statements, personalization, etc.)
2. Validate the emotion behind the thought
3. Gently challenge the thought using Socratic questioning
4. Keep it to 3-4 sentences

Respond with JSON: { "response": "your response", "distortion": "name of distortion or null" }`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            response_format: { type: "json_object" },
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message },
            ],
        });

        const parsed = JSON.parse(response.choices[0].message.content);
        res.json({
            response: parsed.response,
            sentiment,
            distortion: parsed.distortion || distortion,
        });

    } catch (err) {
        console.error('Echo reframe error:', err);
        res.json({
            response: "That's a heavy thought. Let me reflect it back differently: What would you say if your best friend came to you with this exact thought?",
            sentiment: { emotion: 'neutral', intensity: 0.5 },
            distortion: null,
        });
    }
};

// =============== PRISM — Multi-Perspective Reframing ===============

exports.prism = async (req, res) => {
    try {
        const { thought } = req.body;
        if (!thought) return res.status(400).json({ message: 'Thought is required' });

        const openai = getOpenAI();

        if (!openai) {
            // Smart fallback facets
            return res.json({
                facets: [
                    {
                        key: 'evidence_for',
                        content: `There may be some validity to "${thought.slice(0, 50)}..." — your feelings come from real experiences, and the pain is genuine. Acknowledging this isn't weakness, it's honesty.`,
                    },
                    {
                        key: 'evidence_against',
                        content: 'Consider: has there been a time when you expected the worst and things turned out differently? Our negativity bias makes threats seem larger than they are. What evidence contradicts this thought?',
                    },
                    {
                        key: 'compassionate',
                        content: `Imagine your closest friend told you: "${thought.slice(0, 40)}..." You wouldn't agree — you'd remind them of their strength, their past victories, and the many times they've overcome what seemed impossible.`,
                    },
                    {
                        key: 'future_self',
                        content: 'Your future self, looking back on this moment in five years, might say: "I was going through something difficult, but I got through it. That chapter shaped me but didn\'t define me. I\'m grateful I kept going."',
                    },
                    {
                        key: 'stoic',
                        content: '"We suffer more in imagination than in reality." — Seneca. The Stoics teach us to separate what we can control (our response) from what we cannot (others\' actions, external events). Where is your power in this situation?',
                    },
                    {
                        key: 'reframe',
                        content: `A healthier version of this thought might be: "I'm going through a genuinely difficult time. It's okay that I find this hard — most people would. I'm doing my best with the resources I have, and that's enough right now."`,
                    },
                ],
            });
        }

        const systemPrompt = `You are the Prism — a cognitive restructuring engine. Given a negative thought, generate 6 different perspectives as JSON. Each perspective challenges the thought differently.

Return JSON: {
  "facets": [
    { "key": "evidence_for", "content": "validation of the feeling while noting it's not the whole truth" },
    { "key": "evidence_against", "content": "evidence and experiences that contradict this thought" },
    { "key": "compassionate", "content": "what you'd say to a dear friend with this thought" },
    { "key": "future_self", "content": "perspective from 5 years in the future looking back" },
    { "key": "stoic", "content": "stoic philosophy perspective, with a relevant quote" },
    { "key": "reframe", "content": "a healthier, more balanced version of the original thought" }
  ]
}

Keep each facet 2-3 sentences. Be specific to the user's thought, not generic.`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            response_format: { type: "json_object" },
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: thought },
            ],
        });

        const parsed = JSON.parse(response.choices[0].message.content);
        res.json(parsed);

    } catch (err) {
        console.error('Prism error:', err);
        res.json({
            facets: [
                { key: 'evidence_for', content: "Your feelings are valid. The struggle you're experiencing is real." },
                { key: 'evidence_against', content: "Consider the times things turned out better than expected. Our minds tend to anticipate the worst." },
                { key: 'compassionate', content: "You deserve the same compassion you'd give to someone you love." },
                { key: 'future_self', content: "In time, this moment will be a chapter you've moved through, not your whole story." },
                { key: 'stoic', content: '"The happiness of your life depends upon the quality of your thoughts." — Marcus Aurelius' },
                { key: 'reframe', content: "Perhaps the truth is simpler: you're doing the best you can, and that's enough." },
            ],
        });
    }
};

// =============== SENTIMENT — Real-time Analysis ===============

exports.sentiment = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ message: 'Text is required' });

        const sentiment = detectSentiment(text);
        const distortion = detectDistortion(text);

        res.json({ sentiment, distortion });
    } catch (err) {
        console.error('Sentiment error:', err);
        res.json({ sentiment: { emotion: 'neutral', intensity: 0.5 }, distortion: null });
    }
};
