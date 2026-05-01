const Flock = require('../models/Flock');

const getFlocks = async (req, res) => {
    try {
        const flocks = await Flock.find().sort({ createdAt: -1 });
        res.json(flocks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createFlock = async (req, res) => {
    try {
        const flock = new Flock(req.body);
        const createdFlock = await flock.save();
        res.status(201).json(createdFlock);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateFlock = async (req, res) => {
    try {
        const flock = await Flock.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!flock) return res.status(404).json({ message: 'Poda topilmadi' });
        res.json(flock);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteFlock = async (req, res) => {
    try {
        const flock = await Flock.findByIdAndDelete(req.params.id);
        if (!flock) return res.status(404).json({ message: 'Poda topilmadi' });
        res.json({ message: 'Poda o\'chirildi' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getFlocks, createFlock, updateFlock, deleteFlock };
