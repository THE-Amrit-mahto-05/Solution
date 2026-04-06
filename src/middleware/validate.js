const Joi = require('joi');
const { RECORD_TYPES, ROLES } = require('../config/constants');

// User registration validation
const validateUserRegistration = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot exceed 100 characters'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters',
      'any.required': 'Password is required'
    }),
    role: Joi.string().valid(...Object.values(ROLES)).optional().default(ROLES.VIEWER)
  });

  const { error, value } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const details = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details
      }
    });
  }

  req.body = value;
  next();
};

// User login validation
const validateUserLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required'
    })
  });

  const { error, value } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const details = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details
      }
    });
  }

  req.body = value;
  next();
};

// Financial record validation
const validateRecord = (req, res, next) => {
  const schema = Joi.object({
    amount: Joi.number().positive().precision(2).max(99999999.99).required().messages({
      'number.base': 'Amount must be a number',
      'number.positive': 'Amount must be positive',
      'number.max': 'Amount cannot exceed 99,999,999.99',
      'any.required': 'Amount is required'
    }),
    type: Joi.string().valid(...Object.values(RECORD_TYPES)).required().messages({
      'any.only': 'Type must be either income or expense',
      'any.required': 'Type is required'
    }),
    category: Joi.string().min(2).max(50).required().messages({
      'string.min': 'Category must be at least 2 characters',
      'string.max': 'Category cannot exceed 50 characters',
      'any.required': 'Category is required'
    }),
    date: Joi.date().iso().max('now').required().messages({
      'date.format': 'Date must be in YYYY-MM-DD format',
      'date.max': 'Date cannot be in the future',
      'any.required': 'Date is required'
    }),
    notes: Joi.string().max(500).optional().allow('').messages({
      'string.max': 'Notes cannot exceed 500 characters'
    })
  });

  const { error, value } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const details = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details
      }
    });
  }

  req.body = value;
  next();
};

// User role update validation
const validateRoleUpdate = (req, res, next) => {
  const schema = Joi.object({
    role: Joi.string().valid(...Object.values(ROLES)).required().messages({
      'any.only': 'Role must be viewer, analyst, or admin',
      'any.required': 'Role is required'
    })
  });

  const { error, value } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const details = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details
      }
    });
  }

  req.body = value;
  next();
};

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateRecord,
  validateRoleUpdate
};