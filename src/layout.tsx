import { Outlet } from "react-router-dom";
import Header from "./components/common/Header.tsx";
import NavigationBar from "./components/common/NavigationBar.tsx";

const AuthLayout = () => {
    return (
        <>
            <Header />
            <main
                style={{
                    backgroundSize: "cover",
                    backgroundPosition: "center center",
                }}
            >
                <Outlet />
            </main>
        </>
    )
}

const UserLayout = () => {
    return (
        <>
            <Header />
            <div className="bg-primary-200">
                <Outlet />
            </div>
        </>
    );
};

const AdminLayout = () => {
    return (
        <main className={"flex min-h-screen bg-secondary-700"}>
            <div className={"flex items-center ps-8"}>
                <NavigationBar />
            </div>
            <div className={"flex-1/2 text-white px-8 py-14"}>
                <Outlet />
            </div>
        </main>
    )
}
export { AuthLayout, AdminLayout, UserLayout };