var express = require('express');
var router  = express.Router();
var jwt     = require('jsonwebtoken');
var Message = require('../models/message');
var User    = require('../models/user');

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

// Authenticate user before accessing routes below
router.use('/', function(req, res, next) {
  jwt.verify(req.query.token, 'secret', function(err, decoded) {
    if(err) {
      return res.status(401).json({
        title: 'Not authenticated',
        error: err
      });
    }
    // Continue if authenticated
    next();
  });
});

// Store new message
router.post('/', function (req, res, next) {
    // Find user with decoded json web token
    var decoded = jwt.decode(req.query.token);
    User.findById(decoded.user._id, function (err, user) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        // Create message with req info
        var message = new Message({
            content: req.body.content,
            user: user
        });
        message.save(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            // Add created message to user messages array and save updated user
            user.messages.push(result);
            user.save();
            res.status(201).json({
                message: 'Saved message',
                obj: result
            });
        });
    });
});

// Update message
router.patch('/:id', function(req, res, next) {
  Message.findById(req.params.id, function(err, message) {
    if(err) {
      return res.status(500).json({
          title: 'There was an error while attempting to update message.',
          error: err
        });
    }
    if(!message) {
      return res.status(500).json({
          title: 'No message found.',
          error: {message: 'Message not found'}
        });
    }
    message.content = req.body.content;
    message.save(function(err, result) {
      if(err) {
        return res.status(500).json({
          title: 'There was an error while attempting to update message.',
          error: err
        });
      }
      res.status(200).json({
        message: 'Message updated.',
        obj: result
      });
    });
  });
});

// Delete message
router.delete('/:id', function(req, res, next) {
  Message.findById(req.params.id, function(err, message) {
    if(err) {
      return res.status(500).json({
          title: 'There was an error while attempting to delete message.',
          error: err
        });
    }
    if(!message) {
      return res.status(500).json({
          title: 'No message found.',
          error: {message: 'Message not found'}
        });
    }
    message.remove(function(err, result) {
      if(err) {
        return res.status(500).json({
          title: 'There was an error while attempting to delete message.',
          error: err
        });
      }
      res.status(200).json({
        message: 'Message deleted.',
        obj: result
      });
    });
  });
});

module.exports = router;