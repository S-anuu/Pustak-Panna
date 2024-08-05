const jwt = require('jsonwebtoken')
const secretKey = 'your_jwt_secret'

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authentication']
    const token = authHeader && authHeader.split('')[1]

    if (token == null) return res.status(401).json({message: 'Unauthorized'})

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.status(403).json({message: 'Forbidden'})

        req.user = user
        next()
    })

}

module.exports = authenticateToken