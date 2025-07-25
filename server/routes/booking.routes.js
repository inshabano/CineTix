const { makePayment, createBooking, getBookingById } = require("../controllers/booking.controller")
const { verifyJWT } = require("../middlewares/auth.middleware");
const validateCreateBokkingRequest = require("../middlewares/booking.middleware");


module.exports = (app)=>{
    app.post("/bookings",[verifyJWT],createBooking);
    app.get("/bookings/:bookingId", [verifyJWT], getBookingById);
}