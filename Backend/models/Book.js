const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    price: Number,
    imageURL: String,
    genre: String,
    description: String,
    category: String
})

module.exports = mongoose.model('Book', bookSchema)