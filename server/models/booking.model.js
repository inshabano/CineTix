const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    show:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'shows_user',
        required: true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    seats:{
        type:Array,
        required:true
    },

});

const bookingModel = mongoose.model('booking_user', bookingSchema);
module.exports = bookingModel;