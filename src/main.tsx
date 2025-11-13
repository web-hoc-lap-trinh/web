import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import "./styles/input.css";
import ReactDOM from "react-dom/client";
import { App, ConfigProvider } from "antd";
import "@ant-design/v5-patch-for-react-19";
import enUS from "antd/es/locale/en_US";
import { AppProvider } from "./components/context/app.context";
import ProtectedRoute from "./components/ProtectedRoute";
import { Layout } from "./layout";
import LoginPage from "./features/auth/pages/login";
import AdminPage from "./features/admin/admin-layout";
import UserPage from "./features/user/user-layout";
import SignIn from "./features/auth/pages/signin.tsx";
import Signup from "./features/auth/pages/signup.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { index: true, element: <Navigate to="/signin" replace /> },
            {
                element: <ProtectedRoute roles={["guest"]} />,
                children: [{ path: "signin", element: <SignIn /> }],
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
            {index: true, element: <Signup />}
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