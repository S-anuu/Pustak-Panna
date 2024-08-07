const CartItem = require("../models/CartItem")

exports.addToCart = async (req, res) => {
    const { userId, bookId, quantity } = req.body
    const cartItem = new CartItem({
        userId, bookId, quantity
    })
    await cartItem.save()
    res.json(cartItem)

}

exports.getCartItems = async (req, res) => {
    const cartItems = await CartItem.find({userId: req.params.userId}).populate('bookId')
    res.json(cartItems)
}