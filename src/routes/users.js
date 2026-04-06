const express = require('express');
const userController = require('../controllers/userController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { validateRoleUpdate } = require('../middleware/validate');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/users - Get all users (Admin only)
router.get('/', authorize('admin'), userController.getAllUsers);

// GET /api/users/:id - Get user by ID (Admin only)
router.get('/:id', authorize('admin'), userController.getUserById);

// PUT /api/users/:id/role - Update user role (Admin only)
router.put('/:id/role', authorize('admin'), validateRoleUpdate, userController.updateUserRole);

// PUT /api/users/:id/status - Update user status (Admin only)
router.put('/:id/status', authorize('admin'), userController.updateUserStatus);

module.exports = router;