const mongoose = require('mongoose');

const FlockSchema = new mongoose.Schema({
    flockId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    breed: { type: String, required: true },
    quantity: { type: Number, required: true },
    ageInDays: { type: Number, required: true },
    arrivalDate: { type: Date, required: true },
    status: { type: String, enum: ['active', 'sold', 'deceased'], default: 'active' },
    housingUnit: { type: String, required: true },
    notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Flock', FlockSchema);
