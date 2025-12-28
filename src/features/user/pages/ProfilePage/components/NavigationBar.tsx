import { useEffect, useState } from "react";
import { Avatar, Divider } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../../hooks/useAuth";

type Props = {
    activeTab: "profile" | "submissions";
    setActiveTab: (tab: "profile" | "submissions") => void;
};

interface StoredUser {
    full_name?: string;
    email?: string;
    avatar_url?: string; 
}

export default function NavigationBar({ activeTab, setActiveTab }: Props) {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [userInfo, setUserInfo] = useState({
        name: "Người dùng",
        handle: "@user",
        avatar: ""
    });

    useEffect(() => {
        try {
            const storedString = localStorage.getItem("user");

            if (storedString) {
                const user: StoredUser = JSON.parse(storedString);

                setUserInfo({
                    name: user.full_name || "Người dùng",
                    handle: user.email ? `@${user.email.split('@')[0]}` : "@user",
                    avatar: user.avatar_url || ""
                });
            }
        } catch (error) {
            console.error("Lỗi đọc localStorage:", error);
        }
    }, []);

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-xl">
            <div className="text-center mb-6">
                <div className="inline-block p-1 rounded-full bg-linear-to-tr from-emerald-500 to-teal-500 mb-4">
                    <Avatar 
                        size={100} 
                        src={userInfo.avatar} 
                        icon={!userInfo.avatar && <UserOutlined />} 
                        className="border-4 border-[#051311] bg-white/10" 
                    />
                </div>
                <h2 className="text-xl font-bold text-white mb-1">
                    {userInfo.name}
                </h2>
                <p className="text-emerald-400 text-sm font-medium bg-emerald-500/10 py-1 px-3 rounded-full inline-block">
                    {userInfo.handle}
                </p>
            </div>

            <Divider className="bg-white/10 my-6" />

            <nav className="space-y-2">
                <NavButton 
                    active={activeTab === "profile"} 
                    onClick={() => setActiveTab("profile")}
                    icon={<UserOutlined />}
                    label="Hồ sơ cá nhân"
                />
                {/* <NavButton 
                    active={activeTab === "submissions"} 
                    onClick={() => setActiveTab("submissions")}
                    icon={<CodeOutlined />}
                    label="Bài tập đã nộp"
                /> */}
            </nav>

            <Divider className="bg-white/10 my-6" />

            <button
                onClick={() => {
                    logout();
                    navigate("/signin");
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-left text-gray-400 hover:bg-white/5 hover:text-white"
            >
                <span className="text-lg text-gray-500">
                    <LogoutOutlined />
                </span>
                Đăng xuất
            </button>
        </div>
    );
}

function NavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-left group ${
                active
                    ? "bg-linear-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/20 translate-x-1"
                    : "text-gray-400 hover:bg-white/5 hover:text-white hover:translate-x-1"
            }`}
        >
            <span className={`text-lg ${active ? "text-white" : "text-gray-500 group-hover:text-emerald-400"}`}>
                {icon}
            </span>
            {label}
        </button>
    );
}