const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { chat } = require('../controllers/aiController');
const { moderate } = require('../controllers/aiController');

router.post('/chat', authMiddleware, chat);
router.post('/moderate', authMiddleware, moderate);

module.exports = router;
