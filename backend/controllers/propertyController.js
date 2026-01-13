const Property = require('../models/Property');

// @desc    Fetch all properties
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res) => {
    try {
        const pageSize = 10;
        const page = Number(req.query.pageNumber) || 1;

        const keyword = req.query.keyword
            ? {
                title: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
            }
            : {};

        const count = await Property.countDocuments({ ...keyword });
        const properties = await Property.find({ ...keyword })
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({ properties, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Fetch single property
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (property) {
            res.json(property);
        } else {
            res.status(404).json({ message: 'Property not found' });
        }
    } catch (error) {
        res.status(404).json({ message: 'Property not found' });
    }
};

// @desc    Create a property
// @route   POST /api/properties
// @access  Private/Admin
const createProperty = async (req, res) => {
    try {
        const {
            title, price, location, type, area, description, images,
            bedrooms, bathrooms, balconies, parking, furnishing, floorNumber,
            carpetArea, superArea, propertyAge, facing, project, amenities
        } = req.body;

        const property = new Property({
            title, price, location, type, area, description, images,
            bedrooms, bathrooms, balconies, parking, furnishing, floorNumber,
            carpetArea, superArea, propertyAge, facing, project, amenities
        });

        const createdProperty = await property.save();
        res.status(201).json(createdProperty);
    } catch (error) {
        res.status(400).json({ message: 'Invalid property data' });
    }
};

// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private/Admin
const updateProperty = async (req, res) => {
    try {
        const {
            title, price, location, type, area, description, images, status,
            bedrooms, bathrooms, balconies, parking, furnishing, floorNumber,
            carpetArea, superArea, propertyAge, facing, project, amenities, videoUrl
        } = req.body;

        const property = await Property.findById(req.params.id);

        if (property) {
            property.title = title || property.title;
            // ... (keep existing updates) ... 
            property.price = price || property.price;
            property.location = location || property.location;
            property.type = type || property.type;
            property.area = area || property.area;
            property.description = description || property.description;
            property.images = images || property.images;
            property.status = status || property.status;

            // Updated fields
            property.bedrooms = bedrooms !== undefined ? bedrooms : property.bedrooms;
            property.bathrooms = bathrooms !== undefined ? bathrooms : property.bathrooms;
            property.balconies = balconies !== undefined ? balconies : property.balconies;
            property.parking = parking || property.parking;
            property.furnishing = furnishing || property.furnishing;
            property.floorNumber = floorNumber || property.floorNumber;
            property.carpetArea = carpetArea || property.carpetArea;
            property.superArea = superArea || property.superArea;
            property.propertyAge = propertyAge || property.propertyAge;
            property.facing = facing || property.facing;
            property.project = project || property.project;
            property.amenities = amenities || property.amenities;
            property.videoUrl = videoUrl || property.videoUrl;

            const updatedProperty = await property.save();
            res.json(updatedProperty);
        } else {
            res.status(404).json({ message: 'Property not found' });
        }
    } catch (error) {
        res.status(404).json({ message: 'Property not found' });
    }
};

// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private/Admin
const deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (property) {
            await property.deleteOne();
            res.json({ message: 'Property removed' });
        } else {
            res.status(404).json({ message: 'Property not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
};
