const express = require('express')
const router = express.Router()

router.get('', (req, res) => {
    res.render('index', {title: 'PustakPanna'});
})

router.get('/cart', (req, res) => {
    res.render('cart', {title: 'PustakPanna'})
})

router.get('/checkout', (req, res) => {
    res.render('checkout', {title: 'PustakPanna'})
})

router.get('/contact', (req, res) => {
    res.render('contact', {title: 'PustakPanna'})
})

router.get('/login', (req, res) => {
    res.render('login', {
        title: 'PustakPanna',
        pageStyles: 'Login.css' // Specify the stylesheet for this page
      });
})


module.exports = router