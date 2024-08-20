const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY || 'default_secret_key'; // Fallback for development

function authMiddleware(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(403).json({ message: 'No token provided' });

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired' });
            }
            return res.status(500).json({ message: 'Failed to authenticate token' });
        }
        req.userId = decoded.id; // Attach user ID to the request object
        next();
    });
}

function isAdmin(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(403).json({ message: 'No token provided' });

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired' });
            }
            return res.status(500).json({ message: 'Failed to authenticate token' });
        }
        if (!decoded.isAdmin) return res.status(403).json({ message: 'Not authorized' });
        req.userId = decoded.id; // Attach user ID to the request object
        next();
    });
}

module.exports = { authMiddleware, isAdmin };
