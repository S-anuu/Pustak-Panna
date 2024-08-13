const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController')

router.get('/book/:slug', bookController.getBookDetails);

module.exports = router