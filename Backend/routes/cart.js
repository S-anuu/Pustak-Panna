const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware'); // Destructure authMiddleware correctly
const cartController = require('../controllers/cartController');

// Add item to cart
router.post('/cart', authMiddleware, cartController.addToCart); // Ensure method names match

// Get cart items for a user
router.get('/cart', authMiddleware, cartController.getCart);

module.exports = router;
