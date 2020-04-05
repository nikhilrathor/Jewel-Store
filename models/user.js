var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Number,
    }
});

var User = module.exports = mongoose.model('User', UserSchema);