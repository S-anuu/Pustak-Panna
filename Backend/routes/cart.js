const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware'); // Destructure authMiddleware correctly
const cartController = require('../controllers/cartController');
//const authenticate = require('../middleware/authenticate');
const cartMiddleware = require("../middleware/cartMiddleware");

// Add item to cart
router.post('/cart', authMiddleware, cartController.postCart); // Ensure method names match

// Get cart items for a user
router.get('/cart', authMiddleware, cartMiddleware,cartController.getCart);

module.exports = router;
