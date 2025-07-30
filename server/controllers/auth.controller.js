const { userModel } = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const PasswordResetToken = require("../models/passwordResetToken.model");
const sendEmail = require("../utils/email");
const generatePasswordResetEmailHtml = require("../templates/forgotPasswordTemplate");


const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      console.warn(`Forgot password attempt for non-existent email: ${email}`);
      return res
        .status(200)
        .json({
          success: true,
          message:
            "If an account with that email exists, a password reset link has been sent to it.",
        });
    }

    await PasswordResetToken.deleteMany({ userId: user._id });
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3600000);

    const passwordResetToken = new PasswordResetToken({
      userId: user._id,
      token: resetToken,
      expiresAt: expiresAt,
    });
    await passwordResetToken.save();

    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;

    const emailSubject = "CineTix Password Reset Request";
    const emailHtml = generatePasswordResetEmailHtml(resetUrl);

    let emailSentSuccessfully = false;
    try {
      await sendEmail([user.email], emailSubject, emailHtml);
      emailSentSuccessfully = true;
    } catch (emailError) {
      console.error(
        "Failed to send reset email (caught by controller):",
        emailError
      );
      emailSentSuccessfully = false;
    }

    if (emailSentSuccessfully) {
      res
        .status(200)
        .json({
          success: true,
          message:
            "If an account with that email exists, a password reset link has been sent to it.",
        });
    } else {
      res
        .status(500)
        .json({
          success: false,
          message:
            "An error occurred while sending the reset email. Please try again later.",
        });
    }
  } catch (error) {
    console.error("Forgot password error (outer catch):", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Server error during password reset request.",
      });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Token and new password are required.",
        });
    }

    const passwordResetToken = await PasswordResetToken.findOne({ token });

    if (!passwordResetToken) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid or expired password reset token.",
        });
    }
    if (passwordResetToken.expiresAt < new Date()) {
      await PasswordResetToken.deleteOne({ _id: passwordResetToken._id });
      return res
        .status(400)
        .json({ success: false, message: "Password reset token has expired." });
    }

    const user = await userModel.findById(passwordResetToken.userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found for this token." });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    await PasswordResetToken.deleteOne({ _id: passwordResetToken._id });

    res
      .status(200)
      .json({
        success: true,
        message: "Password has been reset successfully.",
      });
  } catch (error) {
    console.error("Reset password error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error during password reset." });
  }
};

module.exports = {
  forgotPassword,
  resetPassword,
};
