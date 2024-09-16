// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            
        }
    ],
    total: { type: Number, required: true },
    shippingCost: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    paymentMethod: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    address: { type: String, required: true },

    
    phone: { type: String, required: true },
    email: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
