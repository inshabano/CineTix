const mongoose = require('mongoose')

const connectDB = ()=> {
    mongoose.connect('mongodb+srv://inshabano88158:inshabano@cluster0.w3ijr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(()=>{
        console.log("Connected to DB successfully")
    })
    .catch((err)=>{
        console.log(err);
    })
}

module.exports = connectDB;
