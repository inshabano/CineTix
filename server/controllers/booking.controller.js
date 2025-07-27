const mongoose = require('mongoose');
const bookingModel = require('../models/booking.model');
const showModel = require('../models/show.model');
const sendEmail = require('../utils/email');
const bookingConfirmationTemplate = require('../templates/bookingConfirmationTemplate')

const getBookingById = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const userId = req.userDetails._id; 

        const booking = await bookingModel.findById(bookingId)
            .populate({
                path: 'show',
                populate: [
                    { path: 'movie' },
                    { path: 'theatre' }
                ]
            })
            .populate('user'); 

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found.' });
        }

        
        if (booking.user._id.toString() !== userId.toString() && req.userDetails.userType !== 'admin') {
            return res.status(403).json({ success: false, message: 'Unauthorized access to booking details.' });
        }

        res.status(200).json({ success: true, data: booking });

    } catch (error) {
        console.error('Error fetching booking by ID:', error);
        res.status(500).json({ success: false, message: 'Internal server error fetching booking details.', error: error.message });
    }
};
const createBooking = async(req,res) => {
    
    const { bookingId, razorpayPaymentId } = req.body; 
    const userId = req.userDetails._id; 

    try {
        
        const booking = await bookingModel.findById(bookingId);

        if (!booking) {
            return res.status(404).send({ success: false, message: "Initial booking record not found." });
        }

        
        if (booking.user.toString() !== userId.toString()) {
            return res.status(403).send({ success: false, message: "Unauthorized: Booking does not belong to this user." });
        }

        
        if (booking.status !== 'payment_verified') { 
            
            return res.status(400).send({ success: false, message: `Booking status is '${booking.status}'. Cannot finalize. Payment may not be verified.` });
        }

        const showId = booking.show; 
        const seatsToBook = booking.seats; 
        const transactionId = razorpayPaymentId; 

        const show = await showModel.findById(showId);
        if (!show) {
            booking.status = 'failed';
            await booking.save();
            return res.status(404).send({ success: false, message: "Associated show not found for booking confirmation." });
        }
        const alreadyBooked = seatsToBook.filter(seat => show.bookedSeats.includes(seat));
        if (alreadyBooked.length > 0) {
            booking.status = 'failed';
            await booking.save(); 
            return res.status(400).send({ success: false, message: `Seat ${alreadyBooked[0]} is already booked. Please try other seats.` });
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            await showModel.findByIdAndUpdate(
                show._id,
                {
                    $push: { bookedSeats: { $each: seatsToBook } },
                    $inc: { availableSeats: -seatsToBook.length }
                },
                { session, new: true, runValidators: true } 
            );

            booking.status = 'confirmed';
            booking.transactionId = transactionId; 
            await booking.save({ session }); 

            await session.commitTransaction();
            session.endSession();

            const populatedBooking = await bookingModel.findById(booking._id)
                                        .populate({
                                            path: 'show',
                                            populate: {
                                                path: 'movie theatre'
                                            }
                                        }).lean(); 

            if (!populatedBooking || !populatedBooking.show || !populatedBooking.show.movie || !populatedBooking.show.theatre) {
                console.warn("Could not fully populate booking for email. Sending with partial data.");
            }

            const {subject, body: getHtmlBody} = bookingConfirmationTemplate(populatedBooking.show, populatedBooking);
            sendEmail([req.userDetails.email],subject,getHtmlBody());

            return res.status(201).send({
                success: true,
                message: `Booking successfully confirmed with ID ${booking._id}`,
                data: populatedBooking 
            });

        } catch (transactionError) {
            await session.abortTransaction();
            session.endSession();
            console.error('Booking finalization transaction failed:', transactionError);
           
            if (booking) {
                booking.status = 'failed';
                await booking.save(); 
            }
            return res.status(500).send({
                success: false,
                message: 'Failed to confirm booking due to a transaction error. Please try again.',
                error: transactionError.message
            });
        }

    } catch(err) {
        console.error("Error in createBooking controller (outer catch):", err);
        return res.status(500).send({success:false, message:"Something went wrong. Please try again", error: err.message})
    }
}

const getUserBookings = async (req, res) => {
    try {
        
        
        const userId = req.userDetails?._id; 
                                            
        

        if (!userId) {
            
            
            return res.status(401).json({ success: false, message: "Authentication required: User details not found in request after verification." });
        }

        
        const bookings = await bookingModel.find({ user: userId })
                                    .populate({
                                        path: 'show', 
                                        model: 'shows_user', 
                                        populate: [ 
                                            {
                                                path: 'movie', 
                                                model: 'movie_user' 
                                            },
                                            {
                                                path: 'theatre', 
                                                model: 'theatre_user' 
                                            }
                                        ]
                                    })
                                    .sort({ bookedAt: -1 }); 

        
        const validBookings = bookings.filter(booking =>
            booking.show &&
            booking.show.movie &&
            booking.show.theatre &&
            booking.show.showDate && 
            booking.show.showTime 
        );

        return res.status(200).json({ success: true, data: validBookings });

    } catch (error) {
        console.error('Error fetching user bookings:', error);
        return res.status(500).json({ success: false, message: 'Server error: Could not retrieve your bookings.' });
    }
};


module.exports = {
    getBookingById,
    createBooking,
    getUserBookings
}