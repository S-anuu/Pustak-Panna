const mongoose = require('mongoose');
const Admin = require('./models/Admin'); // Adjust the path as necessary
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb+srv://anuusapkota10:ow7d3ZyV6CpN0SHe@cluster0.3m1dv67.mongodb.net/PustakPanna?retryWrites=true&w=majority&appName=Cluster0')

const createAdmin = async () => {
    try {
        const hashedPassword = await bcrypt.hash('yourpassword', 10); // Set the initial admin password

        const newAdmin = new Admin({
            firstname: 'Admin',
            lastname: 'User',
            username: 'admin',
            email: 'admin@example.com',
            password: hashedPassword,
            phone: '1234567890',
        });

        await newAdmin.save();
        console.log('Admin account created successfully');
        mongoose.connection.close();
    } catch (err) {
        console.error('Error creating admin account:', err);
        mongoose.connection.close();
    }
};

createAdmin();
