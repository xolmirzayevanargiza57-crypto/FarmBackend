const express = require('express');
const router = express.Router();
const { getFlocks, createFlock, updateFlock, deleteFlock } = require('../controllers/flockController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getFlocks).post(protect, createFlock);
router.route('/:id').put(protect, updateFlock).delete(protect, deleteFlock);

module.exports = router;
