const app = require('./src/app');
const { connectDB } = require('./src/config/database');
const config = require('./src/config/env');

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Sync database (create tables)
    const { sequelize } = require('./src/config/database');
    await sequelize.sync({ force: false }); // Set to true only for development

    console.log('Database synchronized successfully.');

    // Start server
    const server = app.listen(config.PORT, () => {
      console.log(`🚀 Finance Dashboard API is running on port ${config.PORT}`);
      console.log(`📊 Environment: ${config.NODE_ENV}`);
      console.log(`🔗 Health check: http://localhost:${config.PORT}/health`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('Process terminated');
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down gracefully');
      server.close(() => {
        console.log('Process terminated');
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();