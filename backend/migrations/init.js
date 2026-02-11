const { sequelize } = require('../config/database');
const { User, Product, Order, OrderItem } = require('../models');

const initDatabase = async () => {
  try {
    console.log('Starting database initialization...\n');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✓ Database connection established');
    
    // Sync all models (creates tables with foreign keys and constraints)
    // force: true will drop existing tables and recreate them
    // alter: true will update tables to match models without dropping data
    await sequelize.sync({ force: false, alter: true });
    console.log('✓ Database tables synchronized');
    
    console.log('\n✅ Database initialization completed successfully!');
    console.log('\nTables created:');
    console.log('  - users (with UNIQUE constraint on email)');
    console.log('  - products (with CHECK constraints on price and stock)');
    console.log('  - orders (with foreign key to users)');
    console.log('  - order_items (with foreign keys to orders and products)');
    console.log('\nForeign key relationships:');
    console.log('  - orders.userId → users.id (CASCADE on delete)');
    console.log('  - order_items.orderId → orders.id (CASCADE on delete)');
    console.log('  - order_items.productId → products.id (RESTRICT on delete)');
    
    process.exit(0);
  } catch (error) {
    console.error('✗ Database initialization failed:', error);
    process.exit(1);
  }
};

initDatabase();
