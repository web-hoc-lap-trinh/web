import type {ILesson} from "../../../../../../types/lesson.types.ts";
import {
    DeleteOutlined,
    DownOutlined,
    EditOutlined,
    ExclamationCircleFilled,
    SearchOutlined,
    SortAscendingOutlined
} from "@ant-design/icons";
import {message, Modal, Skeleton} from "antd";
import {useDeleteLessonMutation} from "../../../../../../services/lesson/lesson.service.ts";

const {confirm} = Modal;

interface LessonTableProps {
    onEdit: (lesson: ILesson) => void;
    lessons: ILesson[];
    loading: boolean;
}

const LessonTable = ({onEdit, lessons, loading}: LessonTableProps) => {
    const [deleteLesson, {isLoading: isDeleting}] = useDeleteLessonMutation();

    const showDeleteConfirm = (id: string, title: string) => {
        confirm({
            title: 'Xác nhận xóa bài học?',
            icon: <ExclamationCircleFilled/>,
            content: (
                <div className="text-gray-300">
                    Bạn có chắc chắn muốn xóa bài học <span className="text-emerald-400 font-bold">"{title}"</span>?
                    Hành động này không thể hoàn tác.
                </div>
            ),
            okText: 'Xóa ngay',
            okType: 'danger',
            cancelText: 'Hủy',
            centered: true,
            // Style cho Modal confirm để hợp với theme Dark
            className: "dark-confirm-modal",
            async onOk() {
                try {
                    await deleteLesson(id).unwrap();
                    message.success('Đã xóa bài học thành công');
                } catch (error: any) {
                    message.error(error?.data?.message || 'Không thể xóa bài học này');
                }
            },
        });
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({length: 6}).map((_, idx) => (
                    <Skeleton
                        key={idx}
                        active
                        className="bg-white/5! rounded-2xl! p-5!"
                        paragraph={{rows: 3}}
                    />
                ))}
            </div>
        );
    }

    const getLevelBadge = (level: ILesson['difficulty_level']) => {
        switch (level) {
            case 'BEGINNER':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'INTERMEDIATE':
                return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'ADVANCED':
                return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            default:
                return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        const timeStr = date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        const dateStr = date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        return {timeStr, dateStr};
    };

    return (
        <div className="relative">
            {/* Glassmorphism Card Container */}
            <div
                className="bg-[#1a202c]/60 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl overflow-hidden">

                {/* Header Controls */}
                <div
                    className="p-6 border-b border-white/5 flex sm:flex-row gap-5 justify-between items-center bg-white/5">
                    <div className="relative flex-1 w-full sm:max-w-md group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <SearchOutlined
                                className="text-gray-400 group-focus-within:text-emerald-400 transition-colors"
                                size={18}/>
                        </div>
                        <input
                            type="text"
                            placeholder="Tìm kiếm bài học, chủ đề..."
                            className="w-full pl-11 pr-4 py-3 bg-[#0f131a]/50 text-gray-200 rounded-xl border border-white/5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-[#0f131a] focus:border-emerald-500/30 transition-all placeholder-gray-500 shadow-inner"
                        />
                    </div>

                    {/*<div className="flex gap-3">
                        <button
                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                            <SortAscendingOutlined size={16}/>
                            <span>Bộ lọc</span>
                        </button>
                        <button
                            className="flex items-center gap-2 px-5 py-2.5 bg-[#2d3748]/50 text-gray-200 rounded-xl text-sm font-medium hover:bg-[#2d3748] border border-white/5 hover:border-white/10 shadow-lg shadow-black/20 transition-all">
                            Gần đây nhất
                            <DownOutlined size={16} className="text-gray-400"/>
                        </button>
                    </div>*/}
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-400 uppercase bg-black/20">
                        <tr>
                            {/*<th className="px-6 py-5 font-semibold tracking-wider text-gray-500">Mã bài học</th>*/}
                            <th className="px-6 py-5 font-semibold tracking-wider text-gray-500">Tên bài học</th>
                            <th className="px-6 py-5 font-semibold tracking-wider text-gray-500">Chủ đề</th>
                            <th className="px-6 py-5 font-semibold tracking-wider text-gray-500 text-center">Mức độ</th>
                            <th className="px-6 py-5 font-semibold tracking-wider text-gray-500 text-center">Thời gian
                            </th>
                            <th className="px-6 py-5 font-semibold tracking-wider text-gray-500">Trạng thái</th>
                            <th className="px-6 py-5 font-semibold tracking-wider text-gray-500 text-right"></th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                        {lessons.map((lesson) => {
                            const {timeStr, dateStr} = formatDateTime(lesson.updated_at);
                            return (
                                <tr key={lesson.lesson_id}
                                    className="group hover:bg-white/[0.02] transition-colors duration-200">
                                    {/*<td className="px-6 py-5">
                    <span
                        className="font-mono text-xs text-emerald-400/80 bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20">
                      {lesson.lesson_id}
                    </span>
                                    </td>*/}
                                    <td className="px-6 py-5">
                                        <div
                                            className="font-semibold text-gray-200 group-hover:text-emerald-300 transition-colors">
                                            {lesson.title}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                    <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/5 text-gray-400 border border-white/10">
                      {lesson.category.name}
                    </span>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                    <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${getLevelBadge(lesson.difficulty_level)}`}>
                      {lesson.difficulty_level}
                    </span>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <div className="flex flex-col items-center">
                                            <span
                                                className="text-gray-300 font-medium text-xs bg-white/5 px-2 py-0.5 rounded-md mb-1">{timeStr}</span>
                                            <span
                                                className="text-gray-600 text-[10px] font-medium tracking-wide">{dateStr}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full shadow-[0_0_8px] ${
                                                lesson.is_published ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-gray-500 shadow-gray-500/50'
                                            }`}/>
                                            <span className={`text-sm font-medium ${
                                                lesson.is_published ? 'text-emerald-100' : 'text-gray-500'
                                            }`}>
                                                {/* Chỉnh sửa hiển thị text trạng thái */}
                                                {lesson.is_published ? 'Đã xuất bản' : 'Bản nháp'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div
                                            className="p-2.5 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => onEdit(lesson)}
                                                className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-all transform hover:scale-110"
                                            >
                                                <EditOutlined size={18}/>
                                            </button>
                                            <button
                                                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all transform hover:scale-110"
                                                onClick={() => showDeleteConfirm(lesson.lesson_id, lesson.title)}
                                                disabled={isDeleting}
                                            >
                                                <DeleteOutlined size={18}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination placeholder with soft style */}
                <div className="h-14 bg-black/20 border-t border-white/5 flex items-center justify-center">
                    <span className="text-xs text-gray-600 font-medium">Hiển thị {lessons.length} bài học</span>
                </div>
            </div>
        </div>
    )
}

export default LessonTable