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
            shippingCost
        });

        await order.save();

        // Optionally clear the cart
        await CartItem.deleteMany({ userId: req.user._id });
        res.redirect('/orders'); // Redirect to a success page or home
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).send('Internal Server Error');
    }
};


exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id }).populate('items.bookId');
        res.render('orders', {
            title: 'Your Orders',
            orders,
            pageStyles: '',
            headerStyle: 'header'
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
    catch(error){
        console.log(error);
        res.status(500).send("Error");
    }
}

exports.getOrderDetails = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId).populate('items.book');
        if (!order) {
            return res.status(404).send('Order not found');
        }
        res.render('orderDetails', {
            title: 'Order Details',
            order,
            pageStyles: '',
            headerStyle: 'header'
        });
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).send('Internal Server Error');
    }
};
