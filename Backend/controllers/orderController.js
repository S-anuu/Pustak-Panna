const Order = require('../models/Order'); // Update with your actual path
const CartItem = require('../models/CartItem'); // Update with your actual path
const Coupon = require('../models/Coupon');

// In your controller file
exports.placeOrder = async (req, res) => {
    try {
        const { firstname, email, middlename, phone, lastName, state, address1, paymentMethod } = req.body;
        const cartItems = await CartItem.find({ userId: req.user._id }).populate('bookId');

        // Calculate totals
        const shippingCost = 200;
        const subtotal = cartItems.reduce((total, item) => total + (item.bookId.price * item.quantity), 0);
        const coupon = await Coupon.findOne({ userId: req.user._id });
        const discount = coupon ? coupon.discount : 0;
        const discountedSubtotal = subtotal - discount;
        const total = discountedSubtotal + shippingCost;

        // Create new order
        const order = new Order({
            userId: req.user._id,
            firstname,
            email,
            middlename,
            phone,
            lastName,
            state,
            address: address1,
            paymentMethod,
            orderDate: new Date(),
            total,
            status: 'Pending',
            items: cartItems.map(item => ({
                bookId: item.bookId._id,
                quantity: item.quantity,
                price: item.bookId.price
            })),
            shippingCost,
            
        });

        const newOrder = await order.save();
        console.log(newOrder)
        // Optionally clear the cart
        await CartItem.deleteMany({ userId: req.user._id });

        if (paymentMethod !== "cashOnDelivery") {
            let order_price = total;
            let tax_amount = 0;
            let amount = order_price;
            let transaction_uuid = newOrder._id;
            let product_service_charge = 0;
            let product_delivery_charge = 0;
            let secretKey = "8gBm/:&EnhH.1/q"


            return res.send(`
                <html>
                <head>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/crypto-js.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/hmac-sha256.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/enc-base64.min.js"></script>
                </head>
        <body>
            <form action="https://rc-epay.esewa.com.np/api/epay/main/v2/form" method="POST" style="display:none";>
                <input type="text" id="amount" name="amount" value="${amount}" required>
                <input type="text" id="tax_amount" name="tax_amount" value ="${tax_amount}" required>
                <input type="text" id="total_amount" name="total_amount" value="${amount}" required>
                <input type="text" id="transaction_uuid" name="transaction_uuid" value="${transaction_uuid}" required>
                <input type="text" id="product_code" name="product_code" value ="EPAYTEST" required>
                <input type="text" id="product_service_charge" name="product_service_charge" value="${product_service_charge}" required>
                <input type="text" id="product_delivery_charge" name="product_delivery_charge" value="${product_delivery_charge}" required>\
                <input type="text" id="success_url" name="success_url" value="http://localhost:3000/orderpay/success" required>
                <input type="text" id="failure_url" name="failure_url" value="http://localhost:3000/orderpay/failure" required>
                <input type="text" id="signed_field_names" name="signed_field_names" value="total_amount,transaction_uuid,product_code" required>
                <input type="text" id="signature" name="signature" value="" required>
                <input value="Submit" type="submit">
             </form>
        </body>

        <script>
        var hash = CryptoJS.HmacSHA256('total_amount=${amount},transaction_uuid=${transaction_uuid},product_code=EPAYTEST', "${secretKey}");
        var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
        console.log(hashInBase64)
        document.getElementById("signature").value = hashInBase64;

        document.querySelector("form").submit();
        </script>
        </html>
        `)
        }
        else {

            res.redirect('/my-orders'); 
        }


    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.paySuccess = async(req,res) => {
    const token = req.query.data;
    const queryBody = JSON.parse(Buffer.from(token, "base64").toString("ascii"));

    if(queryBody.status !== "COMPLETE")
        return res.status(400).send("Error.");

    return res.redirect("/my-orders");
}


exports.payFail= async(req,res) => {
    console.log(req.query);
    res.json({ message: "Payment failed" });
}

exports.getOrders = async (req, res) => {
    console.log(req.user)
    try {
        const orders = await Order.find({ userId: req.user._id }).populate('items.bookId');
        
        res.render('orders', {
            title: 'Your Orders',
            orders,
            pageStyles: '',
            headerStyle: 'header',
            currentPath: '/my-orders'
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getIndividualOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const orders = await Order.findOne({ _id: orderId });
        res.send(orders);
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Error");
    }
}

exports.getOrderDetails = async (req, res) => {
    try {
        // Populate the 'items.bookId' and 'userId' fields
        const order = await Order.findById(req.params.id)
            .populate('items.bookId')
            .populate('userId'); // This ensures the user's details are included in the order

        if (!order) {
            return res.status(404).send('Order not found');
        }

        res.render('orderDetails', {
            title: 'Order Details',
            order,
            pageStyles: '',
            headerStyle: 'header',
            currentPath: `/my-orders/${req.params.id}`
        });

    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.postCancelOrder = async (req, res) => {
    const orderId = req.params.id;

    try {
        // Find the order and update its status to "Cancelled"
        let order = await Order.findById(orderId);

        if (order.status === 'Pending' || order.status === 'Processing') {
            order.status = 'Cancelled';
            await order.save();
            req.flash('success', 'Order has been cancelled successfully.');
        } else {
            req.flash('error', 'Order cannot be cancelled.');
        }
        res.redirect('/my-orders');
    } catch (error) {
        console.error('Error cancelling the order:', error);
        req.flash('error', 'An error occurred while cancelling the order.');
        res.redirect('/my-orders');
    }
}

