require('dotenv').config()
const express = require('express')
const expressLayout = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const bcryptjs = require('bcryptjs')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const methodOverride = require('method-override')
const multer = require('multer')
const path = require('path')
const authRoutes = require('./routes/auth')
const isAdmin = require('./middleware/auth')


const app = express()
const port = process.env.PORT || 5000;


//Middleware
	@@ -29,6 +30,12 @@ app.use(cors())
app.use(cookieParser())
app.use(express.json())

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//set view Engine
app.set('view engine', 'ejs')

	@@ -43,13 +50,16 @@ app.use('/', indexRouter)
app.use('/', authRoutes)
//app.use('/books', booksRouter)
app.use('/cart', cartRouter)
app.use('/', adminRouter)

//Port
app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}/`)
})


const secretKey = process.env.SECRET_KEY || 'default_secret_key'; // Fallback for development

//connect to MongoDB
mongoose.connect('mongodb+srv://anuusapkota10:ow7d3ZyV6CpN0SHe@cluster0.3m1dv67.mongodb.net/PustakPanna?retryWrites=true&w=majority&appName=Cluster0').then(() => console.log('MongoDB connected')).catch(err => console.log('MongoDB connection error:', err));

	@@ -69,5 +79,5 @@ const storage = multer.diskStorage({
    }
  });

  app.use('/images', express.static(path.join(__dirname, 'public/images')));