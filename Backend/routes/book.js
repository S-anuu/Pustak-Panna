const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController')


router.get('/book/id/:id', bookController.getBookDetails);

router.get('/book/:slug', bookController.getBookDetails);


module.exports = router