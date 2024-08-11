const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcryptjs = require('bcryptjs');

// Define the admin schema
const adminSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Middleware to hash the password before saving
adminSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified
    if (!this.isModified('password')) return next();

    try {
        // Generate a salt and hash the password
        const salt = await bcryptjs.genSalt(10);
        this.password = await bcryptjs.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Method to compare candidate password with hashed password
adminSchema.methods.comparePassword = function(candidatePassword) {
    return bcryptjs.compare(candidatePassword, this.password);
};

// Export the Admin model
module.exports = mongoose.model('Admin', adminSchema);
