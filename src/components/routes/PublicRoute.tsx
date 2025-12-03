import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface PublicRouteProps {
  redirectPath?: string; 
}

const PublicRoute = ({ redirectPath }: PublicRouteProps) => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    const rolePath = user?.role === "ADMIN" ? "/admin" : "/user";
    return <Navigate to={redirectPath || rolePath} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;