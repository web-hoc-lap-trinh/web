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
        <div
            className="flex h-screen overflow-hidden font-sans selection:bg-emerald-500/30"
            style={{
                fontFamily: "Inter",
                background: "radial-gradient(circle at top left, #1f2937, #111827, #000000)",
                backgroundAttachment: "fixed",
                color: "#f3f4f6"
            }}>
            <NavigationBar />
            <main className="flex-1 flex flex-col overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-900/10 via-transparent to-transparent pointer-events-none" />
                <Outlet />
            </main>
        </div>
    )
}
export { AuthLayout, AdminLayout, UserLayout };