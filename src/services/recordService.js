const FinancialRecord = require('../models/FinancialRecord');
const { RECORD_TYPES } = require('../config/constants');
const { Op } = require('sequelize');

class RecordService {
  // Create a new financial record
  async createRecord(recordData, userId) {
    const record = await FinancialRecord.create({
      ...recordData,
      user_id: userId
    });

    return await this.getRecordById(record.id);
  }

  // Get all records with optional filtering
  async getAllRecords(filters = {}, userId = null, userRole = null) {
    const whereClause = {};

    // If not admin, only show user's own records
    if (userRole !== 'admin') {
      whereClause.user_id = userId;
    }

    // Apply filters
    if (filters.type) {
      whereClause.type = filters.type;
    }

    if (filters.category) {
      whereClause.category = { [Op.iLike]: `%${filters.category}%` };
    }

    if (filters.startDate && filters.endDate) {
      whereClause.date = {
        [Op.between]: [filters.startDate, filters.endDate]
      };
    } else if (filters.startDate) {
      whereClause.date = { [Op.gte]: filters.startDate };
    } else if (filters.endDate) {
      whereClause.date = { [Op.lte]: filters.endDate };
    }

    const records = await FinancialRecord.findAll({
      where: whereClause,
      include: [{
        model: require('../models/User'),
        as: 'user',
        attributes: ['id', 'name', 'email']
      }],
      order: [['date', 'DESC'], ['created_at', 'DESC']]
    });

    return records;
  }

  // Get record by ID
  async getRecordById(id, userId = null, userRole = null) {
    const whereClause = { id };

    // If not admin, only allow access to own records
    if (userRole !== 'admin') {
      whereClause.user_id = userId;
    }

    const record = await FinancialRecord.findOne({
      where: whereClause,
      include: [{
        model: require('../models/User'),
        as: 'user',
        attributes: ['id', 'name', 'email']
      }]
    });

    if (!record) {
      throw new Error('Record not found');
    }

    return record;
  }

  // Update record
  async updateRecord(id, updateData, userId, userRole) {
    const record = await FinancialRecord.findByPk(id);
    
    if (!record) {
      throw new Error('Record not found');
    }

    // Check permissions
    if (userRole !== 'admin' && record.user_id !== userId) {
      throw new Error('Access denied');
    }

    // Update record
    Object.assign(record, updateData);
    await record.save();

    return await this.getRecordById(id, userId, userRole);
  }

  // Delete record
  async deleteRecord(id, userId, userRole) {
    const record = await FinancialRecord.findByPk(id);
    
    if (!record) {
      throw new Error('Record not found');
    }

    // Check permissions
    if (userRole !== 'admin' && record.user_id !== userId) {
      throw new Error('Access denied');
    }

    await record.destroy();
    return { message: 'Record deleted successfully' };
  }

  // Get dashboard summary
  async getDashboardSummary(userId = null, userRole = null) {
    const whereClause = {};

    // If not admin, only include user's own records
    if (userRole !== 'admin') {
      whereClause.user_id = userId;
    }

    const records = await FinancialRecord.findAll({
      where: whereClause,
      attributes: ['amount', 'type'],
      raw: true
    });

    let totalIncome = 0;
    let totalExpense = 0;

    records.forEach(record => {
      if (record.type === RECORD_TYPES.INCOME) {
        totalIncome += parseFloat(record.amount);
      } else if (record.type === RECORD_TYPES.EXPENSE) {
        totalExpense += parseFloat(record.amount);
      }
    });

    return {
      totalIncome: parseFloat(totalIncome.toFixed(2)),
      totalExpense: parseFloat(totalExpense.toFixed(2)),
      netBalance: parseFloat((totalIncome - totalExpense).toFixed(2)),
      recordCount: records.length
    };
  }

  // Get category breakdown
  async getCategoryBreakdown(userId = null, userRole = null) {
    const whereClause = {};

    // If not admin, only include user's own records
    if (userRole !== 'admin') {
      whereClause.user_id = userId;
    }

    const breakdown = await FinancialRecord.findAll({
      where: whereClause,
      attributes: [
        'category',
        [FinancialRecord.sequelize.fn('SUM', FinancialRecord.sequelize.col('amount')), 'total'],
        [FinancialRecord.sequelize.fn('COUNT', FinancialRecord.sequelize.col('id')), 'count']
      ],
      group: ['category'],
      raw: true
    });

    return breakdown.map(item => ({
      category: item.category,
      total: parseFloat(item.total),
      count: parseInt(item.count)
    }));
  }

  // Get monthly trends
  async getMonthlyTrends(months = 6, userId = null, userRole = null) {
    const whereClause = {};

    // If not admin, only include user's own records
    if (userRole !== 'admin') {
      whereClause.user_id = userId;
    }

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    whereClause.date = {
      [Op.between]: [startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]]
    };

    const trends = await FinancialRecord.findAll({
      where: whereClause,
      attributes: [
        [FinancialRecord.sequelize.fn('strftime', '%Y-%m', FinancialRecord.sequelize.col('date')), 'month'],
        'type',
        [FinancialRecord.sequelize.fn('SUM', FinancialRecord.sequelize.col('amount')), 'total']
      ],
      group: ['month', 'type'],
      order: [['month', 'ASC']],
      raw: true
    });

    // Process data into monthly format
    const monthlyData = {};
    
    trends.forEach(item => {
      const month = item.month;
      if (!monthlyData[month]) {
        monthlyData[month] = { month, income: 0, expense: 0, net: 0 };
      }
      
      const amount = parseFloat(item.total);
      if (item.type === RECORD_TYPES.INCOME) {
        monthlyData[month].income = amount;
      } else if (item.type === RECORD_TYPES.EXPENSE) {
        monthlyData[month].expense = amount;
      }
      
      monthlyData[month].net = monthlyData[month].income - monthlyData[month].expense;
    });

    return Object.values(monthlyData);
  }

  // Get recent activity
  async getRecentActivity(limit = 10, userId = null, userRole = null) {
    const whereClause = {};

    // If not admin, only include user's own records
    if (userRole !== 'admin') {
      whereClause.user_id = userId;
    }

    const records = await FinancialRecord.findAll({
      where: whereClause,
      include: [{
        model: require('../models/User'),
        as: 'user',
        attributes: ['id', 'name', 'email']
      }],
      order: [['created_at', 'DESC']],
      limit
    });

    return records;
  }
}

module.exports = new RecordService();