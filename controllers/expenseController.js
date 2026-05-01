const Expense = require('../models/Expense');

const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find().sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createExpense = async (req, res) => {
    try {
        const expense = new Expense(req.body);
        await expense.save();
        res.status(201).json(expense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateExpense = async (req, res) => {
    try {
        const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(expense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteExpense = async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: 'O\'chirildi' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getExpenses, createExpense, updateExpense, deleteExpense };
