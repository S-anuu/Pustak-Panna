const express = require('express')
const router = express.Router()
const Book = require('../models/Book')

//Fetch all books
router.get('/books', async (req, res) =>{
    const books = await Book.find()
    res.json(books)
})

//Fetch a single book
router.get('/books/:id', async (req, res) => {
    const book = await Book.findById(req.params.id)
    res.json(book)
})

module.exports = router