const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    userType:{
        type:String,
        required:true,
        enum:['admin','user','partner'],
        default: 'user',
    }
 });

const userModel = mongoose.model('user',userSchema);
module.exports={userModel};