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

const app = express()
const port = process.env.port || 5000

//Middleware
app.use(expressLayout)
app.set('layout', './layouts/main')
app.set('view engine', 'ejs')

app.use(bodyParser.json())
app.use(cors())
app.use(cookieParser())

//Routes
app.use('/', require('./server/routes/main'))

//Port
app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}/`)
})

//connect to MongoDB
mongoose.connect('mongodb+srv://anuusapkota10:ow7d3ZyV6CpN0SHe@cluster0.3m1dv67.mongodb.net/PustakPanna?retryWrites=true&w=majority&appName=Cluster0')

const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error: '))

//public
app.use(express.static('public'))


