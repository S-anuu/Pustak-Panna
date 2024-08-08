const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin'); 
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;
const isAdmin = require('../middleware/auth')

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

        // Send response with token
        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Error:', err); // Use console.error for errors
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/refresh-token', async (req, res) => {
    const { token } = req.body;

    if (!token) return res.status(403).json({ message: 'No token provided' });

    try {
        const decoded = jwt.verify(token, secretKey);
        const newToken = jwt.sign({ id: decoded.id, username: decoded.username, isAdmin: true }, secretKey, { expiresIn: '7d' });
        res.status(200).json({ token: newToken });
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        res.status(500).json({ message: 'Failed to authenticate token' });
    }
});

// Admin dashboard route (protected)
router.get('/admin-dashboard', isAdmin, (req, res) => {
    res.render('admin-dashboard', {
        title: 'Admin Dashboard',
        pageStyles: 'admin-dashboard.css'
    });
});

module.exports = router;


