import React, { useContext } from "react"; // comment: react
import { Navigate } from "react-router-dom"; // comment: redirect
import { AuthContext } from "../context/AuthContext"; // comment: auth context

type ProtectedRouteProps = {
  children: React.ReactNode; // ✅ במקום JSX.Element
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null; // comment: waiting for auth state
  if (!user) return <Navigate to="/login" replace />; // comment: redirect if not logged in

  return <>{children}</>; // comment: render protected content
};

export default ProtectedRoute;
