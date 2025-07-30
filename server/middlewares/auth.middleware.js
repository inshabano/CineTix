const showModel = require("../models/show.model");
const theatreModel = require("../models/theatre.model");
const { userModel } = require("../models/user.model");
const jwt = require("jsonwebtoken");

const verifyJWT = async (req, res, next) => {
  const token = req.headers["access-token"];
  if (!token) {
    return res
      .status(400)
      .send({ success: false, message: "Please Login to access this page" });
  }

  jwt.verify(token, process.env.SECRET_KEY, async (err, payload) => {
    if (err) {
      return res
        .status(403)
        .send({
          success: false,
          message: "You are not authenticated to access this page.",
        });
    }

    try {
      const userId = payload.userId;
      const userDetails = await userModel.findById(userId);

      if (!userDetails) {
        return res
          .status(404)
          .send({ success: false, message: "User not found" });
      }

      req.userDetails = userDetails;
      next();
    } catch (error) {
      console.error("Error verifying user:", error);
      return res
        .status(500)
        .send({
          success: false,
          message: "Something went wrong! Please try again.",
        });
    }
  });
};

const verifyAdmin = (req, res, next) => {
  const userType = req.userDetails?.userType;
  if (userType !== "admin") {
    return res
      .status(403)
      .send({
        success: false,
        message: "You are not authorised to access this page.",
      });
  }
  next();
};

const verifyAdminOrPartner = (req, res, next) => {
  const userType = req.userDetails?.userType;
  if (userType !== "partner" && userType !== "admin") {
    return res
      .status(403)
      .send({
        success: false,
        message: "You are not authorised to access this page.",
      });
  }
  next();
};


const verifyTheatreOwnership = async (req, res, next) => {
    const theatreId = req.params.id || req.body.theatre; 
    const userId = req.userDetails?._id;
    const userType = req.userDetails?.userType;

    if (userType === 'admin') {
        return next(); 
    }
    if (!userId || !theatreId) {
        return res.status(400).json({ success: false, message: "Theatre ID and User ID are required for ownership check." });
    }

    try {
        const theatre = await theatreModel.findById(theatreId); 
        if (!theatre) {
            return res.status(404).json({ success: false, message: "Theatre not found." });
        }
        if (theatre.owner.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "Access Denied: You do not own this theatre." });
        }
        next();
    } catch (error) {
        console.error("Error verifying theatre ownership:", error);
        res.status(500).json({ success: false, message: "Server error during ownership verification." });
    }
};

const verifyShowOwnership = async (req, res, next) => {
    const showId = req.params.id; 
    const userId = req.userDetails?._id;
    const userType = req.userDetails?.userType;

    if (userType === 'admin') {
        return next(); 
    }

    if (!userId || !showId) {
        return res.status(400).json({ success: false, message: "Show ID and User ID are required for ownership check." });
    }

    try {
        const show = await showModel.findById(showId).populate('theatre'); 
        if (!show) {
            return res.status(404).json({ success: false, message: "Show not found." });
        }
        if (!show.theatre || show.theatre.owner.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "Access Denied: You do not own this show's theatre." });
        }
        next();
    } catch (error) {
        console.error("Error verifying show ownership:", error);
        res.status(500).json({ success: false, message: "Server error during ownership verification." });
    }
};


module.exports = {
  verifyJWT,
  verifyAdmin,
  verifyAdminOrPartner,
  verifyTheatreOwnership,
  verifyShowOwnership
};
