import {Navigate, type RouteObject} from "react-router-dom";
import { AuthLayout, AdminLayout, UserLayout } from "../layout";
import PublicRoute from "../components/routes/PublicRoute";
import ProtectedRoute from "../components/routes/ProtectedRoute";
import SignInPage from "../features/auth/pages/SignInPage";
import SignUpPage from "../features/auth/pages/SignUpPage";
import InputOtpPage from "../features/auth/pages/InputOtpPage";
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "../features/auth/pages/ResetPasswordPage";
import DashboardPage from "../features/admin/DashboardPage.tsx";
import HomePage from "../features/user/pages/HomePage/HomePage.tsx";
import LessonPage from "../features/admin/LessonPage.tsx";
import CategoryPage from "../features/admin/CategoryPage.tsx";
import ProfilePage from "../features/user/pages/ProfilePage/ProfilePage.tsx";
import CoursePage from "../features/user/pages/CoursePage/MainPage/CoursePage.tsx";
import CourseDetail from "../features/user/pages/CoursePage/CourseDetailPage/CourseDetail.tsx";
import LessonDetailPage from "../features/user/pages/CoursePage/LessonDetailPage/LessonDetailPage.tsx";

export const appRoutes: RouteObject[] = [
    {path: "/", element: <Navigate to="/signin" replace/>},

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
        element: <ProtectedRoute redirectPath="/signin" allowedRoles={["ADMIN"]} />,
        children: [
            {
                path: "admin/*",
                element: <AdminLayout/>,
                children: [
                    {index: true, element: <Navigate to={"/admin/dashboard"} replace/>},
                    {path: "dashboard", element: <DashboardPage/>},
                    {path: "lesson", element: <LessonPage/>},
                    {path: "category", element: <CategoryPage/>}
                ]
            },
        ],
    },

    {
        element: <ProtectedRoute redirectPath="/signin" />, 
        children: [
            {
                path: "/*",
                element: <UserLayout/>,
                children: [
                    { index: true, element: <HomePage/> },
                    { path: "profile", element: <ProfilePage/> },
                    { path: "courses", element: <CoursePage/> },
                    { path: "courses/:categoryId", element: <CourseDetail/> },
                    { path: "learn/:lessonId", element: <LessonDetailPage/> }
                ]
            },
        ],
    },

    {path: "*", element: <Navigate to="/" replace/>},
];

export default appRoutes;
