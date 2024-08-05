const express = require('express')
const router = express.Router()

router.get('', (req, res) => {
    res.render('index', {title: 'Pustak-Panna', 
        pageStyles: ''
    });
})

router.get('/cart', (req, res) => {
    res.render('cart', {title: 'Pustak-Panna', 
        pageStyles: ''}
    )
})

router.get('/checkout', (req, res) => {
    res.render('checkout', {title: 'Pustak-Panna',
        pageStyles: ''
    })
})

router.get('/contact', (req, res) => {
    res.render('contact', {
        title: 'Pustak-Panna',
        pageStyles: '' // Specify the stylesheet for this page
      });
})

router.get('/about', (req, res) => {
    res.render('about', {
        title: 'Pustak-Panna',
        pageStyles: 'about' // Specify the stylesheet for this page
      });
})

router.get('/login', (req, res) => {
    res.render('login', {
        title: 'Pustak-Panna',
        pageStyles: 'Login.css' // Specify the stylesheet for this page
      });
})


router.get('/forgot-password', (req, res) => {
    res.render('forgot-password', {
        title: 'Pustak-Panna',
        pageStyles: 'forgot-password.css' // Specify the stylesheet for this page
      });
})

router.get('/404', (req, res) => {
    res.render('404', {
        title: 'Pustak-Panna',
        pageStyles: 'errors.css' // Specify the stylesheet for this page
      });
})

router.get('/500', (req, res) => {
    res.render('500', {
        title: 'Pustak-Panna',
        pageStyles: 'errors.css' // Specify the stylesheet for this page
      });
})

router.get('/admin-login', (req, res) => {
    res.render('admin-login', {
        title: 'Pustak-Panna',
        pageStyles: 'login.css' // Specify the stylesheet for this page
      });
})


module.exports = router