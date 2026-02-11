const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: {
        args: [0],
        msg: 'Total amount cannot be negative'
      }
    }
  },
  shippingAddress: {
    type: DataTypes.JSONB,
    allowNull: false,
    validate: {
      isValidAddress(value) {
        if (!value.street || !value.city || !value.state || !value.zipCode || !value.country) {
          throw new Error('Complete shipping address is required');
        }
      }
    }
  },
  paymentMethod: {
    type: DataTypes.ENUM('Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Cash on Delivery'),
    allowNull: false
  },
  paymentStatus: {
    type: DataTypes.ENUM('Pending', 'Completed', 'Failed'),
    defaultValue: 'Pending',
    allowNull: false
  },
  orderStatus: {
    type: DataTypes.ENUM('Processing', 'Shipped', 'Delivered', 'Cancelled'),
    defaultValue: 'Processing',
    allowNull: false
  },
  transactionId: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'orders',
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['orderStatus'] },
    { fields: ['createdAt'] }
  ]
});

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    },
    onDelete: 'RESTRICT'
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: {
        args: [1],
        msg: 'Quantity must be at least 1'
      }
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'order_items',
  timestamps: true,
  indexes: [
    { fields: ['orderId'] },
    { fields: ['productId'] }
  ]
});

module.exports = { Order, OrderItem };
