const showModel = require("../models/show.model");
const mongoose = require("mongoose");

const validateCreateBokkingRequest = async (req, res, next) => {
  const { show, seats, transactionId } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(show)) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid show ID format." });
    }
    const showDetails = await showModel
      .findById(show)
      .populate("movie")
      .populate("theatre");
    if (!showDetails) {
      return res
        .status(404)
        .send({ success: false, message: "Show not found." });
    }
    for (const seat of seats) {
      if (showDetails.bookedSeats && showDetails.bookedSeats.includes(seat)) {
        return res
          .status(400)
          .send({
            success: false,
            message: `Seat ${seat} is already booked. Please try other seats`,
          });
      }
    }
    req.showDetails = showDetails;

    next();
  } catch (err) {
    console.error("Error in validateCreateBokkingRequest:", err);
    return res
      .status(500)
      .send({
        success: false,
        message: "Something went wrong.Please try again",
      });
  }
};

module.exports = validateCreateBokkingRequest;
