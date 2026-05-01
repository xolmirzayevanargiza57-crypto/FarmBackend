const FeedRecord = require('../models/FeedRecord');

const getFeeds = async (req, res) => {
    try {
        const feeds = await FeedRecord.find().populate('flockId', 'name').sort({ date: -1 });
        res.json(feeds);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createFeed = async (req, res) => {
    try {
        const { quantityKg, costPerKg } = req.body;
        const totalCost = quantityKg * costPerKg;
        const feed = new FeedRecord({ ...req.body, totalCost });
        await feed.save();
        res.status(201).json(feed);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateFeed = async (req, res) => {
    try {
        const { quantityKg, costPerKg } = req.body;
        const totalCost = quantityKg * costPerKg;
        const feed = await FeedRecord.findByIdAndUpdate(req.params.id, { ...req.body, totalCost }, { new: true });
        res.json(feed);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteFeed = async (req, res) => {
    try {
        await FeedRecord.findByIdAndDelete(req.params.id);
        res.json({ message: 'O\'chirildi' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getFeeds, createFeed, updateFeed, deleteFeed };
