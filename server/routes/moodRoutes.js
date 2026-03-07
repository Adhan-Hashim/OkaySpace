const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { logMood, getMoodHistory } = require('../controllers/moodController');

router.post('/', authMiddleware, logMood);
router.get('/', authMiddleware, getMoodHistory);

module.exports = router;
