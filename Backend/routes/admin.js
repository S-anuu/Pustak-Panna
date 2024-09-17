const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin'); 
const Book = require('../models/Book'); 
const User = require('../models/User')
const Order = require('../models/Order')
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;
const {isAdmin} = require('../middleware/authMiddleware');
const multer = require('multer')
const path = require('path');
const bookController = require('../controllers/bookController');
const couponController = require('../controllers/couponController')
const adminController = require('../controllers/adminController')
const Suggestion = require('../models/Suggestion')

router.get('/api/dashboard-stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalBooks = await Book.countDocuments();
        const totalOrders = await Order.countDocuments();

        const recentActivity = await Order.find().sort({ createdAt: -1 }).limit(5).select('createdAt description');
        
        res.json({
            totalUsers,
            totalBooks,
            totalOrders,
            recentActivity
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching dashboard data');
    }
});

//multer setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Admin login route
router.post('/admin-login', async (req, res) => {
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
});


// Refresh token route
router.post('/refresh-token', (req, res) => {
    const token = req.cookies.token; // Get token from cookies

    if (!token) return res.status(403).json({ message: 'No token provided' });

    try {
        const decoded = jwt.verify(token, secretKey);
        const newToken = jwt.sign({ id: decoded.id, username: decoded.username, isAdmin: true }, secretKey, { expiresIn: '7d' });

        res.cookie('token', newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({ token: newToken });
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        res.status(500).json({ message: 'Failed to authenticate token' });
    }
});

// Admin dashboard route (protected)
router.get('/admin-dashboard', isAdmin, async (req, res) => {
    try {
        const suggestions = await Suggestion.find();
        res.render('admin-dashboard', {
            title: 'Admin Dashboard',
            pageStyles: 'admin-dashboard.css',
            headerStyle: 'admin-header',
            currentPath: '/admin-dashboard',
            suggestions // Pass the suggestions to the view if needed
        });
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/books', bookController.getAllBooks);

//Fetch a single book
router.get('/books/:id', async (req, res) => {
    const book = await Book.findById(req.params.id)
    res.json(book)
})

router.get('/books/edit/:_id', bookController.getEditPage)


router.get('/books/delete/:_id', bookController.deleteBook)


router.get('/users', (req, res) => {
    res.render('users', { title: 'Pustak-Panna', pageStyles: '', headerStyle: 'admin-header', currentPath: '/users' });
});

// Check if a book with the same title and author exists
router.post('/admin/check-book', bookController.checkBook);

router.get('/orders', adminController.getOrdersAdmin);

router.get('/orders/:id', adminController.getOrderDetails);

// router.get('/admin/reports', (req, res) => {
//     res.render('reports', { title: 'Pustak-Panna', pageStyles: '', headerStyle: 'admin-header' });
// });

// Add book
router.post('/books/add', upload.single('imageURL'), bookController.addBook);

router.get('/books/add', bookController.getAddBookPage);

// Edit book
router.post('/books/edit/:_id', upload.single('imageURL'), bookController.editBook);

// Display coupons management page
router.get('/coupons', couponController.getCoupons);

// Add new coupon
router.post('/coupons/add', couponController.addCoupon);

// Delete coupon
router.delete('/coupons/delete/:id', couponController.deleteCoupon);

router.post('/orders/:orderId/deliver', adminController.postDeliver);

router.get('/suggestions', async (req, res) => {
    
});

module.exports = router;


