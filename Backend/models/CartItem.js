const mongoose = require('mongoose')

const cartItemSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Book'
    },
    quantity: Number
})

module.exports = mongoose.model('CartItem', cartItemSchema)