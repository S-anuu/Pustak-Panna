const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

function isAdmin(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) return res.status(403).json({ message: 'No token provided' });

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) return res.status(500).json({ message: 'Failed to authenticate token' });
        if (!decoded.isAdmin) return res.status(403).json({ message: 'Not authorized' });
        req.userId = decoded.id;
        next();
    });
}

module.exports = isAdmin;

