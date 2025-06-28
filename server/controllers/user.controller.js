const { userModel } = require("../models/user.model");
var jwt = require('jsonwebtoken');

const onRegister = async (req, res)=>{
    console.log("📥 Incoming request body:", req.body);
    const {username, email, password} = req.body;
    if(!username || !email || !password){
        return res.status(400).send({success:false, message:"Missing some feilds"});
    }
    try{
        const existingUser = await userModel.findOne({email:email});
        if(existingUser){
            return res.status(400).send({success:false, message: "User with this email already exists!"});
        }
        const newUser = new userModel(req.body);
        await newUser.save();
        return res.status(201).send({success:true, message:"Registration completed! Please login"})

    } catch(err){
        return res.status(500).send({message:'Something went wrong! Please try again.'})
    }
}

const onLogin = async(req,res)=>{
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).send({success:false, message:"Please enter both email and password."})
    }
    try{
        const existingUser = await userModel.findOne({email:email});
        if(!existingUser){
            return res.status(400).send({success:false, message:"User with this email does not exists!"})
        }
        if(password !== existingUser.password){
            return res.status(400).send({success:false, message:"Oops! Please enter correct password"})
        }
        const token = jwt.sign({ userId: existingUser._id }, process.env.SECRET_KEY);
        return res.status(201).send({
            success:true, 
            message:"Successfully Logged in",
            accessToken:token,
            username: existingUser.username,
        })

    }catch(err){
         return res.status(500).send({message:'Something went wrong! Please try again.'})
    }

}

const getAllUsers = async(req,res)=>{

    try{
        const allUsers = await userModel.find();
       
        return res.status(201).send({
            success:true, 
            data: allUsers})

    }catch(err){
         return res.status(500).send({message:'Something went wrong! Please try again.'})
    }

}
const getCurrentUser = async(req, res)=>{
    // console.log(req.headers);
    const token = req.headers['access-token'];
    if(!token){
        return res.status(400).send({message:"JWT token is not passed"})
    }
    jwt.verify(token,process.env.SECRET_KEY,async (err,payload)=>{
        if(err){
            return res.status(403).send({message:"You are not allowed to access! Invalid Token"});
        }
        // console.log(payload);
        const userId = payload.userId;
        const currUser = await userModel.findById(userId);
        // console.log(currUser);
        const {_id, username, email, userType} = currUser;

        return res.send({_id, username, email, userType});

    })


}

module.exports = {
    onRegister, 
    onLogin, 
    getAllUsers,
    getCurrentUser,
};

