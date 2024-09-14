const Cart = require('../models/Cart');

const cartMiddleware = async (req, res, next) => {
    if (req.user) { // Ensure the user is authenticated
        try {
            // Fetch the user's cart
            const cart = await Cart.findOne({ userId: req.user._id }).populate('items');
            
            // Calculate the number of items in the cart
            const cartLength = cart ? cart.items.length : 0;
            res.locals.cartLength = cartLength;
        } catch (err) {
            console.error('Error fetching cart length:', err);
            res.locals.cartLength = 0; // Default to 0 if there's an error
        }
    } else {
        res.locals.cartLength = 0; // Default to 0 if user is not logged in
    }
    next();
};

module.exports = cartMiddleware;