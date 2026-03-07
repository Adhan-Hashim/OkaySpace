const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const letterController = require('../controllers/letterController');

router.post('/', authMiddleware, letterController.sendLetter);
router.get('/random', authMiddleware, letterController.getRandomLetter);

module.exports = router;
