const { userModel } = require("../models/user.model");
var jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

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
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new userModel({
            username: username,
            email: email,
            password: hashedPassword,
            role: 'user'
        });

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
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(400).send({ success: false, message: "Oops! Please enter correct password." });
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
    const token = req.headers['access-token'];
    if(!token){
        return res.status(400).send({message:"JWT token is not passed"})
    }
    jwt.verify(token,process.env.SECRET_KEY,async (err,payload)=>{
        if(err){
            return res.status(403).send({message:"You are not allowed to access! Invalid Token"});
        }
        const userId = payload.userId;
        const currUser = await userModel.findById(userId);
        const {_id, username, email, userType} = currUser;
        return res.send({_id, username, email, userType});
    })


}
const getUserProfile = async (req, res) => {
    try {
        const userId = req.userDetails?._id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated." });
        }
        const user = await userModel.findById(userId).select('username email fullName mobileNumber userType createdAt');

        if (!user) {
            return res.status(404).json({ success: false, message: "User profile not found." });
        }
        return res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ success: false, message: "Server error: Could not fetch user profile." });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const userId = req.userDetails?._id;
        const { fullName, mobileNumber } = req.body; 
        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated." });
        }
        if (mobileNumber && !/^\d{10}$/.test(mobileNumber)) { 
            return res.status(400).json({ success: false, message: "Invalid mobile number format. Must be 10 digits." });
        }
        const updateFields = {};
        if (fullName !== undefined) updateFields.fullName = fullName;
        if (mobileNumber !== undefined) updateFields.mobileNumber = mobileNumber;

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ success: false, message: "No fields provided for update." });
        }
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { $set: updateFields }, 
            { new: true, runValidators: true } 
        ).select('username email fullName mobileNumber userType createdAt'); 

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found for update." });
        }
        return res.status(200).json({ success: true, message: "Profile updated successfully.", data: updatedUser });
    } catch (error) {
        console.error("Error updating user profile:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: "Server error: Could not update user profile." });
    }
};

module.exports = {
    onRegister, 
    onLogin, 
    getAllUsers,
    getCurrentUser,
    getUserProfile,
    updateUserProfile
};

