const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');
const { sendInquiryEmail } = require('../utils/emailService');

// @desc    Create new inquiry
// @route   POST /api/inquiries
// @access  Public
const createInquiry = async (req, res) => {
    try {
        const { propertyId, name, email, phone, message } = req.body;

        const inquiry = new Inquiry({
            propertyId: propertyId || null,
            name,
            email,
            phone,
            message,
        });

        const createdInquiry = await inquiry.save();

        // Get property title for the email if it's a property inquiry
        let propertyTitle = 'General Inquiry';
        if (propertyId) {
            const property = await Property.findById(propertyId);
            if (property) {
                propertyTitle = `Property: ${property.title}`;
            }
        }

        // Send Email Notification asynchronously
        sendInquiryEmail(createdInquiry, propertyTitle);

        res.status(201).json(createdInquiry);
    } catch (error) {
        console.error('Error creating inquiry:', error);
        res.status(400).json({ message: 'Invalid inquiry data', error: error.message });
    }
};

// @desc    Get all inquiries
// @route   GET /api/inquiries
// @access  Private/Admin
const getInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find({}).populate('propertyId', 'title');
        res.json(inquiries);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { createInquiry, getInquiries };
