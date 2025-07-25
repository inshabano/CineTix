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
        required:false
    },
    seats:{
        type:Array,
        required:true
    },
    transactionId:{
        type:String,
        required:false,
    },
    totalAmount:{
        type:Number,
        required:true,
    },
    status: {
        type: String,
        enum: ['pending','payment_verified', 'confirmed', 'failed', 'cancelled'],
        default: 'pending', 
        required: true
    },
    razorpayOrderId: {
        type: String,
        required: false, 
    },
    bookedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const bookingModel = mongoose.model('bookings_user', bookingSchema);
module.exports = bookingModel;