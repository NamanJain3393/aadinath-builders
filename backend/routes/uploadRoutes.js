const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'aadinath-builders',
        resource_type: 'auto',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'mp4', 'mov', 'webm'],
    },
});

const upload = multer({ storage: storage });

router.post('/', upload.single('image'), (req, res) => {
    res.send({
        message: 'Image Uploaded',
        filePath: req.file.path, // Cloudinary returns the full URL in .path
    });
});

module.exports = router;
