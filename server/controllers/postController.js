const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Filter = require('bad-words');
const filter = new Filter();

exports.createPost = async (req, res) => {
    try {
        const { content, anonymous } = req.body;

        if (filter.isProfane(content)) {
            return res.status(400).json({ message: 'Harmful content detected. Please keep the community safe.' });
        }

        const newPost = new Post({
            userId: req.user.id,
            content,
            anonymous: anonymous !== undefined ? anonymous : true
        });
        const savedPost = await newPost.save();

        // Populate user if not anonymous, else omit
        let returnedPost = savedPost.toObject();
        if (!returnedPost.anonymous) {
            const populated = await Post.findById(savedPost._id).populate('userId', 'name');
            returnedPost = populated;
        }

        res.status(201).json(returnedPost);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('userId', 'name') // will handle hiding name in frontend if anonymous=true
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (post.likes.includes(req.user.id)) {
            post.likes = post.likes.filter(id => id.toString() !== req.user.id);
        } else {
            post.likes.push(req.user.id);
        }

        await post.save();
        res.json(post.likes);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.addComment = async (req, res) => {
    try {
        const { comment } = req.body;

        if (filter.isProfane(comment)) {
            return res.status(400).json({ message: 'Harmful language detected. Please keep the community safe.' });
        }

        const newComment = new Comment({
            postId: req.params.id,
            userId: req.user.id,
            comment
        });

        await newComment.save();
        const populatedComment = await Comment.findById(newComment._id).populate('userId', 'name');
        res.status(201).json(populatedComment);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.id })
            .populate('userId', 'name')
            .sort({ createdAt: 1 });
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};
