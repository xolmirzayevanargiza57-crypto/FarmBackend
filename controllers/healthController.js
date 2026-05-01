const HealthRecord = require('../models/HealthRecord');

const getHealth = async (req, res) => {
    try {
        const records = await HealthRecord.find().populate('flockId', 'name').sort({ date: -1 });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createHealth = async (req, res) => {
    try {
        const record = new HealthRecord(req.body);
        await record.save();
        res.status(201).json(record);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateHealth = async (req, res) => {
    try {
        const record = await HealthRecord.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(record);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteHealth = async (req, res) => {
    try {
        await HealthRecord.findByIdAndDelete(req.params.id);
        res.json({ message: 'O\'chirildi' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getHealth, createHealth, updateHealth, deleteHealth };
