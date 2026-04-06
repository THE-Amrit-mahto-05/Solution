const authService = require('../services/authService');
const { response } = require('../utils/response');

class AuthController {
  // Register user
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(response.success(result, 'User registered successfully'));
    } catch (error) {
      next(error);
    }
  }

  // Login user
  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);
      res.json(response.success(result, 'Login successful'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();