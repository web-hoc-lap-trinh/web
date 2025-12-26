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
            className="flex h-screen w-full overflow-hidden font-sans selection:bg-emerald-500/30"
            style={{
                fontFamily: "San Francisco, sans-serif",
                background: "radial-gradient(circle at top left, #1f2937, #111827, #000000)",
                backgroundAttachment: "fixed",
                color: "#f3f4f6"
            }}>

            {/* Khu vực 1: Sidebar (NavigationBar) */}
            <aside className="shrink-0 z-20 shadow-2xl border-r border-white/5">
                <NavigationBar />
            </aside>

            {/* Khu vực 2: Nội dung chính (Outlet) */}
            <main className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
                {/* Lớp phủ hiệu ứng gradient phía sau */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-900/10 via-transparent to-transparent pointer-events-none" />

                {/* Vùng chứa nội dung có thể cuộn */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 custom-scrollbar">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
export { AuthLayout, AdminLayout, UserLayout };