const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config();
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
require('./config/passport')(passport)


var app = express();


mongoose.connect(process.env.MONGO_URI,{
  //useNewUrlParser:true,
  //useUnifiedTopology:true
})

  //passport config

  //Middleware
  app.use(express.urlencoded({extended:true}))
  app.use(express.static('public'))

  app.set('view engine','ejs');

  app.use(
    session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized:false,
    //store: new MongoStore({mongooseConnection: mongoose.connection}),
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
  })
  )

  //Passport middleware
  app.use(passport.initialize)
  app.use(passport.session())


//routes
app.get('/app', (req,res)=>{
  res.send('<h1>Store API</h1>')
})

  app.use(require('./routes/index'))
  app.use('/auth', require('./routes/auth'))

  const PORT = process.env.PORT
  app.listen(PORT, console.log(`listening at ${PORT}`))

  

//   const express = require('express');
// const mongoose=require('mongoose');
// const dotenv = require('dotenv').config();
// const passport = require('passport');
// const session = require('express-session');
// const MongoStore = require('connect-mongo');
// require('./config/passport')(passport);

// // Mongo & Template Setup
// var app = express();
// const PORT = process.env.PORT || 2500;

// app.use(express.static('public'));
// app.set('view engine','ejs');

// // Middleware & DB for Sessions Setup
// app.use(express.urlencoded({extended:true}))
// app.use(
//     session({
//       secret: 'keyboard cat',
//       resave: false,
//       saveUninitialized: false,
//       store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
//     })
//   )
//   // Passport middleware
// app.use(passport.initialize())
// app.use(passport.session())

// // Use Routes
// app.use(require("./routes/index"))
// app.use(require('./routes/auth'))

// app.listen(PORT,console.log(`listening at ${PORT}`))