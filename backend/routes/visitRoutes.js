const express = require('express');
const router = express.Router();
const { incrementVisit, getVisits } = require('../controllers/visitController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', incrementVisit);
router.get('/', protect, admin, getVisits);

module.exports = router;
