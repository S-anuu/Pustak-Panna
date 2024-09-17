const jwt = require('jsonwebtoken');
const User = require('../models/User');
const secretKey = process.env.SECRET_KEY || 'default_secret_key'; // Fallback for development
const Cart = require('../models/Cart');

async function authMiddleware(req, res, next) {
    // Extract token from cookies or authorization header
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        // Redirect to login page if no token is provided
        return res.redirect('/login');
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, secretKey);
        
        // Attach user ID to request object
        req.userId = decoded.id;
        
        // Optionally fetch the user from the database if needed
        req.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            // Redirect to login page if token expired
            return res.redirect('/login');
        }
        // Redirect to login page if token is invalid
        return res.redirect('/login');
    }
}

function isAdmin(req, res, next) {
    // Extract token from cookies
    const token = req.cookies.token;
    if (!token) return res.redirect('/admin-login') //status(403).json({ message: 'No token provided' });

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired' });
            }
            return res.status(500).json({ message: 'Failed to authenticate token' });
        }
        if (!decoded.isAdmin) return res.redirect('/admin-login');
        req.userId = decoded.id; // Attach user ID to the request object
        next();
    });
}

module.exports = { authMiddleware, isAdmin };
