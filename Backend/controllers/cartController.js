const CartItem = require("../models/CartItem")
//const mongoose = require('mongoose');
const Book = require('../models/Book')
const Cart = require('../models/Cart')

exports.addToCart = async (req, res) => {
    const { userId, bookId, quantity } = req.body
    const cartItem = new CartItem({
        userId, bookId, quantity
    })
    await cartItem.save()
    res.json(cartItem)

}

exports.getCartItems = async (req, res) => {
    const cartItems = await CartItem.find({userId: req.params.userId}).populate('bookId')
    res.json(cartItems)
}

exports.postCart = async (req, res) => {
    try {
        const { bookId } = req.body;
        const userId = req.user._id;

        console.log('Adding book to cart:', { userId, bookId });

        // Find the book by ID
        const book = await Book.findById(bookId);
        if (!book) {
            console.error('Book not found:', bookId);
            return res.status(404).json({ message: 'Book not found' });
        }

        // Find or create the cart for the user
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        // Check if the book is already in the cart
        let cartItem = await CartItem.findOne({ userId, bookId });
        if (cartItem) {
            cartItem.quantity += 1;
            await cartItem.save();
        } else {
            cartItem = new CartItem({ userId, bookId, quantity: 1 });
            await cartItem.save();
        }

        // Add or update the cart item reference
        if (!cart.items.includes(cartItem._id)) {
            cart.items.push(cartItem._id);
        }

        await cart.save();
        console.log('Book added to cart successfully');
        res.status(200).json({ message: 'Book added to cart' });
    } catch (error) {
        console.error('Error in postCart:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getCart = async (req, res) => {
    const userId = req.userId; // Ensure this is correctly set by your middleware
    console.log('User ID:', userId); // Check if userId is correct

    try {
        // Fetch cart items for the user and populate the book details
        const cartItems = await CartItem.find({ userId }).populate('bookId');

        //console.log('Cart Items:', cartItems); // Check if cartItems is being populated correctly

        // Render the cart.ejs template and pass the cart items to it
        res.render('cart', { 
            cartItems,
            title: 'Pustak-Panna',
            pageStyles: '', 
            headerStyle: 'header',
        });
    } catch (err) {
        console.error('Error fetching cart:', err); // Log the error
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}
