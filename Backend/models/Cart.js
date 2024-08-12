const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the CartItem schema
const CartItemSchema = new Schema({
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true }, // Reference to the book model
    quantity: { type: Number, required: true, min: 1 } // Quantity of the book
});

const CartSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [CartItemSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now } // Track last update
});

// Create and export the Cart model
const Cart = mongoose.model('Cart', CartSchema);
module.exports = Cart;
