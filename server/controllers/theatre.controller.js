const theatreModel = require("../models/theatre.model");

const createTheatre = async (req, res) => {
  const theatreDetails = req.body;
  theatreDetails.owner = req.userDetails._id;

  try {
    const newTheatre = new theatreModel(theatreDetails);
    const response = await newTheatre.save();
    return res.status(201).send({
      success: true,
      message: "New theatre has been added successfully.",
      data: response,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ message: "Something went wrong. Please try again." });
  }
};

const getAllTheatres = async (req, res) => {
  try {
    const allTheatres = await theatreModel.find({});
    return res.status(200).send({
      success: true,
      message: "All theatres has been fetched",
      data: allTheatres,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Something went wrong. Please try again." });
  }
};

const getMyTheatres = async (req, res) => {
    try {
        const ownerId = req.userDetails._id;
        const myTheatres = await theatreModel.find({ owner: ownerId });
        return res.status(200).send({
            success: true,
            message: "My theatres fetched successfully.",
            data: myTheatres,
        });
    } catch (err) {
        console.error("Error fetching my theatres:", err);
        return res.status(500).send({ message: "Something went wrong. Please try again." });
    }
};


const updateTheatre = async (req, res) => {
    try {
        const theatreId = req.params.id;
        const updates = req.body; 
        const updatedTheatre = await theatreModel.findByIdAndUpdate(
            theatreId,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updatedTheatre) {
            return res.status(404).send({ success: false, message: "Theatre not found." });
        }

        return res.status(200).send({
            success: true,
            message: "Theatre updated successfully.",
            data: updatedTheatre,
        });
    } catch (err) {
        console.error("Error updating theatre:", err);
        return res.status(500).send({ message: "Something went wrong. Please try again." });
    }
};


module.exports = {
  createTheatre,
  getAllTheatres,
  getMyTheatres,
  updateTheatre
};
