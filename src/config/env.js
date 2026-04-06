require('dotenv').config();

const config = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_PATH: process.env.DATABASE_PATH || './database/finance.db'
};

module.exports = config;