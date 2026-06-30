const express = require('express');
const router = express.Router();
const { echo, echoReframe, prism, sentiment, embed } = require('../controllers/aiController');

// Echo — AI Companion
router.post('/echo', echo);

// Echo Reframe — Cognitive Restructuring Mode
router.post('/echo-reframe', echoReframe);

// Prism — Multi-Perspective Thought Reframing
router.post('/prism', prism);

// Sentiment — Real-time Analysis
router.post('/sentiment', sentiment);

// Embed — Text Embeddings
router.post('/embed', embed);

module.exports = router;
