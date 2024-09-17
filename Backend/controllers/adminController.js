const Admin = require('../models/Admin'); 
const Order = require('../models/Order')
const User = require('../models/User')

exports.adminLogin = async (req, res) => {
    const { username, password } = req.body;
    
    try {
        // Find admin by username
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(400).json({ message: 'Invalid Username' });
        }

        // Check password
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: admin._id, username: admin.username, isAdmin: true }, secretKey, { expiresIn: '7d' });

        // Set token in a cookie
        res.cookie('token', token, {
            httpOnly: true, // Prevents JavaScript access to the cookie
            secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        console.error('Error:', err); // Use console.error for errors
        res.status(500).json({ message: 'Server error' });
    }
}

exports.refreshToken = (req, res) => {
    const token = req.cookies.token; // Get token from cookies

    if (!token) return res.status(403).json({ message: 'No token provided' });

    try {
        const decoded = jwt.verify(token, secretKey);
        const newToken = jwt.sign({ id: decoded.id, username: decoded.username, isAdmin: true }, secretKey, { expiresIn: '7d' });

        res.cookie('token', newToken, {
            httpOnly: true,
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({ token: newToken });
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        res.status(500).json({ message: 'Failed to authenticate token' });
    }
}

exports.getDashboard = (req, res) => {
    res.render('admin-dashboard', {
        title: 'Admin Dashboard',
        pageStyles: 'admin-dashboard.css',
        headerStyle: 'admin-header',
        currentPath: '/admin-dashboard'
    });
}

exports.getOrdersAdmin = async (req, res) => {
    try {
        // Populating the userId and the bookId for each item in the order
        const orders = await Order.find()
            .populate('userId', 'firstname middlename lastname email')
            .populate('items.bookId', 'title'); // Populating bookId with title

        res.render('orderAdmin', {
            orders,
            title: 'PustakPanna',
            pageStyles: '',
            headerStyle: 'admin-header',
            currentPath: '/orders'
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getOrderDetails = async (req, res) => {
    try {
        console.log("Order ID:", req.params.id);
        const order = await Order.findById(req.params.id)
            .populate('userId', 'name email')
            .populate('items.bookId', 'title');

        if (!order) {
            return res.status(404).send('Order not found');
        }

        res.render('orderDetailsAdmin', { order,
            title: 'PustakPanna',
            pageStyles: '',
            headerStyle: 'admin-header',
            currentPath: '/orders/:id'
         });
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).send('Internal Server Error');
    }
};


// exports.getOrderById = async (req, res) => {
//     try {
//         const order = await Order.findById(req.params.id).populate('user');
//         if (order) {
//             res.json(order);
//         } else {
//             res.status(404).send('Order not found');
//         }
//     } catch (error) {
//         console.error('Error fetching order:', error);
//         res.status(500).send('Internal Server Error');
//     }
// }

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

exports.postDeliver = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).send('Order not found');
        }

        // Update the status to "Delivered"
        order.status = 'Delivered';
        await order.save();

        // Redirect back to the orders page
        res.redirect('/admin/orders');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}