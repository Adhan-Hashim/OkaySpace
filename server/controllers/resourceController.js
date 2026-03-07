const Resource = require('../models/Resource');

exports.getResources = async (req, res) => {
    try {
        const resources = await Resource.find();
        res.json(resources);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.addResource = async (req, res) => {
    try {
        const { title, category, content, author } = req.body;
        const newResource = new Resource({ title, category, content, author });
        await newResource.save();
        res.status(201).json(newResource);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};
