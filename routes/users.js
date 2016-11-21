var express = require('express');
var router  = express.Router();
var message = require('../models/user');

router.get('/', function (req, res, next) {
    res.render('index');
});

module.exports = router;