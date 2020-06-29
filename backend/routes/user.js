const express = require('express');
const router = express.Router();
const bouncer = require ("express-bouncer")(9000, 600000, 2); /* Protection against BruteForce attempts that works as follows :
if a user fails to enter a valid username or password twice in a row, he / she will be locked out for between 9000 and 600000 milliseconds*/
const userCtrl = require('../controllers/user'); // We call the user controllers

router.post('/signup', userCtrl.signup); // The /signup route will make use of the signup controller
router.post('/login', bouncer.block, userCtrl.login); // The /login route will make use of our BruteForce blocker && the login controller

module.exports = router; // We then export these routes so that they can be called in our app.js