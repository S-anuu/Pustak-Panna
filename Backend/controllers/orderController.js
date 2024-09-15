const Order = require('../models/Order'); // Update with your actual path
const CartItem = require('../models/CartItem'); // Update with your actual path
const Coupon = require('../models/Coupon');
const flash = require('connect-flash')

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
                title: item.bookId.title,
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
    console.log(req.user)
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

exports.getOrderDetails = async (req, res, next) => {
    try {
        const orderId = req.params.id;
        console.log(orderId);

        // Fetch order and include both user and book details
        const order = await Order.findById(orderId)
          .populate('userId') // Populating user information
          .populate({
            path: 'items.bookId', // populate the bookId field inside items
            select: 'title' // select only the title field from Book model
          });

        if (!order) {
            return res.status(404).send('Order not found');
        }

        // Render the order-details page with the fetched order and user details
        res.render('orderDetails', {
            order: order,
            user: req.user, // Assuming you're passing user info from a session or authentication middleware
            title: 'PustakPanna',
            pageStyles: '',
            headerStyle: 'header', 
            
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching order details');
    }
};

exports.postCancelOrder = async (req, res) => {
    const orderId = req.params.orderId;

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
        res.redirect('/orders');
    } catch (error) {
        console.error('Error cancelling the order:', error);
        req.flash('error', 'An error occurred while cancelling the order.');
        res.redirect('/orders');
    }
}