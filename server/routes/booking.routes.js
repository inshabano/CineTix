const { makePayment, createBooking } = require("../controllers/booking.controller")
const { verifyJWT } = require("../middlewares/auth.middleware");
const validateCreateBokkingRequest = require("../middlewares/booking.middleware");


module.exports = (app)=>{
    app.post("/payments",[verifyJWT],makePayment);
    app.post("/bookings",[verifyJWT,validateCreateBokkingRequest],createBooking)
}