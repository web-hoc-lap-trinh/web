import { Navigate, type RouteObject } from "react-router-dom";
import { Layout } from "../layout";
import PublicRoute from "../components/routes/PublicRoute";
import ProtectedRoute from "../components/routes/ProtectedRoute";
import LoginPage from "../features/auth/pages/login";
import AdminPage from "../features/admin/admin-layout";
import UserPage from "../features/user/user-layout";

export const appRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },

      {
        element: <PublicRoute redirectPath="/" />,
        children: [{ path: "login", element: <LoginPage /> }],
      },

      {
        element: <ProtectedRoute redirectPath="/login" />,
        children: [
          { path: "admin", element: <AdminPage /> },
          { path: "user", element: <UserPage /> },
        ],
      },

      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
];

export default appRoutes;
