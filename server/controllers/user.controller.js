const { userModel } = require("../models/user.model");


const onRegister = async (req, res)=>{
    console.log("📥 Incoming request body:", req.body);
    const {username, email, password} = req.body;
    if(!username || !email || !password){
        return res.status(400).send({success:false, message:"Missing some feilds"});
    }
    try{
        const existingUser = await userModel.findOne({email:email});
        if(existingUser){
            return res.status(400).send({success:false, message: "user with this email already exists!"});
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
        return res.status(201).send({success:true, message:"Successfully Logged in"})

    }catch(err){
         return res.status(500).send({message:'Something went wrong! Please try again.'})
    }

}

module.exports = {onRegister, onLogin};

