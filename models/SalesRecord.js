const mongoose = require('mongoose');

const SalesRecordSchema = new mongoose.Schema({
    flockId: { type: mongoose.Schema.Types.ObjectId, ref: 'Flock' },
    date: { type: Date, required: true },
    saleType: { type: String, enum: ['eggs', 'live_chicken', 'meat'], required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, enum: ['pieces', 'kg'], required: true },
    pricePerUnit: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    buyerName: { type: String },
    buyerContact: { type: String },
    paymentStatus: { type: String, enum: ['paid', 'pending', 'partial'], default: 'paid' },
    notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('SalesRecord', SalesRecordSchema);
