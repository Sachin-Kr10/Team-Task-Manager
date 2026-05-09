const express = require('express');
const router = express.Router();
const { getStats, getOverdueTasks } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.get('/stats', protect, getStats);
router.get('/overdue', protect, getOverdueTasks);

module.exports = router;
