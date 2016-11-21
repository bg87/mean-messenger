var express = require('express');
var router  = express.Router();
var Message = require('../models/message');

// Get messages
router.get('/', function(req, res, nex) {
    Message.find()
           .exec(function(err, messages) {
              if(err) {
                  return res.status(500).json({
                  title: 'There was an error while attempting to get messages.',
                  error: err
                });
              }
              res.status(200).json({
                message: 'success',
                obj: messages
              });
           });
});

// Store new message
router.post('/', function (req, res, next) {
    // Create message
    var message = new Message({
      content: req.body.content
    });
    // Save message and respond
    message.save(function(err, result) {
      if(err) {
        return res.status(500).json({
          title: 'There was an error while attempting to save a message.',
          error: err
        });
      }
      res.status(201).json({
        message: 'Message saved.',
        obj: result
      });
    });
});

module.exports = router;