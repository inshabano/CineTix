import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { message } from "antd";
import Loader from "../../components/Loader";
import { forgotPasswordRequest } from "../../services/auth";

import sharedAuthStyles from "./auth.module.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      message.error("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await forgotPasswordRequest(email);
      if (response.success) {
        message.success(
          response.message ||
            "If an account with that email exists, a password reset link has been sent."
        );

        navigate("/login");
      } else {
        message.error(
          response.message || "Failed to send reset link. Please try again."
        );
      }
    } catch (error) {
      console.error("Forgot password request failed:", error);
      message.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={sharedAuthStyles.authContainer}>
      <div className={sharedAuthStyles.authCard}>
        <h1 className={sharedAuthStyles.authTitle}>Forgot Password</h1>
        <p className={sharedAuthStyles.authSubtitle}>
          Enter your email to receive a reset link.
        </p>
        <form onSubmit={handleSubmit} className={sharedAuthStyles.authForm}>
          <div className={sharedAuthStyles.formGroup}>
            <label htmlFor="email" className={sharedAuthStyles.formLabel}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className={sharedAuthStyles.formInput}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
            />
          </div>
          <button
            type="submit"
            className={sharedAuthStyles.authButton}
            disabled={loading}
          >
            {loading ? <Loader size="small" /> : "Send Reset Link"}
          </button>
        </form>
        <div className={sharedAuthStyles.authLinkContainer}>
          <Link to="/login" className={sharedAuthStyles.authLink}>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
