import {Navigate, Outlet, type RouteObject} from "react-router-dom";
import { AuthLayout, AdminLayout, UserLayout } from "../layout";
import PublicRoute from "../components/routes/PublicRoute";
import ProtectedRoute from "../components/routes/ProtectedRoute";
import SignInPage from "../features/auth/pages/SignInPage";
import SignUpPage from "../features/auth/pages/SignUpPage";
import InputOtpPage from "../features/auth/pages/InputOtpPage";
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "../features/auth/pages/ResetPasswordPage";
import DashboardPage from "../features/admin/DashboardPage.tsx";
import UserPage from "../features/user";
import LessonPage from "../features/admin/LessonPage.tsx";
import CategoryPage from "../features/admin/CategoryPage.tsx";
import ExercisePage from "../features/admin/ExercisePage.tsx";
import TestcasePage from "../features/admin/TestcasePage.tsx";
import AllUserPage from "../features/admin/AllUserPage.tsx";

export const appRoutes: RouteObject[] = [
    {path: "/", element: <Navigate to="/admin" replace/>},

    {
        element: <PublicRoute/>,
        children: [
            {
                element: <AuthLayout/>,
                children: [
                    {path: "signin", element: <SignInPage/>, index: true},
                    {path: "signup", element: <SignUpPage/>},
                    {path: "input-otp", element: <InputOtpPage/>},
                    {path: "forgot-password", element: <ForgotPasswordPage/>},
                    {path: "reset-password", element: <ResetPasswordPage/>},
                ]
            }
        ],
    },

    {
        element: <Outlet/>,
        // element: <ProtectedRoute redirectPath="/signin"/>,
        children: [
            {
                path: "admin/*",
                element: <AdminLayout/>,
                children: [
                    {index: true, element: <Navigate to={"/admin/dashboard"} replace/>},
                    {path: "dashboard", element: <DashboardPage/>},
                    {path: "lesson", element: <LessonPage/>},
                    {path: "category", element: <CategoryPage/>},
                    {path: "exercise", element: <ExercisePage/>},
                    {path: "testcase", element: <TestcasePage/>},
                    {path: "all-user", element: <AllUserPage/>}
                ]
            },

            {
                path: "user/*",
                element: <UserLayout/>,
                children: [
                    { index: true, element: <UserPage/> }
                ]
            },
        ],
    },

    {path: "*", element: <Navigate to="/" replace/>},
];

export default appRoutes;
