const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { RECORD_TYPES } = require('../config/constants');
const User = require('./User');

const FinancialRecord = sequelize.define('FinancialRecord', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: true,
      min: 0.01,
      max: 99999999.99
    }
  },
  type: {
    type: DataTypes.ENUM(...Object.values(RECORD_TYPES)),
    allowNull: false,
    validate: {
      isIn: [Object.values(RECORD_TYPES)]
    }
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 50]
    }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true,
      isBefore: new Date().toISOString().split('T')[0] // Not future date
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 500]
    }
  }
}, {
  tableName: 'financial_records',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

FinancialRecord.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(FinancialRecord, { foreignKey: 'user_id', as: 'records' });

module.exports = FinancialRecord;