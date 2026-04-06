const recordService = require('./recordService');

class DashboardService {
  // Get dashboard summary
  async getSummary(userId, userRole) {
    return await recordService.getDashboardSummary(userId, userRole);
  }

  // Get category breakdown
  async getCategoryBreakdown(userId, userRole) {
    return await recordService.getCategoryBreakdown(userId, userRole);
  }

  // Get monthly trends
  async getMonthlyTrends(months = 6, userId, userRole) {
    return await recordService.getMonthlyTrends(months, userId, userRole);
  }

  // Get recent activity
  async getRecentActivity(limit = 10, userId, userRole) {
    return await recordService.getRecentActivity(limit, userId, userRole);
  }
}

module.exports = new DashboardService();