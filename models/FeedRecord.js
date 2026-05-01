const mongoose = require('mongoose');

const FeedRecordSchema = new mongoose.Schema({
    flockId: { type: mongoose.Schema.Types.ObjectId, ref: 'Flock', required: true },
    date: { type: Date, required: true },
    feedType: { type: String, enum: ['starter', 'grower', 'finisher', 'layer'], required: true },
    quantityKg: { type: Number, required: true },
    costPerKg: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    supplier: { type: String },
    notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('FeedRecord', FeedRecordSchema);
