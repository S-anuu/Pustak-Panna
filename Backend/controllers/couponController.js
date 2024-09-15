const Coupon = require('../models/Coupon'); // Assume you have a Coupon model

// Get all coupons (for display on admin page)
exports.getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find(); // Get all coupons
        res.render('coupons', { coupons,
            title: 'Pustak-Panna',
            pageStyles: '', 
            headerStyle: 'admin-header',
         }); // Render EJS page
    } catch (error) {
        console.error('Error fetching coupons:', error);
        res.status(500).send('Server Error');
    }
};

// Add a new coupon
exports.addCoupon = async (req, res) => {
    const { code, discount, expiresAt, isActive } = req.body;

    try {
        // Validate input
        if (!code || !discount || !expiresAt) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }

        // Create and save the new coupon
        const newCoupon = new Coupon({
            code,
            discount,
            isActive,
            expiresAt: new Date(expiresAt), // Convert to date
        });

        await newCoupon.save();

        return res.status(201).json({ success: true, message: 'Coupon added successfully' });
    } catch (error) {
        console.error('Error adding coupon:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while adding the coupon' });
    }
};

// Delete a coupon
exports.deleteCoupon = async (req, res) => {
    try {
        const couponId = req.params.id;
        await Coupon.findByIdAndDelete(couponId);

        res.json({ success: true, message: 'Coupon deleted successfully' });
    } catch (error) {
        console.error('Error deleting coupon:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.applyCoupon = async (req, res) => {
    const { couponCode } = req.body;
    console.log(couponCode)
    // Basic validation for couponCode
    if (!couponCode || typeof couponCode !== 'string') {
        return res.status(400).json({ success: false, message: 'Invalid coupon code' });
    }

    try {
        // Find the coupon in the database
        const coupon = await Coupon.findOne({
            code: couponCode,
            //isActive: true,
            expiresAt: { $gte: new Date() }
        });

        // If coupon not found or expired
        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Invalid or expired coupon code' });
        }

        // Return the discount value
        return res.status(200).json({ success: true, discount: coupon.discount });
    } catch (error) {
        console.error('Error applying coupon:', error); // Added error logging
        return res.status(500).json({ success: false, message: 'Something went wrong', error: error.message });
    }
}
