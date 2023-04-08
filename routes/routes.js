const express = require('express');
const router = express.Router();
const currentUserMiddleware = require('../middleware/currentUser');
const authMiddleware = require('../middleware/auth');

const {
  getHomePage,
  getSignUpPage,
  signUp,
  logIn,
  logOut,
  getRestrictedPage
} = require('../controllers/controllers');


router.route('').get(currentUserMiddleware, getHomePage);
router.route('/sign-up').get(getSignUpPage);
router.route('/sign-up').post(signUp);
router.route('/log-in').post(logIn);
router.route('/log-out').get(logOut);
router.route('/restricted').get(authMiddleware, getRestrictedPage);

module.exports = router;
