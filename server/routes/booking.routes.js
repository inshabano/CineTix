const { makePayment, createBooking, getBookingById, getUserBookings } = require("../controllers/booking.controller")
const { verifyJWT } = require("../middlewares/auth.middleware");



module.exports = (app)=>{
    app.post("/bookings",[verifyJWT],createBooking);
    app.get("/bookings/:bookingId", [verifyJWT], getBookingById);
    app.get('/mybookings', [verifyJWT], getUserBookings);
}