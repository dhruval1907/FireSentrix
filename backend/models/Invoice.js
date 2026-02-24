const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
    {
        client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
        amount: { type: Number, required: [true, 'Amount is required'] },
        month: { type: String, required: [true, 'Month is required'] },
        status: { type: String, enum: ['paid', 'unpaid'], default: 'unpaid' },
    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

module.exports = mongoose.model('Invoice', invoiceSchema);
