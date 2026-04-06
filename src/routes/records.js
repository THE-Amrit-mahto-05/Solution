const express = require('express');
const recordController = require('../controllers/recordController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { validateRecord } = require('../middleware/validate');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// POST /api/records - Create record (Admin only)
router.post('/', authorize('admin'), validateRecord, recordController.create);

// GET /api/records - Get all records (with optional filters)
router.get('/', recordController.getAll);

// GET /api/records/:id - Get record by ID
router.get('/:id', recordController.getById);

// PUT /api/records/:id - Update record (Admin only)
router.put('/:id', authorize('admin'), validateRecord, recordController.update);

// DELETE /api/records/:id - Delete record (Admin only)
router.delete('/:id', authorize('admin'), recordController.delete);

module.exports = router;