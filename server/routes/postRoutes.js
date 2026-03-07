const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createPost, getPosts, likePost, addComment, getComments } = require('../controllers/postController');

router.get('/', getPosts);
router.post('/', authMiddleware, createPost);
router.post('/:id/like', authMiddleware, likePost);
router.get('/:id/comments', getComments);
router.post('/:id/comments', authMiddleware, addComment);

module.exports = router;
