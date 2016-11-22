var express = require('express');
var router  = express.Router();
var User    = require('../models/user');
var bcrypt  = require('bcryptjs');

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

module.exports = router;