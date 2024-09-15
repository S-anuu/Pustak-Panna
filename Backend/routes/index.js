const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController')
const cartMiddleware = require("../middleware/cartMiddleware");
const cartController = require('../controllers/cartController')
const bookController = require('../controllers/bookController')
const orderController = require('../controllers/orderController')

// Public routes
router.get('/', cartMiddleware, indexController.index);

// router.get('/new-releases', indexController.newReleases);

// router.get('/best-sellers', indexController.bestSellers);

router.get('/checkout', cartController.getCheckout);

router.get('/contact', (req, res) => {
    res.render('contact', { title: 'Pustak-Panna', pageStyles: '', headerStyle: 'header' });
});

router.get('/about', (req, res) => {
    res.render('about', { title: 'Pustak-Panna', pageStyles: 'about', headerStyle: 'header' });
});

router.get('/admin-login', (req, res) => {
    res.render('admin-login', { title: 'Pustak-Panna', pageStyles: 'admin-login.css', headerStyle: 'header' });
});

router.get('/login', (req, res) => {
    res.render('login', { title: 'Pustak-Panna', pageStyles: 'Login.css', headerStyle: 'header' });
});

router.get('/forgot-password', (req, res) => {
    res.render('forgot-password', { title: 'Pustak-Panna', pageStyles: 'forgot-password.css', headerStyle: 'header' });
});

router.get('/new-releases', bookController.getNewReleases);

router.get('/best-sellers', bookController.getBestSellers)

router.get('/genre/:genre', indexController.getGenre);

router.get('/orders', orderController.getOrders);
router.get('/orders/:id', orderController.getIndividualOrder);

router.get('/orderDetails', orderController.getOrderDetails)

router.get('/search', bookController.searchBooks)

// router.get('/404', (req, res) => {
//     res.render('404', { title: 'Pustak-Panna', pageStyles: 'errors.css', headerStyle: 'header' });
// });

// router.get('/500', (req, res) => {
//     res.render('500', { title: 'Pustak-Panna', pageStyles: 'errors.css', headerStyle: 'header' });
// });

module.exports = router;
