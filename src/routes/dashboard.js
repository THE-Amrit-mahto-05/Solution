const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const authenticate = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/dashboard/summary - Get dashboard summary
router.get('/summary', dashboardController.getSummary);

// GET /api/dashboard/category-breakdown - Get category breakdown
router.get('/category-breakdown', dashboardController.getCategoryBreakdown);

// GET /api/dashboard/monthly-trends - Get monthly trends
router.get('/monthly-trends', dashboardController.getMonthlyTrends);

// GET /api/dashboard/recent-activity - Get recent activity
router.get('/recent-activity', dashboardController.getRecentActivity);

module.exports = router;