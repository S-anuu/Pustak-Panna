const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController')

// Public routes
router.get('/', indexController.index);

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
