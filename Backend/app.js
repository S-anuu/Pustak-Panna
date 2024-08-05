require('dotenv').config()

const express = require('express')
const expressLayout = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const methodOverride = require('method-override')
const multer = require('multer')
const path = require('path')
const authRoutes = require('./routes/auth')


const app = express()
const port = process.env.port || 5000


//Middleware
app.use(expressLayout)
app.set('layout', './layouts/main')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())
app.use(cookieParser())
app.use(express.json())

//set view Engine
app.set('view engine', 'ejs')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
//var booksRouter = require('./routes/books')
var cartRouter = require('./routes/cart')
var adminRouter = require('./routes/admin')

//Routes
app.use('/', indexRouter)
app.use('/', authRoutes)
//app.use('/books', booksRouter)
app.use('/cart', cartRouter)
app.use('/admin', adminRouter)

//Port
app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}/`)
})

//connect to MongoDB
mongoose.connect('mongodb+srv://anuusapkota10:ow7d3ZyV6CpN0SHe@cluster0.3m1dv67.mongodb.net/PustakPanna?retryWrites=true&w=majority&appName=Cluster0').then(() => console.log('MongoDB connected')).catch(err => console.log('MongoDB connection error:', err));

//public
app.use(express.static('public'))

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images/');  // Folder where images will be saved
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // File name with timestamp
    }
  });

  app.use('/public/images', express.static(path.join(__dirname, 'images')));

