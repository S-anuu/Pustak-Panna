const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware'); // Destructure authMiddleware correctly
const cartController = require('../controllers/cartController');
//const authenticate = require('../middleware/authenticate');
const cartMiddleware = require("../middleware/cartMiddleware");
const couponController = require('../controllers/couponController')
const orderController = require('../controllers/orderController')

// Add item to cart
router.post('/cart', authMiddleware, cartController.postCart); // Ensure method names match

// Get cart items for a user
router.get('/cart', authMiddleware, cartMiddleware,cartController.getCart);

router.delete('/cart/delete/:id',authMiddleware, cartController.deleteCartItem);

router.post('/checkout/apply-coupon',authMiddleware, couponController.applyCoupon);

router.get('/checkout/:id',authMiddleware, cartController.getCheckoutForBook);

router.post('/checkout',authMiddleware, cartController.postCheckout)

router.post('/placeOrder', authMiddleware, orderController.placeOrder)

router.get('/orderpay/success', authMiddleware, orderController.paySuccess)

router.get('/orderpay/faliure', authMiddleware, orderController.payFail)

module.exports = router;
