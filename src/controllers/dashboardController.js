const dashboardService = require('../services/dashboardService');
const { response } = require('../utils/response');

class DashboardController {
  // Get dashboard summary
  async getSummary(req, res, next) {
    try {
      const summary = await dashboardService.getSummary(req.user.id, req.user.role);
      res.json(response.success(summary));
    } catch (error) {
      next(error);
    }
  }

  // Get category breakdown
  async getCategoryBreakdown(req, res, next) {
    try {
      const breakdown = await dashboardService.getCategoryBreakdown(req.user.id, req.user.role);
      res.json(response.success(breakdown));
    } catch (error) {
      next(error);
    }
  }

  // Get monthly trends
  async getMonthlyTrends(req, res, next) {
    try {
      const months = parseInt(req.query.months) || 6;
      const trends = await dashboardService.getMonthlyTrends(months, req.user.id, req.user.role);
      res.json(response.success(trends));
    } catch (error) {
      next(error);
    }
  }

  // Get recent activity
  async getRecentActivity(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const activity = await dashboardService.getRecentActivity(limit, req.user.id, req.user.role);
      res.json(response.success(activity));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();