const {userModel} = require("../models/user.model");
const jwt = require('jsonwebtoken');

const verifyJWT = async (req, res, next) => {
    const token = req.headers['access-token'];
    if (!token) {
        return res.status(400).send({ success: false, message: "JWT token is not passed" });
    }

    jwt.verify(token, process.env.SECRET_KEY, async (err, payload) => {
        if (err) {
            return res.status(403).send({ success: false, message: "You are not authenticated to access this page." });
        }

        try {
            const userId = payload.userId;
            const userDetails = await userModel.findById(userId);

            if (!userDetails) {
                return res.status(404).send({ success: false, message: "User not found" });
            }

            req.userDetails = userDetails;
            next();  
        } catch (error) {
            console.error("Error verifying user:", error);
            return res.status(500).send({ success: false, message: "Something went wrong! Please try again." });
        }
    });
};

const verifyAdmin = (req, res, next) => {
    const userType = req.userDetails?.userType;  // optional chaining, safe check
    if (userType !== "admin") {
        return res.status(403).send({ success: false, message: "You are not authorised to access this page." });
    }
    next();
};

module.exports = {
    verifyJWT,
    verifyAdmin
};
