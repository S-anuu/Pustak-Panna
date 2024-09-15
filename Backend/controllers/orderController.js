const Order = require('../models/Order'); // Update with your actual path
const CartItem = require('../models/CartItem'); // Update with your actual path

// In your controller file
exports.placeOrder = async (req, res) => {
    try {
        const { firstname, email, middlename, phone, lastName, state, address1, paymentMethod } = req.body;
        const cartItems = await CartItem.find({ userId: req.user._id }).populate('bookId');
        console.log(cartItems)

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
            address1,
            paymentMethod,
            orderDate: new Date(),
            total,
            status: 'Pending',
            items: cartItems.map(item => ({
                book: item.bookId._id,
                quantity: item.quantity,
                price: item.bookId.price
            }))
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
        const orders = await Order.find({ userId: req.user._id }).populate('items.book');
        console.log(orders)
        res.render('myOrders', {
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

exports.getOrdersAdmin = async (req, res) => {
    try {
        const orders = await Order.find().populate('user');
        res.render('orders', { 
            orders,
            title: 'PustakPanna',
            pageStyles: '',
            headerStyle: 'admin-header' });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Internal Server Error');
    }
}

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user');
        if (order) {
            res.json(order);
        } else {
            res.status(404).send('Order not found');
        }
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).send('Internal Server Error');
    }
}

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (order) {
            res.status(200).send('Order status updated successfully');
        } else {
            res.status(404).send('Order not found');
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).send('Internal Server Error');
    }
}