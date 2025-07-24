const mongoose = require('mongoose');
const bookingModel = require('../models/booking.model');
const showModel = require('../models/show.model');
const sendEmail = require('../utils/email');
const bookingConfirmationTemplate = require('../templates/bookingConfirmationTemplate')

const makePayment = async(req,res)=>{
   
}

const createBooking = async(req,res) => {
    const {seats, transactionId} = req.body;
    const userId = req.userDetails._id;
    const showDetails = req.showDetails;

    try {
        const totalAmount = showDetails.ticketPrice * seats.length;

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const newBooking = new bookingModel({
                show: showDetails._id,
                user: userId,
                seats: seats,
                transactionId: transactionId,
                totalAmount: totalAmount,
                status: 'confirmed'
            });
            console.log(totalAmount);

            const newBookingResponse = await newBooking.save({ session });

            await showModel.findByIdAndUpdate(
                showDetails._id,
                {
                    $push: { bookedSeats: { $each: seats } },
                    $inc: { availableSeats: -seats.length }
                },
                { session, new: true, runValidators: true }
            );

            await session.commitTransaction();
            session.endSession();
            
            const {subject,body: getHtmlBody} = bookingConfirmationTemplate(showDetails,newBookingResponse);
            sendEmail([req.userDetails.email],subject,getHtmlBody());

            return res.status(201).send({
                success:true,
                message:`Booking successfully created with ID ${newBookingResponse._id}`,
                data:newBookingResponse
            });

        } catch (transactionError) {
            await session.abortTransaction();
            session.endSession();
            console.error('Booking transaction failed:', transactionError);
            return res.status(500).send({
                success: false,
                message: 'Failed to create booking due to a transaction error. Please try again.',
                error: transactionError.message
            });
        }

    } catch(err) {
        console.error("Error in createBooking controller:", err);
        return res.status(500).send({success:false, message:"Something went wrong.Please try again"})
    }
}

module.exports = {
    makePayment,
    createBooking,
}