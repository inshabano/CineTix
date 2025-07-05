const theatreModel = require("../models/theatre.model");


const createTheatre = async (req, res) => {
    const theatreDetails = req.body;
    theatreDetails.owner = req.userDetails._id;

    try{
        const newTheatre = new theatreModel(theatreDetails);
        const response = await newTheatre.save();
        return res.status(201).send({
            success:true, 
            message: "New theatre has been added successfully.",
            data:response
        })
    }catch(err){
        console.log(err)
        return res.status(500).send({message:"Something went wrong. Please try again."})
    }
};

const getAllTheatres = async (req, res) => {
    try{
        const allTheatres = await theatreModel.find({});
        return res.status(200).send({
            success: true,
            message: "All theatres has been fetched",
            data: allTheatres,
        })
    }catch(err){
        return res.status(500).send({message:"Something went wrong. Please try again."})
    }
};

module.exports = {
    createTheatre,
    getAllTheatres,
}
