const EggProduction = require('../models/EggProduction');

const getEggs = async (req, res) => {
    try {
        const eggs = await EggProduction.find().populate('flockId', 'name').sort({ date: -1 });
        res.json(eggs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createEgg = async (req, res) => {
    try {
        const { pricePerEgg, eggsCollected, soldEggs } = req.body;
        const totalRevenue = soldEggs * pricePerEgg;
        const egg = new EggProduction({ ...req.body, totalRevenue });
        const createdEgg = await egg.save();
        res.status(201).json(createdEgg);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateEgg = async (req, res) => {
    try {
        const { pricePerEgg, soldEggs } = req.body;
        const totalRevenue = soldEggs * pricePerEgg;
        const egg = await EggProduction.findByIdAndUpdate(req.params.id, { ...req.body, totalRevenue }, { new: true });
        if (!egg) return res.status(404).json({ message: 'Ma\'lumot topilmadi' });
        res.json(egg);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteEgg = async (req, res) => {
    try {
        await EggProduction.findByIdAndDelete(req.params.id);
        res.json({ message: 'O\'chirildi' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getEggs, createEgg, updateEgg, deleteEgg };
