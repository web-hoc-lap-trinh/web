import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import "./styles/input.css";
import ReactDOM from "react-dom/client";
import { App, ConfigProvider } from "antd";
import "@ant-design/v5-patch-for-react-19";
import enUS from "antd/es/locale/en_US";
import { AppProvider } from "./components/context/app.context";
import ProtectedRoute from "./components/ProtectedRoute";
import { Layout } from "./layout";
import SignInPage from "./features/auth/pages/SignInPage.tsx";
import AdminPage from "./features/admin/admin-layout.tsx";
import UserPage from "./features/user/user-layout.tsx";
import SignUpPage from "./features/auth/pages/SignUpPage.tsx";
import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage.tsx";
import InputOtpPage from "./features/auth/pages/InputOtpPage.tsx";
import ResetPasswordPage from "./features/auth/pages/ResetPasswordPage.tsx";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { index: true, element: <Navigate to="/signin" replace /> },
            {
                element: <ProtectedRoute roles={["guest"]} />,
                children: [{ path: "signin", element: <SignInPage /> }],
            },
            {
                element: <ProtectedRoute roles={["admin"]} />,
                children: [{ path: "admin", element: <AdminPage /> }],
            },
            {
                element: <ProtectedRoute roles={["user"]} />,
                children: [{ path: "user", element: <UserPage /> }],
            },
            { path: "*", element: <Navigate to="/" replace /> },
        ],
    },
    {
        path: "/signup",
        element: <Layout />,
        children: [
            {index: true, element: <SignUpPage />}
        ]
    },
    {
        path: "/forgot-password",
        element: <Layout />,
        children: [
            {index: true, element: <ForgotPasswordPage />}
        ]
    },
    {
        path: "/input-otp",
        element: <Layout />,
        children: [
            {index: true, element: <InputOtpPage />}
        ]
    },
    {
        path: "/reset-password",
        element: <Layout />,
        children: [
            {index: true, element: <ResetPasswordPage />}
        ]
    }
]);

const root = document.getElementById("root");

ReactDOM.createRoot(root!).render(
  <App>
    <AppProvider>
      <ConfigProvider locale={enUS}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </AppProvider>
  </App>
);