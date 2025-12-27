import {
    DashboardOutlined,
    FolderAddOutlined,
    FileOutlined,
    CommentOutlined,
    FireOutlined,
    UserOutlined,
    KeyOutlined, TagsOutlined, LogoutOutlined, CodeOutlined
} from '@ant-design/icons';
import {useEffect, useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {logout} from "../../stores/slices/authSlice.ts";
import {useAuth} from "../../hooks/useAuth.ts";

interface MenuItem {
    id: string;
    title: string;
    icon: React.ReactNode;
    subItems?: { id: string; title: string }[];
    isOpen?: boolean;
}

const MENU_ITEMS: MenuItem[] = [
    {
        id: 'dashboard',
        title: 'Hệ thống',
        icon: <DashboardOutlined size={20}/>,
        subItems: [{id: 'dashboard', title: 'Tổng quan'}]
    },
    {
        id: 'lessons',
        title: 'Quản lý Bài học',
        icon: <FolderAddOutlined size={20}/>,
        isOpen: true,
        subItems: [
            {id: 'category', title: 'Quản lý chủ đề'},
            {id: 'lesson', title: 'Quản lý bài học'},
            {id: 'question', title: 'Quản lý câu hỏi'}
        ]
    },
    {
        id: 'problems',
        title: 'Quản lý Bài tập & Test Case',
        icon: <FileOutlined size={20}/>,
        subItems: [
            {id: 'tag', title: 'Quản lý nhãn'},
            {id: 'problem', title: 'Quản lý bài tập'},
            {id: 'testcase', title: 'Quản lý test case'}
        ]
    },
    {
        id: 'community',
        title: 'Quản lý cộng đồng',
        icon: <CommentOutlined size={20}/>,
        subItems: [
            {id: 'discussion', title: 'Quản lý bài đăng'},
            {id: 'reply', title: 'Quản lý phản hồi'}
        ]
    },
    {
        id: 'users',
        title: 'Quản lý Người dùng',
        icon: <UserOutlined size={20}/>,
        subItems: [
            {id: 'user', title: 'Danh sách người dùng'},
            // {id: 'roles', title: 'Thông tin & phân quyền'},
            // {id: 'progress', title: 'Theo dõi tiến độ học tập'}
        ]
    },
    /*{
        id: 'gamification',
        title: 'Quản lý Gamification',
        icon: <FireOutlined size={20}/>,
        subItems: [
            {id: 'badges', title: 'Badge & Streak'},
            {id: 'challenges', title: 'Challenge hàng ngày'}
        ]
    },*/
    /*{
        id: 'settings',
        title: 'Cấu hình hệ thống',
        icon: <KeyOutlined size={20}/>,
        subItems: [
            {id: 'editor', title: 'Code Editor & Runner'},
            {id: 'system-params', title: 'Tham số hệ thống'},
            {id: 'ai-rules', title: 'Quy tắc gợi ý học tập (AI Rule)'}
        ]
    },*/
];

const SideBar = () => {
    const { logout } = useAuth();
    const navigation = useNavigate();
    const location = useLocation();
    const [activeSubItem, setActiveSubItem] = useState<string>(() => {
        const pathParts = location.pathname.split('/');
        return pathParts[pathParts.length - 1] || 'dashboard';
    });
    useEffect(() => {
        const pathParts = location.pathname.split('/');
        const lastPart = pathParts.pop();
        const activeId = lastPart === 'admin' || !lastPart ? 'dashboard' : lastPart;
        setActiveSubItem(activeId);
    }, [location.pathname]);

    return (
        <aside
            className="w-72 h-screen flex flex-col border-r border-white/5 bg-[#0f1218]/80 backdrop-blur-xl shadow-2xl z-20">
            {/* Header Sidebar */}
            <div className="p-8 pb-4">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-lg">
                        <CodeOutlined size={40} className="text-emerald-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-wide">Codery</h2>
                </div>
            </div>

            {/* Navigation List */}
            <nav className="flex-1 overflow-y-auto px-5 py-4 space-y-8 scrollbar-hide">
                {MENU_ITEMS.map((item) => (
                    <div key={item.id} className="group-section">
                        {/* Group Header (Parent Item) */}
                        <div className="flex items-center gap-3 px-3 mb-3 text-gray-400 select-none">
                            <div
                                className="text-emerald-500 p-1.5 bg-emerald-500/10 rounded-lg shadow-sm ring-1 ring-emerald-500/20">
                                {item.icon}
                            </div>
                            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 font-sans">
                {item.title}
              </span>
                        </div>

                        {/* List of Sub-items */}
                        <div className="space-y-1 pl-2">
                            {item.subItems?.map((sub) => (
                                <button
                                    key={sub.id}
                                    onClick={() => {
                                        setActiveSubItem(sub.id)
                                        navigation(`/admin/${sub.id}`)
                                    }}
                                    className={`relative flex items-center w-full text-left py-2.5 px-4 text-[13px] font-medium transition-all duration-300 rounded-xl group
                    ${activeSubItem === sub.id
                                        ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/5 text-emerald-300 shadow-md shadow-emerald-900/20 ring-1 ring-emerald-500/20'
                                        : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                                    }`}
                                >
                                    {sub.title}

                                    {/* Subtle glow dot for active state */}
                                    {activeSubItem === sub.id && (
                                        <div
                                            className="absolute right-3 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"/>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Footer / User Info */}
            <div className="p-5 border-t border-white/5 bg-black/20">
                <div
                    className="flex items-center gap-3 p-3 rounded-xl">
                    <button
                        className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-lg cursor-pointer"
                        onClick={() => {
                            logout();
                            navigation("/signin");
                        }}>
                        <LogoutOutlined size={24} className="text-emerald-400" />
                    </button>
                    <div className="flex-1 min-w-0">
                        <div
                            className="text-sm font-semibold text-gray-200 truncate group-hover:text-white transition-colors">Administrator
                        </div>
                        <div className="text-xs text-gray-500 truncate">admin@system.com</div>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default SideBar;