import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface ProtectedRouteProps {
  redirectPath?: string;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ redirectPath = "/signin", allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const role = (user?.role || "").toUpperCase();
    const normalized = allowedRoles.map(r => r.toUpperCase());
    if (!normalized.includes(role)) {
      // If role not allowed, send to a safe area based on role
      const fallback = role === "ADMIN" ? "/admin" : "/user";
      return <Navigate to={fallback} replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;