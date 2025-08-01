import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { message } from "antd";
import Loader from "../../components/Loader";
import { resetPasswordWithToken } from "../../services/auth";

import sharedAuthStyles from "./auth.module.css";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [isTokenValid, setIsTokenValid] = useState(true);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setIsTokenValid(false);
      message.error(
        "No reset token found. Please use the link from your email."
      );
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      message.error("Reset token is missing.");
      return;
    }
    if (!newPassword || !confirmPassword) {
      message.error("Please enter and confirm your new password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      message.error("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      message.error("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const response = await resetPasswordWithToken(token, newPassword);
      if (response.success) {
        message.success(
          response.message ||
            "Password has been reset successfully. You can now log in."
        );
        navigate("/login");
      } else {
        message.error(
          response.message || "Failed to reset password. Please try again."
        );
        if (response.message.includes("token")) {
          setIsTokenValid(false);
        }
      }
    } catch (error) {
      console.error("Reset password request failed:", error);
      message.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isTokenValid) {
    return (
      <div className={sharedAuthStyles.authContainer}>
        <div className={sharedAuthStyles.authCard}>
          <h1 className={sharedAuthStyles.authTitle}>Invalid Link</h1>
          <p className={sharedAuthStyles.authSubtitle}>
            The password reset link is invalid or has expired.
          </p>
          <div className={sharedAuthStyles.authLinkContainer}>
            <Link to="/forgot-password" className={sharedAuthStyles.authLink}>
              Request a new link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={sharedAuthStyles.authContainer}>
      <div className={sharedAuthStyles.authCard}>
        <h1 className={sharedAuthStyles.authTitle}>Reset Password</h1>
        <p className={sharedAuthStyles.authSubtitle}>Set your new password.</p>
        <form onSubmit={handleSubmit} className={sharedAuthStyles.authForm}>
          <div className={sharedAuthStyles.formGroup}>
            <label htmlFor="newPassword" className={sharedAuthStyles.formLabel}>
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              className={sharedAuthStyles.formInput}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
          </div>
          <div className={sharedAuthStyles.formGroup}>
            <label
              htmlFor="confirmPassword"
              className={sharedAuthStyles.formLabel}
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className={sharedAuthStyles.formInput}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />
          </div>
          <button
            type="submit"
            className={sharedAuthStyles.authButton}
            disabled={loading}
          >
            {loading ? <Loader size="small" /> : "Reset Password"}
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

export default ResetPassword;
