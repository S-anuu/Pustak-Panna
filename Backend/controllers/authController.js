const User = require('../models/User')
const bcryptjs = require('bcryptjs')

exports.register = (req, res) => {
    res.render('register', {
        title: 'Pustak-Panna',
        pageStyles: 'register.css',
        headerStyle: ''
    });
}

exports.getCart = async (req, res) => {
    const userId = req.userId; // Use the userId from the middleware
    //console.log('userid',userId)
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

exports.profile = (req, res) => {
    res.render('profile', {
        title: 'My Account',
        pageStyles: '',
        headerStyle: 'header'
    })
}

exports.getEditProfile = (req, res) => {
    res.render('editProfile', {
        title: 'My Account',
        pageStyles: '',
        headerStyle: 'header'
    })
}
exports.editProfile = async (req, res) => {
    try {
        const { firstname, middlename, lastname, username, email, phone, address } = req.body;
        // let profilePicturePath = '';

        // if (req.file) {
        //     profilePicturePath = "/" + req.file.path;

        //     // Delete old profile picture if it's different from the new one
        //     const user = await User.findById(req.user._id);
        //     if (user.profilePicture && user.profilePicture !== profilePicturePath) {
        //         const oldImagePath = path.join(__dirname, '../uploads', user.profilePicture);
        //         fs.unlink(oldImagePath, (err) => {
        //             if (err) console.error('Failed to delete old profile picture:', err);
        //         });
        //     }
        // } else {
        //     const user = await User.findById(req.user._id);
        //     profilePicturePath = user.profilePicture;
        // }

        await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    firstname,
                    middlename,
                    lastname,
                    username,
                    email,
                    phone,
                    address,
                    // ...(profilePicturePath && { profilePicture: profilePicturePath })
                }
            }
        );

        res.json({ message: 'Profile updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.changePassword = async (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }

    try {
        // Hash the new password
        const hashedPassword = await bcryptjs.hash(password, 12);

        // Update the user's password
        await User.findByIdAndUpdate(
            req.user._id,
            { $set: { password: hashedPassword } }
        );

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('Error updating password:', err);
        res.status(500).json({ message: 'Server error' });
    }
}