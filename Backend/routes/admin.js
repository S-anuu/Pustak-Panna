const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key'; // Replace with your actual secret key


// Admin login route
router.post('/admin-login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(400).json({ message: 'Invalid Username' });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Password' });
        }

        const token = jwt.sign({ id: admin._id, username: admin.username, isAdmin: true }, secretKey, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.log('Error:', err); // Log the detailed error
        res.status(500).json({ message: 'Server error' });
    }
});

// Middleware to check if user is admin
function isAdmin(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'No token provided' });

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) return res.status(500).json({ message: 'Failed to authenticate token' });
        if (!decoded.isAdmin) return res.status(403).json({ message: 'Not authorized' });
        req.userId = decoded.id;
        next();
    });
}

// Admin dashboard route (protected)
router.get('/admin-dashboard', isAdmin, (req, res) => {
    res.render('admin-dashboard', {
        title: 'Admin Dashboard',
        pageStyles: 'admin-dashboard.css'
    });
});


module.exports = router;
