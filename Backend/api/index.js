require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
//const bcryptjs = require('bcryptjs');
const cookieParser = require('cookie-parser');
const path = require('path');
const authRoutes = require('../routes/auth');
//const {isAdmin, authMiddleware} = require('../middleware/authMiddleware');
const multer = require('multer');
const flash = require('connect-flash');
const User = require('../models/User')
const jwt = require('jsonwebtoken');
const { authMiddleware } = require('../middleware/authMiddleware');
const cartMiddleware = require('../middleware/cartMiddleware');

const app = express();
const port = process.env.PORT || 3000;

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'default_session_secret',  // Use SESSION_SECRET from .env
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI  // Use MONGO_URI from .env
    }),
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

//Set up flash middleware after session middleware
app.use(flash());

// Middleware
app.use(cartMiddleware)
app.use(expressLayout);
app.set('layout', './layouts/main');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

// Middleware to make flash messages available in views
// app.use((req, res, next) => {
//     res.locals.success = req.flash('success');
//     res.locals.error = req.flash('error');
//     next();
// });

app.use(async (req, res, next) => {
    const token = req.cookies.token;
    //console.log('Token from cookies:', token); // Debugging line

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.user = await User.findById(decoded.id);
            //console.log('User from token:', req.user); // Debugging line
            res.locals.isAuthenticated = true;
            res.locals.user = req.user;
        } catch (err) {
            //console.error('JWT Verification Error:', err); // Debugging line
            res.locals.isAuthenticated = false;
        }
    } else {
        res.locals.isAuthenticated = false;
    }
    next();
});

// Set view engine
app.set('view engine', 'ejs');

// Routes
app.use('/', require('../routes/index'));
app.use('/cart', authMiddleware)
app.use('/', authRoutes);
app.use('/', require('../routes/cart'));
app.use('/', require('../routes/admin'));
app.use('/', require('../routes/book'));
app.use('/', require('../routes/suggestion'))
// app.use('/', require('../routes/users'))

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../uploads'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // File name with timestamp
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'imageURL') { // Ensure this matches the field in your form
            cb(null, true);
        } else {
            cb(new Error('Unexpected field'), false);
        }
    }
});

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 30000
  }).then(() => {
    console.log("Connected to db");
  }).catch(err => {
    console.error("MongoDB connection error:", err);
  });

// Public files
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Port
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
});

module.exports = app