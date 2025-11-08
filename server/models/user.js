const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    mockUserId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String
    },
    email: {
        type: String
    }
}, {
    timestamps: true 
});

module.exports = mongoose.model('User', UserSchema);