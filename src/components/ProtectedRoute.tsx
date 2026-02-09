import React from "react";
import { Navigate } from "react-router-dom";
import { LinearProgress } from "@mui/material";
import { useAuth } from "../context/AuthContext";

const Protectedroutes: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <LinearProgress sx={{ mt: 1 }} />;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

export default Protectedroutes;
