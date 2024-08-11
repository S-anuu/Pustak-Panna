const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/auth'); // Ensure this middleware checks cookies

// Public routes
router.get('', (req, res) => {
    res.render('index', { title: 'Pustak-Panna', pageStyles: '', headerStyle: 'header' });
});

router.get('/cart', (req, res) => {
    res.render('cart', { title: 'Pustak-Panna', pageStyles: '', headerStyle: 'header' });
});

router.get('/checkout', (req, res) => {
    res.render('checkout', { title: 'Pustak-Panna', pageStyles: '', headerStyle: 'header' });
});

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

// Protected routes
router.get('/admin-dashboard', isAdmin, (req, res) => {
    res.render('admin-dashboard', { title: 'Admin Dashboard', pageStyles: 'admin-dashboard.css', headerStyle: 'admin-header' });
});

router.get('/forgot-password', (req, res) => {
    res.render('forgot-password', { title: 'Pustak-Panna', pageStyles: 'forgot-password.css', headerStyle: 'header' });
});

// router.get('/404', (req, res) => {
//     res.render('404', { title: 'Pustak-Panna', pageStyles: 'errors.css', headerStyle: 'header' });
// });

// router.get('/500', (req, res) => {
//     res.render('500', { title: 'Pustak-Panna', pageStyles: 'errors.css', headerStyle: 'header' });
// });

module.exports = router;
