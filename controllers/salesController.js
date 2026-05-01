const SalesRecord = require('../models/SalesRecord');

const getSales = async (req, res) => {
    try {
        const sales = await SalesRecord.find().populate('flockId', 'name').sort({ date: -1 });
        res.json(sales);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createSale = async (req, res) => {
    try {
        const { quantity, pricePerUnit } = req.body;
        const totalAmount = quantity * pricePerUnit;
        const sale = new SalesRecord({ ...req.body, totalAmount });
        await sale.save();
        res.status(201).json(sale);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateSale = async (req, res) => {
    try {
        const { quantity, pricePerUnit } = req.body;
        const totalAmount = quantity * pricePerUnit;
        const sale = await SalesRecord.findByIdAndUpdate(req.params.id, { ...req.body, totalAmount }, { new: true });
        res.json(sale);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteSale = async (req, res) => {
    try {
        await SalesRecord.findByIdAndDelete(req.params.id);
        res.json({ message: 'O\'chirildi' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getSales, createSale, updateSale, deleteSale };
