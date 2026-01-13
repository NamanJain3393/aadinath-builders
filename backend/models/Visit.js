const mongoose = require('mongoose');

const visitSchema = mongoose.Schema({
    count: {
        type: Number,
        required: true,
        default: 0,
    },
    page: {
        type: String,
        required: true,
        default: 'home',
    },
}, {
    timestamps: true,
});

const Visit = mongoose.model('Visit', visitSchema);

module.exports = Visit;
