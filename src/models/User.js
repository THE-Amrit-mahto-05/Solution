const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { ROLES, USER_STATUS } = require('../config/constants');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [6, 255]
    }
  },
  role: {
    type: DataTypes.ENUM(...Object.values(ROLES)),
    allowNull: false,
    defaultValue: ROLES.VIEWER,
    validate: {
      isIn: [Object.values(ROLES)]
    }
  },
  status: {
    type: DataTypes.ENUM(...Object.values(USER_STATUS)),
    allowNull: false,
    defaultValue: USER_STATUS.ACTIVE,
    validate: {
      isIn: [Object.values(USER_STATUS)]
    }
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = User;