const mongoose = require('mongoose');
const Admin = require('./models/Admin');

const dbURI = 'mongodb+srv://anuusapkota10:ow7d3ZyV6CpN0SHe@cluster0.3m1dv67.mongodb.net/PustakPanna?retryWrites=true&w=majority&appName=Cluster0'
mongoose.connect(dbURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

const createAdmin = async () => {
    try {
        const username = 'admin'; 
        const password = '123456789'; 

        // Check if the admin already exists
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            console.log('Admin already exists');
            return;
        }

        // Create new admin
        const admin = new Admin({ username, password });
        await admin.save();
        console.log('Admin created successfully');
    } catch (err) {
        console.error('Error creating admin:', err);
    } finally {
        mongoose.disconnect();
    }
};

createAdmin();
