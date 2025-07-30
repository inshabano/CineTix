import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import { message } from "antd";
import moment from "moment";

import { getUserProfile, updateProfile } from "../../services/user";

import styles from "./myprofile.module.css";

const MyProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    fullName: "",
    mobileNumber: "",
    userType: "",
    memberSince: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formChanged, setFormChanged] = useState(false);

  const fetchUserProfileData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUserProfile();

      if (response.success && response.data) {
        const userData = response.data;
        setProfileData({
          username: userData.username || "",
          email: userData.email || "",
          fullName: userData.fullName || "",
          mobileNumber: userData.mobileNumber || "",
          userType: userData.userType || "user",
          memberSince: userData.createdAt || "",
        });
      } else {
        message.error(response.message || "Failed to load profile.");
        setError(response.message || "Failed to load profile.");
        if (
          response.statusCode === 401 ||
          response.message === "User not authenticated."
        ) {
          navigate("/login");
        }
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
      message.error("An unexpected error occurred while loading your profile.");
      setError("An unexpected error occurred.");
      if (err.response && err.response.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfileData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    setFormChanged(true);
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      const response = await updateProfile({
        fullName: profileData.fullName,
        mobileNumber: profileData.mobileNumber,
      });

      if (response.success) {
        message.success("Profile updated successfully!");
        setIsEditing(false);
        setFormChanged(false);
        if (response.data) {
          setProfileData((prev) => ({
            ...prev,
            fullName: response.data.fullName || "",
            mobileNumber: response.data.mobileNumber || "",
          }));
        }
      } else {
        message.error(response.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      message.error("An error occurred while updating profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    fetchUserProfileData();
    setFormChanged(false);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorMessage}>
          <h2>Error: {error}</h2>
          <p>Please try again later or ensure you are logged in.</p>
        </div>
      </div>
    );
  }

  if (!profileData || !profileData.username) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <p>No profile data found. Please log in or try again.</p>
          <button
            className={styles.exploreButton}
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.profileHeader}>
        <h1>My Profile</h1>
        <p className={styles.subtitle}>
          Manage your account information and preferences.
        </p>
      </div>

      <div className={styles.profileContent}>
        <h2 className={styles.cardTitle}>Account Details</h2>
        <div className={styles.card}>
          <div className={styles.infoBlock}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Username:</span>
              <span className={styles.detailValue}>{profileData.username}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Email:</span>
              <span className={styles.detailValue}>{profileData.email}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>User Type:</span>
              <span className={styles.detailValue}>{profileData.userType}</span>
            </div>
            {profileData.memberSince && (
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Member Since:</span>
                <span className={styles.detailValue}>
                  {moment(profileData.memberSince).format("MMM DD, YYYY")}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.infoBlock}>
            {!isEditing ? (
              <>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Full Name:</span>
                  <span className={styles.detailValue}>
                    {profileData.fullName || "N/A"}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Mobile:</span>
                  <span className={styles.detailValue}>
                    {profileData.mobileNumber || "N/A"}
                  </span>
                </div>
                <button
                  className={styles.editButton}
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              </>
            ) : (
              <div className={styles.editForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="fullName" className={styles.formLabel}>
                    Full Name:
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    className={styles.formInput}
                    value={profileData.fullName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="mobileNumber" className={styles.formLabel}>
                    Mobile Number:
                  </label>
                  <input
                    type="tel"
                    id="mobileNumber"
                    name="mobileNumber"
                    className={styles.formInput}
                    value={profileData.mobileNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formActions}>
                  <button
                    className={styles.saveButton}
                    onClick={handleSaveChanges}
                    disabled={!formChanged || loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    className={styles.cancelButton}
                    onClick={handleCancelEdit}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <h2 className={styles.cardTitle}>Your Activity</h2>
        <div className={styles.card}>
          <div className={styles.infoBlock}>
            <div className={styles.activityLinksContainer}>
              <button
                className={styles.activityLink}
                onClick={() => navigate("/mybookings")}
              >
                My Bookings
              </button>
              <button
                className={styles.activityLink}
                onClick={() => navigate("/my-watchlist")}
              >
                My Watchlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
