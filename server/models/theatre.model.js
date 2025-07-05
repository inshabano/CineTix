const mongoose = require('mongoose');

const theatreSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    phone:{
        type: Number,
        required: true
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required:true,
    }
})

const theatreModel = mongoose.model('theatre_user',theatreSchema);
module.exports = theatreModel;