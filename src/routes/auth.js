const express = require('express');
const authController = require('../controllers/authController');
const { validateUserRegistration, validateUserLogin } = require('../middleware/validate');

const router = express.Router();

// POST /api/auth/register
router.post('/register', validateUserRegistration, authController.register);

// POST /api/auth/login
router.post('/login', validateUserLogin, authController.login);

module.exports = router;