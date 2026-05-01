const mongoose = require('mongoose');

const HealthRecordSchema = new mongoose.Schema({
    flockId: { type: mongoose.Schema.Types.ObjectId, ref: 'Flock', required: true },
    date: { type: Date, required: true },
    recordType: { type: String, enum: ['vaccination', 'disease', 'treatment', 'mortality'], required: true },
    description: { type: String, required: true },
    medicineUsed: { type: String },
    dosage: { type: String },
    mortalityCount: { type: Number, default: 0 },
    veterinarianName: { type: String },
    cost: { type: Number, default: 0 },
    nextCheckDate: { type: Date },
    notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('HealthRecord', HealthRecordSchema);
