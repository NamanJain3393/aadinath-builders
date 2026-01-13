const mongoose = require('mongoose');

const propertySchema = mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true, enum: ['Flat', 'Plot', 'Villa', 'Commercial'] },
    area: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    status: { type: String, default: 'Available', enum: ['Available', 'Sold', 'Under Offer'] },

    // Specifications
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    balconies: { type: Number, default: 0 },
    parking: { type: String, default: 'None' }, // e.g. '1 Covered', '2 Open'
    furnishing: { type: String, default: 'Unfurnished', enum: ['Unfurnished', 'Semi-Furnished', 'Fully-Furnished'] },
    floorNumber: { type: String, default: '' }, // e.g., '3rd of 5'

    // Dimensions
    carpetArea: { type: String, default: '' },
    superArea: { type: String, default: '' },

    // Additional Info
    propertyAge: { type: String, default: 'New Launch' }, // e.g., 'New Launch', 'Resale', 'Under Construction'
    facing: { type: String, default: '' }, // e.g., 'North-East'
    project: { type: String, default: '' }, // Project/Society Name

    // Amenities (Array of strings)
    amenities: [{ type: String }], // e.g., ['Lift', 'Gym', 'Pool']

    // Media
    videoUrl: { type: String, default: '' }, // YouTube/Vimeo link or direct URL
}, {
    timestamps: true,
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
