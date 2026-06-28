const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { saveEntry, getEntries, getAnalytics } = require('../controllers/cbtController');

router.get('/', authMiddleware, getEntries);
router.post('/', authMiddleware, saveEntry);
router.get('/analytics', authMiddleware, getAnalytics);

module.exports = router;
