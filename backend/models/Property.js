const mongoose = require('mongoose');

const propertySchema = mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true, enum: ['Flat', 'Plot', 'Villa', 'Commercial'] },
    area: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    status: { type: String, default: 'Available', enum: ['Available', 'Sold'] },
}, {
    timestamps: true,
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
