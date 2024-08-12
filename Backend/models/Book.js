const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    imageURL: { type: String },
    createdAt: { type: Date, default: Date.now } // Use this field to track when a book was added
});

module.exports = mongoose.model('Book', bookSchema);
