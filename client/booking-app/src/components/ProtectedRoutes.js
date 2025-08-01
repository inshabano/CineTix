import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Loader from "./Loader";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading: userLoading } = useUser();
  if (userLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    console.log(
      "ProtectedRoute: User not authenticated, redirecting to /login"
    );
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && Array.isArray(allowedRoles)) {
    if (!user || !allowedRoles.includes(user.userType)) {
      console.warn(
        `ProtectedRoute: Access Denied. User role '${
          user?.userType
        }' is not in allowed roles: [${allowedRoles.join(", ")}].`
      );
      return <Navigate to="/" replace />;
    }
  }

  console.log(
    `ProtectedRoute: Access Granted for user role '${user?.userType}'.`
  );
  return children;
};

export default ProtectedRoute;
