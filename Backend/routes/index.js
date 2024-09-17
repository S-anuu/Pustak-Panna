const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController')
const cartMiddleware = require("../middleware/cartMiddleware");
const cartController = require('../controllers/cartController')
const bookController = require('../controllers/bookController')
const orderController = require('../controllers/orderController')
const Order = require('../models/Order')
const Review = require('../models/Review')
const {authMiddleware} = require('../middleware/authMiddleware')

// Public routes
router.get('/', cartMiddleware, indexController.index);

// router.get('/new-releases', indexController.newReleases);

// router.get('/best-sellers', indexController.bestSellers);

router.get('/checkout', authMiddleware, cartController.getCheckout);

router.get('/contact', (req, res) => {
    res.render('contact', { title: 'Pustak-Panna', pageStyles: '', headerStyle: 'header', currentPath: '/contact' });
});

router.get('/about', (req, res) => {
    res.render('about', { title: 'Pustak-Panna', pageStyles: 'about', headerStyle: 'header', currentPath: '/about' });
});

router.get('/admin-login', (req, res) => {
    res.render('admin-login', { title: 'Pustak-Panna', pageStyles: 'admin-login.css', headerStyle: 'header', currentPath: null });
});

router.get('/login', (req, res) => {
    res.render('login', { title: 'Pustak-Panna', pageStyles: 'Login.css', headerStyle: 'header', currentPath: null });
});

router.get('/forgot-password', (req, res) => {
    res.render('forgot-password', { title: 'Pustak-Panna', pageStyles: 'forgot-password.css', headerStyle: 'header', currentPath: null });
});

router.get('/product/new-releases', bookController.getNewReleases);

router.get('/product/best-sellers', bookController.getBestSellers)

router.get('/genre/:genre', indexController.getGenre);

router.get('/my-orders', authMiddleware, orderController.getOrders);

router.get('/my-orders/:id', authMiddleware, orderController.getOrderDetails);

router.get('/search', indexController.searchBooks)

router.post('/my-orders/cancel/:id', authMiddleware, orderController.postCancelOrder)

router.post('/my-orders/review/:orderId', authMiddleware, async (req, res) => {
    try {
        const { orderId } = req.params;
        const { rating, comment } = req.body;

        // Find the order and the book in the order
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).send('Order not found');

        // Assuming `bookId` is stored in the order's items
        const bookId = order.items[0].bookId; // Adjust according to your schema

        // Create a new review
        const review = new Review({
            bookId,
            userId: req.user._id,
            rating,
            comment,
            date: new Date()
        });

        await review.save();

        // Redirect or respond
        res.redirect(`/orders/${orderId}`);
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).send('Internal Server Error');
    }
});

// router.get('/404', (req, res) => {
//     res.render('404', { title: 'Pustak-Panna', pageStyles: 'errors.css', headerStyle: 'header' });
// });

// router.get('/500', (req, res) => {
//     res.render('500', { title: 'Pustak-Panna', pageStyles: 'errors.css', headerStyle: 'header' });
// });

module.exports = router;
