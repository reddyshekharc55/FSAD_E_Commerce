const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');

// @route   POST /api/payment/process
// @desc    Process payment (Dummy payment gateway)
// @access  Private
router.post('/process', auth, async (req, res) => {
  try {
    const { amount, paymentMethod, cardDetails } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid payment amount' 
      });
    }
    
    if (!paymentMethod) {
      return res.status(400).json({ 
        success: false, 
        message: 'Payment method is required' 
      });
    }
    
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Dummy payment logic - always succeeds for demo purposes
    // In a real application, this would integrate with a payment gateway API
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    
    res.json({
      success: true,
      message: 'Payment processed successfully',
      transactionId,
      amount,
      paymentMethod,
      status: 'Completed',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Payment processing failed' 
    });
  }
});

// @route   POST /api/payment/verify
// @desc    Verify payment transaction (Dummy)
// @access  Private
router.post('/verify', auth, async (req, res) => {
  try {
    const { transactionId } = req.body;
    
    if (!transactionId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Transaction ID is required' 
      });
    }
    
    // Dummy verification - always returns success
    res.json({
      success: true,
      verified: true,
      transactionId,
      status: 'Completed',
      message: 'Transaction verified successfully'
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Payment verification failed' 
    });
  }
});

// @route   GET /api/payment/methods
// @desc    Get available payment methods
// @access  Public
router.get('/methods', (req, res) => {
  res.json({
    success: true,
    methods: [
      { id: 'credit-card', name: 'Credit Card', enabled: true },
      { id: 'debit-card', name: 'Debit Card', enabled: true },
      { id: 'upi', name: 'UPI', enabled: true },
      { id: 'net-banking', name: 'Net Banking', enabled: true },
      { id: 'cod', name: 'Cash on Delivery', enabled: true }
    ]
  });
});

module.exports = router;
