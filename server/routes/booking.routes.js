const {createBooking, getBookingById, getUserBookings, getBookingsForMyTheatres } = require("../controllers/booking.controller")
const { verifyJWT, verifyAdminOrPartner } = require("../middlewares/auth.middleware");

module.exports = (app)=>{
    app.post("/bookings",[verifyJWT],createBooking);
    app.get('/bookings/my-theatres', [verifyJWT, verifyAdminOrPartner], getBookingsForMyTheatres);
    app.get("/bookings/:bookingId", [verifyJWT], getBookingById);
    app.get('/mybookings', [verifyJWT], getUserBookings);
    
}