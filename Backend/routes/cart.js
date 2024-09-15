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

router.delete('/cart/delete/:id', cartController.deleteCartItem);

router.post('/cart/apply-coupon', couponController.applyCoupon);

router.post('/checkout', cartController.postCheckout)

router.post('/placeOrder', orderController.placeOrder)

router.get("/pay-with-esewa",(req,res,next)=>{
    let order_price=req.query.price
    let tax_amount=0
    let amount=order_price
    let transaction_uuid=generateRandomString()
    let product_code="EPAYTEST"
    let product_service_charge = 0
    let product_delivery_charge = 0
    let secretKey="8gBm/:&EnhH.1/q"
    let signature=generateSignature(`total_amount=${amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`,secretKey)

 
    res.send(`
    <body>
        <form action="https://rc-epay.esewa.com.np/api/epay/main/v2/form" method="POST">
            <input type="text" id="amount" name="amount" value="${amount}" required>
            <input type="text" id="tax_amount" name="tax_amount" value ="${tax_amount}" required>
            <input type="text" id="total_amount" name="total_amount" value="${amount}" required>
            <input type="text" id="transaction_uuid" name="transaction_uuid" value="${transaction_uuid}" required>
            <input type="text" id="product_code" name="product_code" value ="EPAYTEST" required>
            <input type="text" id="product_service_charge" name="product_service_charge" value="${product_service_charge}" required>
            <input type="text" id="product_delivery_charge" name="product_delivery_charge" value="${product_delivery_charge}" required>\
            <input type="text" id="success_url" name="success_url" value="http://localhost:3000/success" required>
            <input type="text" id="failure_url" name="failure_url" value="http://localhost:3000/failure" required>
            <input type="text" id="signed_field_names" name="signed_field_names" value="total_amount,transaction_uuid,product_code" required>
            <input type="text" id="signature" name="signature" value="${signature}" required>
            <input value="Submit" type="submit">
         </form>
    </body>
    `)
})

router.get("/success",()=>{
//handle success callback

})

router.get("/failure",()=>{
//handle failure callback
})

// Route to cancel an order
router.post("/orders/cancel/:orderId", orderController.postCancelOrder);

module.exports = router;
