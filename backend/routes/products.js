const express = require('express');
const router = express.Router();
const { Product } = require('../models');
const { auth, adminAuth } = require('../middleware/auth');
const { Op } = require('sequelize');

// @route   GET /api/products
// @desc    Get all products with optional search and filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;
    
    let where = {};
    
    // Search functionality (name, description)
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    // Category filter
    if (category && category !== 'All') {
      where.category = category;
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }
    
    // Sorting
    let order = [];
    if (sort === 'price_asc') order.push(['price', 'ASC']);
    else if (sort === 'price_desc') order.push(['price', 'DESC']);
    else if (sort === 'name') order.push(['name', 'ASC']);
    else if (sort === 'rating') order.push(['rating', 'DESC']);
    else order.push(['createdAt', 'DESC']);
    
    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;
    
    const { count, rows: products } = await Product.findAndCountAll({
      where,
      order,
      limit: limitNum,
      offset
    });
    
    res.json({
      success: true,
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count,
        pages: Math.ceil(count / limitNum)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching products' 
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }
    
    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching product' 
    });
  }
});

// @route   POST /api/products
// @desc    Create a new product (Admin only)
// @access  Private/Admin
router.post('/', [auth, adminAuth], async (req, res) => {
  try {
    const { name, description, price, category, image, stock, featured } = req.body;
    
    const product = await Product.create({
      name,
      description,
      price,
      category,
      image,
      stock,
      featured
    });
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while creating product' 
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product (Admin only)
// @access  Private/Admin
router.put('/:id', [auth, adminAuth], async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }
    
    await product.update(req.body);
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while updating product' 
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product (Admin only)
// @access  Private/Admin
router.delete('/:id', [auth, adminAuth], async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }
    
    await product.destroy();
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while deleting product' 
    });
  }
});

// @route   GET /api/products/categories/list
// @desc    Get all product categories
// @access  Public
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Product.findAll({
      attributes: [[Product.sequelize.fn('DISTINCT', Product.sequelize.col('category')), 'category']],
      raw: true
    });
    
    res.json({
      success: true,
      categories: categories.map(c => c.category)
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching categories' 
    });
  }
});

module.exports = router;
