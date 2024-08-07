const express = require('express')
const router = express.Router()
const authenticateToken = require('../middleware/auth')

router.get('/profile', authenticateToken, async(req, res) => {
    try{
        const user = await User.findById(req.user.id)
        if (!user) return res.status(404).json({message: 'User not found'})
        res.status(200).json(user)
        }catch(err){
            console.error('Error: ', err)
            res.status(500).json({message: 'Server error'})
        }
})

module.exports = router