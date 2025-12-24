import type {Difficulty, IProblem} from "../../../../../../types/problem.types.ts";
import {useState} from "react";
import {message, Modal, Skeleton} from "antd";
import {
    ClockCircleOutlined, DeleteOutlined,
    DownOutlined, EditOutlined, ExclamationCircleFilled,
    EyeInvisibleOutlined,
    EyeOutlined,
    SearchOutlined,
    TrophyOutlined
} from "@ant-design/icons";
import {useDeleteProblemMutation} from "../../../../../../services/problem/problem.service.ts";

interface ProblemTableProps {
    onEdit: (problem: IProblem) => void;
    problems: IProblem[];
    loading: boolean;
}

const {confirm} = Modal;

const ProblemTable = ({onEdit, problems, loading}: ProblemTableProps) => {
    const [deleteProblem, {isLoading: isDeleting}] = useDeleteProblemMutation();
    const [searchQuery, setSearchQuery] = useState('');

    const filtered = problems.filter(ex =>
        ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.problem_id
    );

    const formatDateTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getDifficultyBadge = (diff: Difficulty) => {
        switch (diff) {
            case 'EASY': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'MEDIUM': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'HARD': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    const showDeleteConfirm = (id: number, name: string) => {
        confirm({
            title: 'Xác nhận xóa bài tập?',
            icon: <ExclamationCircleFilled />,
            content: `Bạn có chắc chắn muốn xóa "${name}"? Hành động này không thể hoàn tác.`,
            okText: 'Xóa ngay',
            okType: 'danger',
            cancelText: 'Hủy',
            centered: true,
            async onOk() {
                try {
                    await deleteProblem(id).unwrap();
                    message.success('Đã xóa chủ đề thành công');
                } catch (error: any) {
                    message.error(error?.data?.message || 'Không thể xóa chủ đề này');
                }
            },
        });
    };

    if (loading) {
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

    return (
        <div className="space-y-6">
            <div className="bg-[#1a202c]/60 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl p-6 flex md:row-between gap-4 items-center">
                <div className="relative flex-1 w-full group">
                    <SearchOutlined size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm kiếm bài tập thực hành..."
                        className="w-full pl-12 pr-4 py-3 bg-[#0f131a]/50 text-gray-200 rounded-xl border border-white/5 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder-gray-600 shadow-inner text-sm"
                    />
                </div>
                {/*<button className="flex items-center gap-2 px-5 py-3 bg-[#2d3748]/50 text-gray-200 rounded-xl text-sm font-medium hover:bg-[#2d3748] border border-white/5 transition-all">
                    <DownOutlined size={16} />
                    Lọc nâng cao
                </button>*/}
            </div>

            <div className="bg-[#1a202c]/60 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-400 uppercase bg-black/20">
                        <tr>
                            <th className="px-6 py-5 font-semibold">Tên bài tập</th>
                            <th className="px-6 py-5 font-semibold text-center">Độ khó</th>
                            <th className="px-6 py-5 font-semibold text-center">Điểm</th>
                            <th className="px-6 py-5 font-semibold text-center">Trạng thái</th>
                            <th className="px-6 py-5 font-semibold text-center">Ngày tạo</th>
                            <th className="px-6 py-5 font-semibold"></th> {/* No header text for actions */}
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                        {filtered.map((ex) => (
                            <tr key={ex.problem_id} className="group hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-5">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-200 group-hover:text-emerald-300 transition-colors">{ex.title}</span>
                                        <span className="text-[10px] text-gray-500 font-mono mt-0.5 opacity-70 uppercase tracking-widest">{ex.problem_id}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getDifficultyBadge(ex.difficulty)}`}>
                      {ex.difficulty}
                    </span>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <div className="flex items-center justify-center gap-1.5 text-amber-400 font-bold">
                                        <TrophyOutlined size={14} />
                                        {ex.points}
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <div className="flex items-center justify-center">
                                        {ex.is_published ? (
                                            <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg border border-emerald-400/20">
                                                <EyeOutlined size={14} />
                                                <span className="text-[10px] font-bold uppercase">Public</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-gray-500 bg-gray-500/10 px-2 py-1 rounded-lg border border-gray-500/20">
                                                <EyeInvisibleOutlined size={14} />
                                                <span className="text-[10px] font-bold uppercase">Draft</span>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <div className="flex flex-col items-center">
                       <span className="text-gray-400 text-xs flex items-center gap-1">
                         <ClockCircleOutlined size={12} />
                           {formatDateTime(ex.created_at)}
                       </span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => onEdit(ex)}
                                            className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-all"
                                        >
                                            <EditOutlined size={18} />
                                        </button>
                                        <button
                                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                            onClick={() => showDeleteConfirm(ex.problem_id, ex.title)}
                                            disabled={isDeleting}
                                        >
                                            <DeleteOutlined size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ProblemTable