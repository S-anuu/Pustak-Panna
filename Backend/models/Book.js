const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    price: Number,
    image: String,
    genre: String,
    description: String
})

module.exports = mongoose.model('Book', bookSchema)