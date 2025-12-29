import type {Difficulty, IProblem} from "../../../../../../types/problem.types.ts";
import {useEffect, useMemo, useState} from "react";
import {Button, message, Modal, Skeleton} from "antd";
import {
    AppstoreOutlined,
    ClockCircleOutlined, DeleteOutlined,
    EditOutlined, ExclamationCircleFilled,
    EyeInvisibleOutlined,
    EyeOutlined, ReadOutlined, ReloadOutlined,
    SearchOutlined,
    TrophyOutlined, UnorderedListOutlined
} from "@ant-design/icons";
import {
    useDeleteProblemMutation,
    useTriggerDailyChallengeMutation
} from "../../../../../../services/problem/problem.service.ts";
import {useGetProblemsByTagQuery} from "../../../../../../services/tag/tag.service.ts";
import type {GetTagProblemsParams} from "../../../../../../services/tag/tag.types.ts";
import type {ITag} from "../../../../../../types/tag.types.ts";

interface ProblemTableProps {
    onEdit: (problem: IProblem) => void;
    tags: ITag[];
    loading: boolean;
}

const {confirm} = Modal;

const ProblemTable = ({onEdit, tags, loading}: ProblemTableProps) => {
    const [triggerDailyChallenge] = useTriggerDailyChallengeMutation()
    const [deleteProblem, {isLoading: isDeleting}] = useDeleteProblemMutation();
    const [selectedTagId, setSelectedTagId] = useState<number>(0);
    const [searchQueryTag, setSearchQueryTag] = useState('');
    const [searchQueryProblem, setSearchQueryProblem] = useState('');
    const params: GetTagProblemsParams = {
        id: selectedTagId,
    }
    const {data} = useGetProblemsByTagQuery(params, {
        skip: selectedTagId === 0,
    });
    
    const filteredTags = useMemo(() => {
        if (!tags) return [];
        return tags.filter(res => {
            const searchLower = searchQueryTag.toLowerCase();
            return res.name.toLowerCase().includes(searchLower)
        });
    }, [searchQueryTag, tags]);

    const filteredProblems = useMemo(() => {
        const problems = data?.items || [];
        if (!problems) return [];
        return problems.filter(res => {
            const searchLower = searchQueryProblem.toLowerCase();
            return res.title.toLowerCase().includes(searchLower)
        });
    }, [data?.items, searchQueryProblem]);

    useEffect(() => {
        if (tags.length > 0 && !selectedTagId) {
            setSelectedTagId(tags[0].tag_id);
        }
    }, [selectedTagId, tags]);

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

    const handleTrigger = async () => {
        try {
            await triggerDailyChallenge();
            message.success("Đã cập nhật Daily Challenge!");
        } catch (error) {
            message.error(`Không thể cập nhật Daily Challenge. Vui lòng thử lại. [${error}]`);
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
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                        <AppstoreOutlined size={18} className="text-emerald-400" />
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Chọn nhãn cần quản lý</h3>
                    </div>
                    <div className="relative group w-2/3 sm:w-80">
                        <SearchOutlined size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                        <input
                            type="text"
                            value={searchQueryTag}
                            onChange={(e) => setSearchQueryTag(e.target.value)}
                            placeholder="Tìm kiếm nhãn"
                            className="w-full pl-11 pr-4 py-2.5 bg-[#0f131a]/60 text-gray-200 rounded-2xl border border-white/10 outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all placeholder-gray-600 shadow-inner text-sm"
                        />
                    </div>
                </div>

                <div className="max-h-[290px] overflow-y-auto pr-2">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredTags.length > 0 ? (filteredTags.map((tag) => (
                            <button
                                key={tag.tag_id}
                                onClick={() => setSelectedTagId(tag.tag_id)}
                                className={`group relative flex flex-col p-4 rounded-2xl border transition-all duration-300 text-left overflow-hidden h-full ${
                                    selectedTagId === tag.tag_id
                                        ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/20'
                                        : 'bg-[#0f131a]/40 border-white/5 hover:border-white/20 hover:bg-[#1a202c]/40'
                                }`}
                            >
                                <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center transition-all duration-300 ${
                                    selectedTagId === tag.tag_id ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white/5 text-gray-500'
                                }`}>
                                    <ReadOutlined size={20} />
                                </div>
                                <span className={`text-sm font-bold tracking-tight line-clamp-1 ${selectedTagId === tag.tag_id ? 'text-emerald-400' : 'text-gray-300'}`}>
                                    {tag.name}
                                </span>
                                <div className="flex items-center gap-2 mt-1">
                                    <span
                                        className="text-[10px] text-white font-bold uppercase">{tag.is_active ? "ACTIVE" : "INACTIVE"}</span>
                                </div>
                            </button>
                        ))) : (
                            <td className="px-8 py-8 text-center">
                                <div className="flex flex-col items-center gap-3 opacity-20">
                                    <UnorderedListOutlined size={40} className="text-gray-400" />
                                    <p className="text-sm font-bold text-gray-300">Không có dữ liệu</p>
                                </div>
                            </td>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex sm:flex-row justify-between items-end sm:items-center gap-4 px-2">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-6 bg-emerald-500 rounded-full" />
                        <h4 className="text-lg font-bold text-white tracking-tight">Danh sách bài tập</h4>
                        <span className="text-xs text-gray-500 font-medium ml-2">({filteredProblems.length} kết quả)</span>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Neat Compact Search Bar */}
                        <div className="relative group w-2/3 sm:w-80">
                            <SearchOutlined size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                            <input
                                type="text"
                                value={searchQueryProblem}
                                onChange={(e) => setSearchQueryProblem(e.target.value)}
                                placeholder="Tìm kiếm câu hỏi"
                                className="w-full pl-11 pr-4 py-2.5 bg-[#0f131a]/60 text-gray-200 rounded-2xl border border-white/10 outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all placeholder-gray-600 shadow-inner text-sm"
                            />
                        </div>
                        <Button onClick={handleTrigger}>
                            <ReloadOutlined size={20} />
                        </Button>
                    </div>
                </div>

                <div className="bg-[#1a202c]/60 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
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
                                {filteredProblems.length > 0 ? (filteredProblems.map((ex) => (
                                    <tr key={ex.problem_id} className="group hover:bg-white/2 transition-colors">
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
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col items-center">
                            <span className="text-gray-400 text-xs flex items-center gap-1">
                                <ClockCircleOutlined size={12} />
                                {formatDateTime(ex.updated_at)}
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
                                ))) : (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-24 text-center">
                                            <div className="flex flex-col items-center gap-3 opacity-20">
                                                <UnorderedListOutlined size={40} className="text-gray-400" />
                                                <p className="text-sm font-bold text-gray-300">Không có dữ liệu</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProblemTable