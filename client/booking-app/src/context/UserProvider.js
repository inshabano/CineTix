import React, { useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import { message } from "antd";
import { getUserProfile as getCurrentUserApi } from "../services/user";

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await getCurrentUserApi();

        if (response.success && response.data) {
          setUser(response.data);
        } else {
          console.error(
            "UserProvider: Failed to fetch current user:",
            response.message
          );
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
          message.error(
            "Your session has expired or is invalid. Please log in again."
          );
        }
      } catch (err) {
        console.error("UserProvider: Error fetching current user:", err);
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        message.error("Failed to load user session. Please try logging in.");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  const loginUser = (userData, newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const contextValue = {
    user,
    token,
    loginUser,
    logoutUser,
    isAuthenticated: !!user,
    isAdmin: user?.userType === "admin",
    isPartner: user?.userType === "partner",
    isRegularUser: user?.userType === "user",
    loading: loading,
  };
  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export default UserProvider;
