import {
    UserOutlined,
    ScheduleOutlined,
    FireFilled,
    ReadOutlined,
    ProfileOutlined,
    CodeOutlined,
    DatabaseOutlined, SendOutlined, CheckCircleOutlined,
    PercentageOutlined
} from "@ant-design/icons";
import type {IDashboardStats} from "../../../../../types/dashboard.types.ts";
import {Skeleton} from "antd";

interface DashboardProps {
    data: IDashboardStats | undefined;
    loading: boolean;
}

const DashboardStats = ({ data, loading }: DashboardProps) => {
    if (loading || !data) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, idx) => (
                    <Skeleton
                        key={idx}
                        active
                        className="bg-white/5! rounded-2xl! p-5!"
                        paragraph={{ rows: 3 }}
                    />
                ))}
            </div>
        );
    }

    const stats = [
        // Nhóm 1: Người dùng & Tương tác
        { label: "Tổng người dùng", value: data.total_users, icon: <UserOutlined />, color: "text-blue-400", bg: "bg-blue-500/10" },
        { label: "Hoạt động hôm nay", value: data.active_users_today, icon: <ScheduleOutlined />, color: "text-emerald-400", bg: "bg-emerald-500/10" },
        { label: "Streak cao nhất", value: data.current_highest_streak, icon: <FireFilled />, color: "text-orange-500", bg: "bg-orange-500/10" },

        // Nhóm 2: Tài nguyên học tập
        { label: "Bài học", value: data.total_lessons, icon: <ReadOutlined />, color: "text-indigo-400", bg: "bg-indigo-500/10" },
        { label: "Danh mục", value: data.total_categories, icon: <ProfileOutlined />, color: "text-purple-400", bg: "bg-purple-500/10" },
        { label: "Bài tập code", value: data.total_problems, icon: <CodeOutlined />, color: "text-cyan-400", bg: "bg-cyan-500/10" },
        { label: "Test Cases", value: data.total_test_cases, icon: <DatabaseOutlined />, color: "text-gray-400", bg: "bg-gray-500/10" },

        // Nhóm 3: Kết quả thực hành
        { label: "Lượt nộp bài", value: data.total_submissions, icon: <SendOutlined />, color: "text-pink-400", bg: "bg-pink-500/10" },
        { label: "Bài làm đúng", value: data.accepted_submissions, icon: <CheckCircleOutlined />, color: "text-green-400", bg: "bg-green-500/10" },
        { label: "Tỉ lệ chấp nhận", value: `${data.acceptance_rate}%`, icon: <PercentageOutlined />, color: "text-amber-400", bg: "bg-amber-500/10" },
    ];

    return (
        <div className="p-4">
            {/*<div className="mb-8">
                <h2 className="text-2xl font-bold text-white">Tổng quan hệ thống</h2>
                <p className="text-gray-400 text-sm">Dữ liệu thống kê thời gian thực</p>
            </div>*/}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {stats.map((item, index) => (
                    <div
                        key={index}
                        className="bg-[#1e293b]/50 backdrop-blur-xl border border-white/5 p-5 rounded-3xl hover:border-emerald-500/30 transition-all group"
                    >
                        <div className={`w-12 h-10 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            {item.icon}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">{item.label}</span>
                            <span className="text-2xl font-bold text-white mt-1">
                {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
              </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashboardStats;