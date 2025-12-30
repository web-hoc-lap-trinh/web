import type {Difficulty, IProblem} from "../../../../../../types/problem.types.ts";
import {useMemo, useState} from "react";
import {Button, Input, message, Modal, Pagination, Select} from "antd";
import {
    AppstoreOutlined,
    ClockCircleOutlined, DeleteOutlined,
    EditOutlined, ExclamationCircleFilled,
    EyeInvisibleOutlined,
    EyeOutlined, ReadOutlined, ReloadOutlined,
    TrophyOutlined, UnorderedListOutlined
} from "@ant-design/icons";
import {
    useDeleteProblemMutation,
    useTriggerDailyChallengeMutation
} from "../../../../../../services/problem/problem.service.ts";
import type {ITag} from "../../../../../../types/tag.types.ts";

interface ProblemTableProps {
    onEdit: (problem: IProblem) => void;
    tags: ITag[];
    problems: IProblem[];
    loading: boolean;
    total: number;
    currentPage: number;
    pageSize: number;
    onPageChange: (page: number, pageSize: number) => void;
    selectedTagId: number;
    setSelectedTagId: (selectedTag: number) => void;
    searchProblemValue: string;
    onSearchProblemChange: (value: string) => void;
    sortValue: string | undefined;
    onSortValue: (sort: string | undefined) => void;
    difficultySortValue: string | undefined;
    onDifficultySortChange: (selectedTag: string | undefined) => void;
    orderValue: string | undefined;
    onOrderValue: (order: string | undefined) => void;
}

const {confirm} = Modal;

const ProblemTable = ({
    onEdit,
    tags,
    problems,
    loading,
    total,
    currentPage,
    pageSize,
    onPageChange,
    selectedTagId,
    setSelectedTagId,
    searchProblemValue,
    onSearchProblemChange,
    sortValue,
    onSortValue,
    difficultySortValue,
    onDifficultySortChange,
    orderValue,
    onOrderValue,
}: ProblemTableProps) => {
    const [triggerDailyChallenge] = useTriggerDailyChallengeMutation()
    const [deleteProblem, {isLoading: isDeleting}] = useDeleteProblemMutation();
    const [searchQueryTag, setSearchQueryTag] = useState('');

    const filteredTags = useMemo(() => {
        if (!tags) return [];
        return tags.filter(res => {
            const searchLower = searchQueryTag.toLowerCase();
            return res.name.toLowerCase().includes(searchLower)
        });
    }, [searchQueryTag, tags]);

    /*useEffect(() => {
        if (tags.length > 0 && !selectedTagId) {
            setSelectedTagId(tags[0].tag_id);
        }
    }, [selectedTagId, tags]);*/

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

    /*if (loading) {
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
    }*/

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                        <AppstoreOutlined size={18} className="text-emerald-400" />
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Chọn nhãn cần quản lý</h3>
                    </div>
                    <Input.Search
                        size={"large"}
                        type="text"
                        value={searchQueryTag}
                        onChange={(e) => setSearchQueryTag(e.target.value)}
                        placeholder="Tìm kiếm nhãn..."
                        style={{ width: '18%' }}
                    />
                </div>

                <div className="max-h-[290px] overflow-y-auto pr-2">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        <button
                            key={0}
                            onClick={() => setSelectedTagId(0)}
                            className={`group relative flex flex-col p-4 rounded-2xl border transition-all duration-300 text-left overflow-hidden h-full ${
                                selectedTagId === 0
                                    ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/20'
                                    : 'bg-[#0f131a]/40 border-white/5 hover:border-white/20 hover:bg-[#1a202c]/40'
                            }`}
                        >
                            <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center transition-all duration-300 ${
                                selectedTagId === 0 ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white/5 text-gray-500'
                            }`}>
                                <ReadOutlined size={20} />
                            </div>
                            <span className={`text-sm font-bold tracking-tight line-clamp-1 ${selectedTagId === 0 ? 'text-emerald-400' : 'text-gray-300'}`}>
                                    All
                                </span>
                        </button>
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
                        <span className="text-xs text-gray-500 font-medium ml-2">({problems.length} kết quả)</span>
                    </div>

                    <div className="flex justify-end items-center gap-2">
                        <Select
                            size={"large"}
                            value={sortValue}
                            allowClear={true}
                            style={{ width: 150 }}
                            onChange={(e) => onSortValue(e)}
                            options={[
                                { value: 'created_at', label: 'Ngày tạo' },
                                { value: 'title', label: 'Tựa đề' },
                                { value: 'difficulty', label: 'Mức độ' },
                                { value: 'submission_count', label: 'Tổng bài nộp' },
                                { value: 'accepted_count', label: 'Tổng bài đúng' }
                            ]}
                        />
                        <Select
                            size={"large"}
                            value={difficultySortValue}
                            allowClear={true}
                            style={{ width: 120 }}
                            onChange={(e) => onDifficultySortChange(e)}
                            options={[
                                { value: 'EASY', label: 'Easy' },
                                { value: 'MEDIUM', label: 'Medium' },
                                { value: 'HARD', label: 'Hard' },
                            ]}
                        />
                        <Select
                            size={"large"}
                            value={orderValue}
                            allowClear={true}
                            style={{ width: 120 }}
                            onChange={(e) => onOrderValue(e)}
                            options={[
                                { value: 'ASC', label: 'Tăng dần' },
                                { value: 'DESC', label: 'Giảm dần' }
                            ]}
                        />
                        <Button size={"large"} onClick={handleTrigger}>
                            <ReloadOutlined size={20} />
                        </Button>
                        <Input.Search
                            size={"large"}
                            type="text"
                            value={searchProblemValue}
                            onChange={(e) => onSearchProblemChange(e.target.value)}
                            placeholder="Tìm tiêu đề bài đăng..."
                            loading={loading}
                            style={{ width: '40%' }}
                        />
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
                                    <th className="px-6 py-5"></th> {/* No header text for actions */}
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                {problems.length > 0 ? (problems.map((ex) => (
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
                                {formatDateTime(ex.created_at)}
                            </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                                                <p className="text-sm font-bold text-gray-300">{loading ? "Đang tải dữ liệu" : "Không có dữ liệu"}</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-8 py-5 border-t border-white/5 bg-black/20 flex items-center justify-between">
                            <div className="text-xs text-gray-500 font-medium">
                                Hiển thị <span className="text-emerald-400">{problems.length}</span> trên <span className="text-emerald-400">{total}</span> bài tập
                            </div>
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={total}
                                onChange={onPageChange}
                                showSizeChanger={false} // Tắt nếu bạn muốn fix cứng limit
                                className="dark-pagination" // CSS custom bên dưới
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProblemTable