const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { saveEntry, getEntries } = require('../controllers/cbtController');

router.get('/', authMiddleware, getEntries);
router.post('/', authMiddleware, saveEntry);

module.exports = router;
