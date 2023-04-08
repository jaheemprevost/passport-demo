require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy =  require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const MongoDBStore = require('connect-mongodb-session')(session)

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions'
});

// Catch errors
store.on('error', function (error) {
  console.log(error);
});

const User = require('./models/user');
const connectDB = require('./db/connect');
const mongoDb = process.env.MONGO_URI;

const routes = require('./routes/routes');
const app = express();

app.set("views", __dirname + '/views');
app.set("view engine", "ejs");

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true, store: store}));

passport.use(
  new LocalStrategy(async(username, password, done) => {
    try {

      const user = await User.findOne({ username: username });

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      };

      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // passwords match! log user in
          return done(null, user)
        } else {
          // passwords do not match!
          return done(null, false, { message: "Incorrect password" })
        }
      }) 
    } catch(err) {
      return done(err);
    };
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch(err) {
    done(err);
  };
});

app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false}));

app.use('/', routes);

const start = () => {
  try {
    connectDB(mongoDb);
    app.listen(3000, console.log('server listening on port 3000...'));
  } catch(err) {
    console.log(err);
  }
};

start(); 
