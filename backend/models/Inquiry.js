const mongoose = require('mongoose');

const inquirySchema = mongoose.Schema({
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: false, // In case it's a general inquiry
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
}, {
    timestamps: true,
});

const Inquiry = mongoose.model('Inquiry', inquirySchema);

module.exports = Inquiry;
