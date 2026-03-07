const express = require('express');
const router = express.Router();
const { getResources, addResource } = require('../controllers/resourceController');

router.get('/', getResources);
// Typically protected, but left open for admin/demo seeding if needed
router.post('/', addResource);

module.exports = router;
