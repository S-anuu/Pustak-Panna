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

exports.getCart = async (req, res) => {
    const userId = req.userId; // Use the userId from the middleware
    console.log('userid',userId)
    try {
        // Fetch cart items for the user and populate the book details
        const cartItems = await CartItem.find({ userId }).populate('bookId');
        //console.log(cartItems)
        // Render the cart.ejs template and pass the cart items to it
        res.render('cart', { 
            cartItems,
            title: 'Pustak-Panna',
            pageStyles: '', 
            headerStyle: 'header',
         });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

exports.postCart = async (req, res) => {
    const { bookId, quantity } = req.body; // Exclude userId from the request body
    const userId = req.userId; // Use the userId from the middleware

    try {
        // Check if the item is already in the cart
        let cartItem = await CartItem.findOne({ userId, bookId });

        if (cartItem) {
            // If item exists, update the quantity
            cartItem.quantity += quantity;
        } else {
            // If item does not exist, create a new one
            cartItem = new CartItem({ userId, bookId, quantity });
        }

        await cartItem.save();
        res.json(cartItem);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}