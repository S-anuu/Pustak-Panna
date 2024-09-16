const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import the User model
const authenticateToken = require('../middleware/auth'); // Ensure the path is correct
const Suggestion = require('../models/Suggestion')

// Route to get user profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        // Find user by ID extracted from token
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
