const express = require('express');
const router = express.Router();
const CartItem = require('../models/CartItem');
const authMiddleware = require('../middleware/authMiddleware');

// Add item to cart
router.post('/cart', authMiddleware, async (req, res) => {
    const { bookId, quantity } = req.body; // Exclude userId from the request body
    const userId = req.userId; // Use the userId from the middleware

    try {
        // Check if the item is already in the cart
        let cartItem = await CartItem.findOne({ userId, bookId });

        if (cartItem) {
            // If item exists, update the quantity
            cartItem.quantity += quantity;
        } else {
            // If item does not exist, create a new one
            cartItem = new CartItem({ userId, bookId, quantity });
        }

        await cartItem.save();
        res.json(cartItem);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get cart items for a user
router.get('/cart', authMiddleware, async (req, res) => {
    const userId = req.userId; // Use the userId from the middleware

    try {
        const cartItems = await CartItem.find({ userId }).populate('bookId');
        res.json(cartItems);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
