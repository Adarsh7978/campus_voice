import { Navigate, useLocation } from "react-router-dom";

// A reusable route wrapper that protects pages based on the presence of a JWT.
export default function ProtectedRoute({
  children,
  requireAuth = true,
  redirectPath = "/login",
}) {
  const location = useLocation();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // If the route needs an account and there is no token, send the user to login.
  if (requireAuth && !token) {
    return <Navigate to={redirectPath} replace state={{ from: location }} />;
  }

  // If the route is meant for guests only and a token already exists, send them away.
  if (!requireAuth && token) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}
