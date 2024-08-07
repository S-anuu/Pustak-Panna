const express = require('express')
const router = express.Router()
const CartItem = require('../models/CartItem')

//Add item to cart
router.post('/cart', async(req, res) => {
    const { userId, bookId, quantity } = req.body
    const cartItem = new CartItem({userId, bookId, quantity})
    await cartItem.save()
    res.json(cartItem)
})

// Get cart items for a user
router.get('/cart/:userId', async (req, res) => {
    const cartItems = await CartItem.find({userIdbooks: req.params.userId}).populate('bookId')
    res.json(cartItems)
})

module.exports = router