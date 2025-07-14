const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
    movie:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'movie_user',
        required:true
    },
    theatre:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'theatre_user',
        required:true
    },
    showDate:{
        type: Date,
        required:true,
    },
    showTime:{
        type: String,
        required:true,
    },
    totalSeats:{
        type:Number,
        required:true
    }
});

const showModel = mongoose.model('shows_user', showSchema);
module.exports = showModel;