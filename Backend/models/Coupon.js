const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    discount: {
        type: Number, // Discount amount
        required: true
    },
    expiresAt: {
        type: Date,  // Expiration date for the coupon
        required: true
    }
});

module.exports = mongoose.model('Coupon', couponSchema);