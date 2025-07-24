const { createRazorpayOrder, verifyPayment } = require("../controllers/payment.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");

module.exports = (app)=>{
    app.post("/razorpay/order", [verifyJWT], createRazorpayOrder);
    app.post("/razorpay/verify", [verifyJWT], verifyPayment);
}