import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "./context/userContext";

const ProtectedRoute = ({ children }) => {
  const { userData } = useContext(UserContext);

  if (!userData) {
    // If the user is not authenticated, redirect to login
    return <Navigate to="/" />;
  }

  // If authenticated, render the child components
  return children;
};

export default ProtectedRoute;
