const express = require('express')
const router = express.Router()

router.get('', (req, res) => {
    res.render('index', {title: 'PustakPanna'});
})

router.get('/cart', (req, res) => {
    res.render('cart', {title: 'PustakPanna'})
})

module.exports = router