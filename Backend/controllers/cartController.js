const CartItem = require("../models/CartItem")
//const mongoose = require('mongoose');
const Book = require('../models/Book')
const Cart = require('../models/Cart')
const Coupon = require('../models/Coupon')
const Order = require('../models/Order')

exports.addToCart = async (req, res, next) => {
    try {
        const { userId, bookId, quantity } = req.body;

        // Fetch the book title from the Book model
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).send('Book not found');
        }

        const cartItem = new CartItem({
            userId,
            bookId,
            quantity,
            title: book.bookName // Assuming bookName is the field in the Book model
        });

        await cartItem.save();

        res.status(201).send('Item added to cart');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding item to cart');
    }
};

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
    //console.log('User ID:', userId); // Check if userId is correct

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

exports.deleteCartItem = async (req, res) => {
    try {
        const userId = req.user._id; 
        const itemId = req.params.id; 
        //console.log(userId)

        // Find and delete the CartItem
        const cartItem = await CartItem.findOneAndDelete({ _id: itemId, userId: userId });
        
        if (!cartItem) {
            return res.status(404).json({ success: false, message: 'Cart item not found' });
        }

        // Find the user's cart and remove the reference to the deleted CartItem
        const cart = await Cart.findOne({ userId: userId });
        if (cart) {
            cart.items = cart.items.filter(item => item.toString() !== itemId);
            await cart.save(); // Save updated cart
        }

        return res.json({ success: true, message: 'Item deleted' });
    } catch (error) {
        console.error("Error in deleteCartItem:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getCheckout = async (req, res) => {
    try {
        const cartItems = await CartItem.find({ userId: req.user._id }).populate('bookId');
        const shippingCost = 200;

        // Retrieve coupon code from request body, if available
        const appliedCoupon = req.body.appliedCoupon; // Assumes that appliedCoupon is sent in the request body

        // Fetch the coupon from the database if there's an applied coupon
        let coupon = null;
        if (appliedCoupon) {
            coupon = await Coupon.findOne({ code: appliedCoupon, userId: req.user._id });
        }

        console.log(coupon);

        const subtotal = cartItems.reduce((total, item) => total + (item.bookId.price * item.quantity), 0);
        const discount = coupon ? coupon.discount : 0;
        console.log(discount);

        const discountedSubtotal = subtotal - discount;
        const total = discountedSubtotal + shippingCost;

        res.render('checkout', { 
            title: 'Pustak-Panna', 
            cartItems, 
            shippingCost, 
            subtotal: discountedSubtotal, 
            total, 
            discount, // Pass discount to the view
            hasDiscount: coupon ? true : false, // Pass whether the discount was applied
            appliedCoupon, // Pass applied coupon code to the view
            pageStyles: '',
            headerStyle: 'header'
        });
    } catch (error) {
        console.error('Error fetching checkout data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.postCheckout = async (req, res) => {
    try {
        const { paymentMethod, address1, phone, email } = req.body;
        const userId = req.user._id; // Assuming user is authenticated

        // Fetch cart items
        const cartItems = await CartItem.find({ userId }).populate('bookId');
        const subtotal = cartItems.reduce((total, item) => total + (item.bookId.price * item.quantity), 0);

        // Fetch applied coupon
        let coupon = null;
        if (req.body.appliedCoupon) {
            coupon = await Coupon.findOne({ code: req.body.appliedCoupon, userId });
        }
        const discount = coupon ? coupon.discount : 0;

        const shippingCost = 200;
        const discountedSubtotal = subtotal - discount;
        const total = discountedSubtotal + shippingCost;

        // Create new order
        const order = new Order({
            userId,
            items: cartItems.map(item => ({
                bookId: item.bookId._id,
                quantity: item.quantity,
                price: item.bookId.price
            })),
            total,
            shippingCost,
            discount,
            paymentMethod,
            address: address1,
            phone,
            email
        });

        await order.save();

        // Optionally, clear cart items after order is placed
        await CartItem.deleteMany({ userId });

        // Redirect to a confirmation page or show success message
        res.redirect('/order-success'); // You should define this route to show the success message

    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).send('Internal Server Error');
    }
}
