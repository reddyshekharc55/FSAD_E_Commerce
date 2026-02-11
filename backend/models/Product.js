const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Product name is required' }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Product description is required' }
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      notNull: { msg: 'Product price is required' },
      min: {
        args: [0],
        msg: 'Price cannot be negative'
      }
    }
  },
  category: {
    type: DataTypes.ENUM('Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports', 'Toys', 'Other'),
    allowNull: false,
    validate: {
      notNull: { msg: 'Product category is required' }
    }
  },
  image: {
    type: DataTypes.STRING(500),
    defaultValue: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop'
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'Stock cannot be negative'
      }
    }
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'Rating cannot be negative'
      },
      max: {
        args: [5],
        msg: 'Rating cannot exceed 5'
      }
    }
  },
  reviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'products',
  timestamps: true,
  indexes: [
    { fields: ['category'] },
    { fields: ['featured'] },
    { fields: ['price'] }
  ]
});

module.exports = Product;
