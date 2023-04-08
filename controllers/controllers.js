const User = require('../models/user');
const passport = require('passport');
const bcrypt = require('bcryptjs'); 

const getHomePage = async (req, res) => {
  let messages = [];

  if (req.session.messages) {
    messages = req.session.messages;
    req.session.messages = [];
  }

  res.render("index", { messages });
};

const getSignUpPage = async (req, res) => {
  res.render('sign-up-form');
};

const signUp = async (req, res, next) => { 
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await User.create({ username: req.body.username, password: hashedPassword });
    res.redirect("/");
  } catch (err) {
    return next(err);
  }
};

const logIn = async (req, res, next) => {
  const handler = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
    failureMessage: true
  });

  handler(req, res, next);
};

const logOut = async (req, res) => {
  req.session.destroy(function (err) {
    res.redirect("/");
  });
};

const getRestrictedPage = async (req, res) => {
  if (!req.session.pageCount) {
    req.session.pageCount = 1;
  } else {
    req.session.pageCount++;
  }
  res.render('restricted', { pageCount: req.session.pageCount });
};

module.exports = {
  getHomePage,
  getSignUpPage,
  signUp,
  logIn,
  logOut,
  getRestrictedPage
};
