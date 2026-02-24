const mongoose = require('mongoose');

const guardSchema = new mongoose.Schema(
    {
        name: { type: String, required: [true, 'Name is required'], trim: true },
        phone: { type: String, required: [true, 'Phone is required'], trim: true },
        salary: { type: Number, default: 0 },
        assignedSite: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', default: null },
        status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

module.exports = mongoose.model('Guard', guardSchema);
