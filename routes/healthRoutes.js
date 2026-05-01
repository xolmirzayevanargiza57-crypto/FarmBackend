const express = require('express');
const router = express.Router();
const { getHealth, createHealth, updateHealth, deleteHealth } = require('../controllers/healthController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getHealth).post(protect, createHealth);
router.route('/:id').put(protect, updateHealth).delete(protect, deleteHealth);

module.exports = router;
