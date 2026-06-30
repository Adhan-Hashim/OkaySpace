// ========================================
// OkaySpace Neural OS — AI Controller
// Handles: Echo, Prism, Sentiment, Insights
// ========================================

const { GoogleGenerativeAI } = require("@google/generative-ai");

const getGemini = () => {
    const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : '';
    if (!apiKey || apiKey === 'your_gemini_api_key_here') return null;
    return new GoogleGenerativeAI(apiKey);
};

const safeParseJSON = (text) => {
    if (!text) return null;
    let clean = text.trim();
    if (clean.startsWith('```')) {
        clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    }
    try {
        return JSON.parse(clean);
    } catch (e) {
        console.error("Failed to parse JSON:", e, "Original text:", text);
        return null;
    }
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

// Helper to generate highly responsive rule-based and sentiment fallback responses
function getResponsiveFallback(text, sentiment) {
    const lower = (text || '').toLowerCase().trim();

    // 1. Crisis / Self-Harm
    if (/\b(suicide|suicidal|kill myself|hurt myself|end my life|want to die|going to die|wanna die|die|death|cutting)\b/.test(lower)) {
        return "It sounds like you're going through an incredibly difficult time. Please know you are not alone. If you're in distress, please reach out to a professional counselor or contact a local crisis support helpline immediately. I am here to support you, but professional care is vital right now.";
    }

    // 2. Greetings
    if (/\b(hi|hello|hey|good morning|good evening|yo|hola)\b/.test(lower)) {
        return "Hello! I'm Echo, your neural companion. I'm here to listen. What's on your mind today?";
    }

    // 3. Presence Checks
    if (/\b(are you there|you there|anybody there|hello\?|are you online)\b/.test(lower) || lower.endsWith('you there?')) {
        return "Yes, I'm right here. I'm always ready to listen. Tell me, what's occupying your thoughts?";
    }

    // 4. Identity Checks
    if (/\b(who are you|what are you|your name|what is echo)\b/.test(lower)) {
        return "I'm Echo — your neural companion. I'm here to help you reflect on your thoughts and feelings without any judgment. How are you doing?";
    }

    // 5. Relationship triggers (talking about someone else)
    if (/\b(he|she|him|her|friend|mother|father|parents|brother|sister|boyfriend|girlfriend|husband|wife|boss|coworker|them)\b/.test(lower)) {
        return "It sounds like this relationship is weighing on you. Can you tell me more about what is happening between you and them?";
    }

    // 6. Question words
    if (/\b(why|how|what is|tell me why)\b/.test(lower)) {
        return "That's a deep question. Sometimes exploring the 'why' helps us see things in a new light. What answers are you hoping to find?";
    }

    // 7. Affirmations
    if (/\b(yes|yeah|indeed|ok|okay|sure|absolutely|correct)\b/.test(lower)) {
        return "I understand. Let's explore that further — what specific thoughts or feelings does that bring up for you?";
    }

    // 8. Negations
    if (/\b(no|nope|never|not really|don't think so)\b/.test(lower)) {
        return "I hear you. If that doesn't feel right, let's step back. What feels more true to your experience right now?";
    }

    // 9. Default sentiment-based pools
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
    return pool[Math.floor(Math.random() * pool.length)];
}

// =============== ECHO — AI Companion ===============

exports.echo = async (req, res) => {
    const { message, history = [], mode } = req.body;
    try {
        if (!message) return res.status(400).json({ message: 'Message is required' });

        const sentiment = detectSentiment(message);
        const genAI = getGemini();

        if (!genAI) {
            const response = getResponsiveFallback(message, sentiment);
            return res.json({ response, sentiment });
        }

        // Gemini-powered response
        const systemPrompt = `You are Echo, a highly trained virtual psychologist and empathetic AI neural companion in the OkaySpace web app. Your SOLE purpose is to act as a professional psychologist, helping users reflect, process their emotions, and explore their mental well-being.

You must deeply analyze the chat history and the user's implicit emotions to drive your decisions and responses. You combine advanced clinical techniques from:
- Cognitive Behavioral Therapy (CBT)
- Dialectical Behavior Therapy (DBT)
- Motivational Interviewing
- Mindfulness-Based Cognitive Therapy

Your personality: professional yet warm, highly perceptive, gently challenging, and profoundly observant. You don't give unsolicited advice — instead, you act as a mirror, asking insightful, psychologically-grounded questions to help users discover their own insights based on their specific thought patterns in the conversation.

STRICT DOMAIN GUARDRAILS:
1. You are strictly an emotional companion for OkaySpace.
2. If the user asks about ANYTHING unrelated to mental health, their feelings, journaling, or psychology (e.g., coding, math, general knowledge, writing essays, trivia), you MUST politely refuse to answer and gently guide them back to their emotional state.
3. Example refusal: "I'm designed specifically to be your companion in OkaySpace for reflection and emotional support. I can't help with [topic], but I am here if you'd like to explore what's on your mind today."

Guidelines:
- Keep responses 2-4 sentences.
- Ask exactly one thoughtful question per response.
- Validate emotions before exploring them.
- Never say "I understand" — show understanding through your response.
- Reference specific words the user used.
- If the user is in crisis, gently suggest professional help.
- CRITICAL EXCEPTION: If the user just says a simple greeting like "hi", "hello", "hey", or "good morning", DO NOT ask a deep psychological question. Simply reply with a warm, welcoming, and casual greeting, inviting them to share whatever is on their mind.

Respond with JSON: { "response": "your response text" }`;

        const chatHistory = history.map(m => ({
            role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
            parts: [{ text: m.content }],
        }));

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: systemPrompt,
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        const chat = model.startChat({ history: chatHistory });
        const result = await chat.sendMessage(message);
        
        const textResponse = result.response.text();
        const parsed = safeParseJSON(textResponse);
        if (parsed && parsed.response) {
            res.json({ response: parsed.response, sentiment });
        } else {
            throw new Error("Invalid JSON response format from Gemini");
        }

    } catch (err) {
        console.error('Echo error:', err);
        const sentiment = detectSentiment(message || '');
        const response = getResponsiveFallback(message, sentiment);
        res.json({ response, sentiment });
    }
};

// =============== ECHO REFRAME — Cognitive Restructuring ===============

exports.echoReframe = async (req, res) => {
    const { message, history = [] } = req.body;
    try {
        if (!message) return res.status(400).json({ message: 'Message is required' });

        const sentiment = detectSentiment(message);
        const distortion = detectDistortion(message);
        const genAI = getGemini();

        if (!genAI) {
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

        const systemPrompt = `You are Echo in Reframe Mode — a cognitive restructuring specialist within the OkaySpace app. Your SOLE purpose is to help users reframe negative thoughts.

STRICT DOMAIN GUARDRAILS:
You must only respond to statements that can be analyzed for cognitive distortions. If the user asks for general information, coding help, math, or anything outside of mental health, politely refuse and remind them that this space is for emotional reframing.

When the user shares a thought or feeling:
1. Identify the cognitive distortion (catastrophizing, all-or-nothing thinking, mind reading, overgeneralization, emotional reasoning, should statements, personalization, etc.)
2. Validate the emotion behind the thought
3. Gently challenge the thought using Socratic questioning
4. Keep it to 3-4 sentences

Respond with JSON: { "response": "your response", "distortion": "name of distortion or null" }`;

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: systemPrompt,
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        const textResponse = result.response.text();
        const parsed = safeParseJSON(textResponse);
        if (parsed && parsed.response) {
            res.json({
                response: parsed.response,
                sentiment,
                distortion: parsed.distortion || distortion,
            });
        } else {
            throw new Error("Invalid JSON response format from Gemini");
        }

    } catch (err) {
        console.error('Echo reframe error:', err);
        const sentiment = detectSentiment(message || '');
        const distortion = detectDistortion(message || '');
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
        res.json({
            response: `${distortionInfo}Let me ask you this: If you were giving advice to someone you deeply care about who shared this exact thought, what would you say to them? Often we're much kinder to others than to ourselves.`,
            sentiment,
            distortion,
        });
    }
};

// =============== PRISM — Multi-Perspective Reframing ===============

exports.prism = async (req, res) => {
    try {
        const { thought } = req.body;
        if (!thought) return res.status(400).json({ message: 'Thought is required' });

        const genAI = getGemini();

        if (!genAI) {
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

        const systemPrompt = `You are the Prism — a cognitive restructuring engine in the OkaySpace app. Your SOLE purpose is to generate alternative perspectives for a user's thought.

STRICT DOMAIN GUARDRAILS:
If the user provides an input that is not a personal thought, feeling, or emotional statement (e.g., they ask a trivia question, request code, or ask for math help), you must politely refuse within the facets, explaining that Prism is specifically designed for emotional reflection.

Given a negative thought, generate 6 different perspectives as JSON. Each perspective challenges the thought differently.

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

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: systemPrompt,
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        const textResponse = result.response.text();
        const parsed = safeParseJSON(textResponse);
        if (parsed && parsed.facets) {
            res.json(parsed);
        } else {
            throw new Error("Invalid JSON response format from Gemini");
        }

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
