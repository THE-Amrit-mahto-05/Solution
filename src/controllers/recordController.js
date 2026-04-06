const recordService = require('../services/recordService');
const { response } = require('../utils/response');

class RecordController {
  // Create record
  async create(req, res, next) {
    try {
      const record = await recordService.createRecord(req.body, req.user.id);
      res.status(201).json(response.success(record, 'Record created successfully'));
    } catch (error) {
      next(error);
    }
  }

  // Get all records
  async getAll(req, res, next) {
    try {
      const filters = {};
      
      // Extract query parameters
      if (req.query.type) filters.type = req.query.type;
      if (req.query.category) filters.category = req.query.category;
      if (req.query.startDate) filters.startDate = req.query.startDate;
      if (req.query.endDate) filters.endDate = req.query.endDate;

      const records = await recordService.getAllRecords(filters, req.user.id, req.user.role);
      res.json(response.success(records));
    } catch (error) {
      next(error);
    }
  }

  // Get record by ID
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const record = await recordService.getRecordById(parseInt(id), req.user.id, req.user.role);
      res.json(response.success(record));
    } catch (error) {
      next(error);
    }
  }

  // Update record
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const record = await recordService.updateRecord(parseInt(id), req.body, req.user.id, req.user.role);
      res.json(response.success(record, 'Record updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  // Delete record
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const result = await recordService.deleteRecord(parseInt(id), req.user.id, req.user.role);
      res.json(response.success(result));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RecordController();