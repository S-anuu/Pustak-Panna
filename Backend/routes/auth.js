const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY; 

router.get('/register', (req, res) => {
    res.render('register', {
        title: 'Pustak-Panna',
        pageStyles: 'register.css'
    });
});

// Handle user registration
router.post('/register', async (req, res) => {
    const { firstname, middlename, lastname, username, email, phone, password, address } = req.body;
    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        // Check if username already exists
        if (await User.findOne({ username })) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Create new user
        const newUser = new User({ firstname, middlename, lastname, email, username, password, address, phone });
        await newUser.save();

        

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});


// Handle user login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Username' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Password' });
        }

        // Generate a token
        const token = jwt.sign({ id: user._id, username: user.username }, secretKey, { expiresIn: '1h' });

        // Send response with token
        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Error', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Handle user logout
router.get('/logout', (req, res) => {
    res.clearCookie('token'); // Clear the token cookie if you use cookies for token storage
    res.redirect('/'); // Redirect to home or login page
});

module.exports = router;
