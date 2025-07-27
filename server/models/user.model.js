const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true 
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    userType: {
        type: String,
        required: true,
        enum: ['admin', 'user', 'partner'],
        default: 'user',
    },
    watchlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'movie_user'
    }],
    
    fullName: {
        type: String,
        default: '', 
        trim: true
    },
    mobileNumber: {
        type: String,
        default: '', 
        trim: true
        
    },
    
}, {
    timestamps: true 
});

const userModel = mongoose.model('user', userSchema);
module.exports = { userModel };