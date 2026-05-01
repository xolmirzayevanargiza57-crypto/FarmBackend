const mongoose = require('mongoose');

const EggProductionSchema = new mongoose.Schema({
    flockId: { type: mongoose.Schema.Types.ObjectId, ref: 'Flock', required: true },
    date: { type: Date, required: true },
    eggsCollected: { type: Number, required: true },
    brokenEggs: { type: Number, default: 0 },
    soldEggs: { type: Number, default: 0 },
    remainingEggs: { type: Number, default: 0 },
    pricePerEgg: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('EggProduction', EggProductionSchema);
