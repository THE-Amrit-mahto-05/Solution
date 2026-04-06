const bcrypt = require('bcryptjs');
const { sequelize } = require('../../src/config/database');
const User = require('../../src/models/User');
const FinancialRecord = require('../../src/models/FinancialRecord');
const { ROLES, RECORD_TYPES } = require('../../src/config/constants');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Sync database to create tables
    const { sequelize } = require('../../src/config/database');
    await sequelize.sync({ force: true }); // Force recreate tables
    console.log('Database synchronized and tables created.');

    // Create sample users
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('password123', saltRounds);

    const users = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: ROLES.ADMIN
      },
      {
        name: 'Analyst User',
        email: 'analyst@example.com',
        password: hashedPassword,
        role: ROLES.ANALYST
      },
      {
        name: 'Viewer User',
        email: 'viewer@example.com',
        password: hashedPassword,
        role: ROLES.VIEWER
      }
    ];

    console.log('Creating users...');
    const createdUsers = [];
    for (const userData of users) {
      const user = await User.create(userData);
      createdUsers.push(user);
      console.log(`✓ Created user: ${user.email} (${user.role})`);
    }

    // Create sample financial records
    const records = [
      // Admin's records
      { user_id: createdUsers[0].id, amount: 50000, type: RECORD_TYPES.INCOME, category: 'salary', date: '2024-01-01', notes: 'Monthly salary' },
      { user_id: createdUsers[0].id, amount: 15000, type: RECORD_TYPES.EXPENSE, category: 'rent', date: '2024-01-05', notes: 'Monthly rent' },
      { user_id: createdUsers[0].id, amount: 5000, type: RECORD_TYPES.EXPENSE, category: 'groceries', date: '2024-01-10', notes: 'Weekly groceries' },
      { user_id: createdUsers[0].id, amount: 2000, type: RECORD_TYPES.EXPENSE, category: 'utilities', date: '2024-01-15', notes: 'Electricity bill' },
      { user_id: createdUsers[0].id, amount: 3000, type: RECORD_TYPES.EXPENSE, category: 'entertainment', date: '2024-01-20', notes: 'Movie tickets and dining' },

      { user_id: createdUsers[0].id, amount: 50000, type: RECORD_TYPES.INCOME, category: 'salary', date: '2024-02-01', notes: 'Monthly salary' },
      { user_id: createdUsers[0].id, amount: 15000, type: RECORD_TYPES.EXPENSE, category: 'rent', date: '2024-02-05', notes: 'Monthly rent' },
      { user_id: createdUsers[0].id, amount: 4500, type: RECORD_TYPES.EXPENSE, category: 'groceries', date: '2024-02-10', notes: 'Weekly groceries' },
      { user_id: createdUsers[0].id, amount: 1800, type: RECORD_TYPES.EXPENSE, category: 'utilities', date: '2024-02-15', notes: 'Electricity bill' },
      { user_id: createdUsers[0].id, amount: 2500, type: RECORD_TYPES.EXPENSE, category: 'transportation', date: '2024-02-20', notes: 'Fuel and maintenance' },

      { user_id: createdUsers[0].id, amount: 50000, type: RECORD_TYPES.INCOME, category: 'salary', date: '2024-03-01', notes: 'Monthly salary' },
      { user_id: createdUsers[0].id, amount: 15000, type: RECORD_TYPES.EXPENSE, category: 'rent', date: '2024-03-05', notes: 'Monthly rent' },
      { user_id: createdUsers[0].id, amount: 5200, type: RECORD_TYPES.EXPENSE, category: 'groceries', date: '2024-03-10', notes: 'Weekly groceries' },
      { user_id: createdUsers[0].id, amount: 2200, type: RECORD_TYPES.EXPENSE, category: 'utilities', date: '2024-03-15', notes: 'Electricity and water' },
      { user_id: createdUsers[0].id, amount: 1500, type: RECORD_TYPES.EXPENSE, category: 'healthcare', date: '2024-03-20', notes: 'Medical checkup' },

      // Analyst's records (fewer)
      { user_id: createdUsers[1].id, amount: 45000, type: RECORD_TYPES.INCOME, category: 'salary', date: '2024-01-01', notes: 'Monthly salary' },
      { user_id: createdUsers[1].id, amount: 12000, type: RECORD_TYPES.EXPENSE, category: 'rent', date: '2024-01-05', notes: 'Monthly rent' },
      { user_id: createdUsers[1].id, amount: 3000, type: RECORD_TYPES.EXPENSE, category: 'groceries', date: '2024-01-10', notes: 'Weekly groceries' },

      // Viewer's records (minimal)
      { user_id: createdUsers[2].id, amount: 35000, type: RECORD_TYPES.INCOME, category: 'salary', date: '2024-01-01', notes: 'Monthly salary' },
      { user_id: createdUsers[2].id, amount: 10000, type: RECORD_TYPES.EXPENSE, category: 'rent', date: '2024-01-05', notes: 'Monthly rent' }
    ];

    console.log('Creating financial records...');
    for (const recordData of records) {
      await FinancialRecord.create(recordData);
    }
    console.log(`✓ Created ${records.length} financial records`);

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📋 Sample Users Created:');
    console.log('Admin: admin@example.com / password123');
    console.log('Analyst: analyst@example.com / password123');
    console.log('Viewer: viewer@example.com / password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('🎉 Seeding process completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedDatabase;