const Razorpay = require("razorpay");
const crypto = require("crypto");
const bookingModel = require("../models/booking.model");
const showModel = require("../models/show.model");
const mongoose = require("mongoose");

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createRazorpayOrder = async (req, res) => {
  const { showId, seats } = req.body;
  const userId = req.userDetails._id;

  if (!showId || !seats || !Array.isArray(seats) || seats.length === 0) {
    return res
      .status(400)
      .send({ success: false, message: "Show ID and seats are required." });
  }

  try {
    const showDetails = await showModel.findById(showId);
    if (!showDetails) {
      return res
        .status(404)
        .send({ success: false, message: "Show not found." });
    }

    const totalAmountInPaise = Math.round(
      showDetails.ticketPrice * seats.length * 100
    );

    if (totalAmountInPaise <= 0) {
      return res
        .status(400)
        .send({ success: false, message: "Amount must be greater than zero." });
    }

    const tempBooking = new bookingModel({
      show: showId,
      user: userId,
      seats: seats,
      totalAmount: totalAmountInPaise / 100,
      status: "pending",
      transactionId: null,
    });
    const savedTempBooking = await tempBooking.save();

    const options = {
      amount: totalAmountInPaise,
      currency: "INR",
      receipt: savedTempBooking._id.toString(),
      payment_capture: 1,
    };

    const order = await instance.orders.create(options);

    savedTempBooking.razorpayOrderId = order.id;
    await savedTempBooking.save();

    return res.status(200).send({
      success: true,
      message: "Razorpay Order created successfully",
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        bookingId: savedTempBooking._id,
      },
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return res
      .status(500)
      .send({
        success: false,
        message: "Failed to create Razorpay order",
        error: error.message,
      });
  }
};

const verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    bookingId,
  } = req.body;
  console.log("RAZORPAY_KEY_SECRET exists:", !!process.env.RAZORPAY_KEY_SECRET);
  console.log(
    "RAZORPAY_KEY_SECRET length:",
    process.env.RAZORPAY_KEY_SECRET?.length
  );
  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !bookingId
  ) {
    return res
      .status(400)
      .send({ success: false, message: "Missing payment details." });
  }

  try {
    const booking = await bookingModel.findById(bookingId);

    if (!booking || booking.razorpayOrderId !== razorpay_order_id) {
      return res
        .status(400)
        .send({ success: false, message: "Booking or Order ID mismatch." });
    }

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest("hex");

    if (generated_signature === razorpay_signature) {
      if (booking.status === "pending") {
        booking.status = "payment_verified";
        booking.transactionId = razorpay_payment_id;
        await booking.save();

        return res.status(200).send({
          success: true,
          message:
            "Payment verified successfully! Proceeding to finalize booking.",
          bookingId: booking._id,
          razorpayPaymentId: razorpay_payment_id,
        });
      } else {
        return res.status(200).send({
          success: true,
          message: `Payment already handled, booking status is '${booking.status}'.`,
          bookingId: booking._id,
          razorpayPaymentId: razorpay_payment_id,
        });
      }
    } else {
      if (booking.status === "pending") {
        booking.status = "failed";
        await booking.save();
      }
      return res
        .status(400)
        .send({
          success: false,
          message: "Payment verification failed (signature mismatch).",
        });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    try {
      const failedBooking = await bookingModel.findById(bookingId);
      if (failedBooking && failedBooking.status === "pending") {
        failedBooking.status = "failed";
        await failedBooking.save();
      }
    } catch (updateErr) {
      console.error(
        "Failed to update booking status to failed during verification error:",
        updateErr
      );
    }
    return res
      .status(500)
      .send({
        success: false,
        message: "Error processing payment verification",
        error: error.message,
      });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPayment,
};
