const userService = require('../services/userService');
const { response } = require('../utils/response');

class UserController {
  // Get all users
  async getAllUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      res.json(response.success(users));
    } catch (error) {
      next(error);
    }
  }

  // Get user by ID
  async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(parseInt(id));
      res.json(response.success(user));
    } catch (error) {
      next(error);
    }
  }

  // Update user role
  async updateUserRole(req, res, next) {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const currentUserId = req.user.id;
      
      const result = await userService.updateUserRole(parseInt(id), role, currentUserId);
      res.json(response.success(result, 'User role updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  // Update user status
  async updateUserStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const currentUserId = req.user.id;
      
      const result = await userService.updateUserStatus(parseInt(id), status, currentUserId);
      res.json(response.success(result, 'User status updated successfully'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();