import { useNavigate } from "react-router-dom"; // 1. Import hook
import { Avatar, Button, Divider } from "antd";
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    HddOutlined,
    TrophyOutlined,
    UserOutlined,
    CodeOutlined
} from "@ant-design/icons";
import type { IProblem } from "../../../../../types/problem.types";

const ProblemSidebar = ({ problem }: { problem: IProblem }) => {
    const navigate = useNavigate(); // 2. Init hook

    const handleSolveClick = () => {
        // 3. Điều hướng đến trang Workspace
        navigate(`/practice/${problem.problem_id}/solve`);
    };

    return (
        <div className="space-y-6 lg:col-span-4">
            <div className="sticky top-24 rounded-3xl border border-white/5 bg-[#0a1916] p-6 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                            Điểm số
                        </span>
                        <span className="text-3xl font-bold text-yellow-500">
                            {problem.points}
                        </span>
                    </div>
                    <TrophyOutlined className="text-4xl text-yellow-500/20" />
                </div>

                <Button
                    type="primary"
                    block
                    size="large"
                    icon={<CodeOutlined />}
                    onClick={handleSolveClick} // 4. Gắn sự kiện click
                    className="mb-4 h-12 rounded-xl border-0 bg-emerald-600 font-bold shadow-lg shadow-emerald-900/40 hover:bg-emerald-500! transition-all active:scale-95"
                >
                    GIẢI BÀI TẬP
                </Button>

                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-white/5 bg-white/5 p-3 text-center">
                        <ClockCircleOutlined className="mb-1 text-lg text-blue-400" />
                        <div className="text-xs text-gray-400">Thời gian</div>
                        <div className="text-sm font-bold text-white">
                            {problem.time_limit} ms
                        </div>
                    </div>
                    <div className="rounded-xl border border-white/5 bg-white/5 p-3 text-center">
                        <HddOutlined className="mb-1 text-lg text-purple-400" />
                        <div className="text-xs text-gray-400">Bộ nhớ</div>
                        <div className="text-sm font-bold text-white">
                            {problem.memory_limit} MB
                        </div>
                    </div>
                </div>

                <Divider className="my-6 border-white/10" />

                {/* Author */}
                <div>
                    <span className="mb-3 block text-xs font-bold uppercase text-gray-500">
                        Tác giả
                    </span>
                    <div className="flex items-center gap-3">
                        <Avatar
                            src={problem.author?.avatar_url}
                            icon={<UserOutlined />}
                            className="bg-emerald-700"
                        />
                        <div>
                            <div className="flex items-center gap-1 text-sm font-medium text-white">
                                {problem.author?.full_name || "Admin Codery"}
                                {problem.author?.is_verified && (
                                    <CheckCircleOutlined className="text-xs text-blue-500" />
                                )}
                            </div>
                            <div className="text-xs text-gray-500">
                                {problem.author?.role || "Member"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics */}
                <div className="mt-6 border-t border-white/10 pt-6">
                    <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-gray-400">Tỷ lệ chấp nhận</span>
                        <span className="font-mono text-white">
                            {parseFloat(problem.acceptance_rate || "0")}%
                        </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                        <div
                            className="h-full rounded-full bg-emerald-500"
                            style={{
                                width: `${parseFloat(problem.acceptance_rate || "0")}%`,
                            }}
                        />
                    </div>
                    <div className="mt-2 flex justify-between text-xs text-gray-500">
                        <span>Đã giải: {problem.accepted_count}</span>
                        <span>Tổng nộp: {problem.submission_count}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProblemSidebar;