const { Sequelize } = require('sequelize');
const config = require('./env');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: config.DATABASE_PATH,
  logging: config.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true
  }
});

// Test connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };