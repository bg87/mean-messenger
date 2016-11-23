var express = require('express');
var router  = express.Router();
var User    = require('../models/user');
var bcrypt  = require('bcryptjs');
var jwt     = require('jsonwebtoken');

// Save new user
router.post('/', function (req, res, next) {
    // Create user object from req
    var user = new User({
        firstName: req.body.firstName,
        lastName : req.body.lastName,
        password : bcrypt.hashSync(req.body.password, 10),
        email    : req.body.email
    });
    user.save(function(err, result) {
        if(err) {
            return res.status(500).json({
                title: 'Error saving user',
                error: err
            });
        }
        res.status(201).json({
            message: 'User saved',
            obj: result
        });
    });
});

// User sign in 
router.post('/signin', function(req, res, next) {
    User.findOne({email: req.body.email}, function(err, user) {
        if(err) {
            return res.status(500).json({
                title: 'Error authenticating user',
                error: err
            });
        }
        // If no user is found
        if(!user) {
            return res.status(401).json({
                title: 'Login failed',
                error: {message: 'Invalid login credentials'}
            });
        }
        // Compare passwords
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            // If they do not match
            return res.status(401).json({
                title: 'Login failed',
                error: {message: 'Invalid login credentials'}
            });
        }
        // Create json web token and send to client
        var token = jwt.sign({user: user}, 'secret', {expiresIn: 7200});
        res.status(200).json({
            message: 'User logged in',
            token: token,
            userId: user._id
        });
    });
});

module.exports = router;