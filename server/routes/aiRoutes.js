const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { chat, moderate, analyzeMood, matchTherapist, triageEmergency } = require('../controllers/aiController');

router.post('/chat', authMiddleware, chat);
router.post('/moderate', authMiddleware, moderate);
router.post('/analyze-mood', authMiddleware, analyzeMood);
router.post('/match-therapist', authMiddleware, matchTherapist);
router.post('/triage', authMiddleware, triageEmergency);

module.exports = router;
