import { Navigate, type RouteObject } from "react-router-dom";
import { Layout } from "../layout";
import PublicRoute from "../components/routes/PublicRoute";
import ProtectedRoute from "../components/routes/ProtectedRoute";
import SignInPage from "../features/auth/pages/SignInPage";
import SignUpPage from "../features/auth/pages/SignUpPage";
import InputOtpPage from "../features/auth/pages/InputOtpPage";
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "../features/auth/pages/ResetPasswordPage";
import AdminPage from "../features/admin";
import UserPage from "../features/user";

export const appRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },

      {
        element: <PublicRoute />,
        children: [
          { path: "login", element: <SignInPage /> },
          { path: "signup", element: <SignUpPage /> },
          { path: "input-otp", element: <InputOtpPage /> },
          { path: "forgot-password", element: <ForgotPasswordPage /> },
          { path: "reset-password", element: <ResetPasswordPage /> },
        ],
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
