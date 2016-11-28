var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var User     = require('./user');

var schema = new Schema({
    content: {type: String, required: true},
    user:    {type: Schema.Types.ObjectId, ref: 'User'}
});

// Run when a message is removed
// Find user by user reference, remove message from user messages and save user
schema.post('remove', function(message) {
    User.findById(message.user, function(err, user) {
        user.messages.pull(message);
        user.save();
    });
});

module.exports = mongoose.model('Message', schema);