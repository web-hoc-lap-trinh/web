import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface PublicRouteProps {
  redirectPath?: string;
}

const PublicRoute = ({ redirectPath = "/" }: PublicRouteProps) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;