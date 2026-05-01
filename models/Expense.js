const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    category: { type: String, enum: ['feed', 'medicine', 'equipment', 'labor', 'utilities', 'other'], required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['cash', 'card', 'transfer'], required: true },
    receipt: { type: String },
    notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);
