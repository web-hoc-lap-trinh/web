import { Outlet } from "react-router-dom";
import Header from "./components/common/Header.tsx";
import SideBar from "./components/common/SideBar.tsx";
import {ConfigProvider, theme} from "antd";

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
        <ConfigProvider theme={{algorithm: theme.darkAlgorithm}}>
            <div
                className="flex h-screen w-full overflow-hidden font-sans selection:bg-emerald-500/30"
                style={{
                    fontFamily: "San Francisco, sans-serif",
                    background: "radial-gradient(circle at top left, #1f2937, #111827, #000000)",
                    backgroundAttachment: "fixed",
                    color: "#f3f4f6"
                }}>

                {/* Khu vực 1: Sidebar (SideBar) */}
                <aside className="shrink-0 z-20 shadow-2xl border-r border-white/5">
                    <SideBar />
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
        </ConfigProvider>
    )
}
export { AuthLayout, AdminLayout, UserLayout };