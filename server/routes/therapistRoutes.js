const express = require('express');
const router = express.Router();
const therapistController = require('../controllers/therapistController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, therapistController.getTherapists);
router.post('/book', authMiddleware, therapistController.bookAppointment);

module.exports = router;
