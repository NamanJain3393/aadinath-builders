const Visit = require('../models/Visit');

// @desc    Increment visit count
// @route   POST /api/visits
// @access  Public
const incrementVisit = async (req, res) => {
    try {
        let visit = await Visit.findOne({ page: 'home' });

        if (!visit) {
            visit = new Visit({ count: 1 });
        } else {
            visit.count = visit.count + 1;
        }

        await visit.save();
        res.status(200).json({ count: visit.count });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get visit count
// @route   GET /api/visits
// @access  Private/Admin
const getVisits = async (req, res) => {
    try {
        const visit = await Visit.findOne({ page: 'home' });
        const count = visit ? visit.count : 0;
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { incrementVisit, getVisits };
