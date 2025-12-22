import type {IExerciseAdminDetail} from "../../../../../../types/exercise.types.ts";
import type {ILesson} from "../../../../../../types/lesson.types.ts";
import {useEffect, useMemo, useState} from "react";
import {
    CheckCircleOutlined,
    CloseOutlined,
    CodeOutlined, DeleteOutlined,
    DownOutlined,
    EditOutlined, ExclamationCircleFilled,
    FileTextOutlined,
    SearchOutlined
} from "@ant-design/icons";
import {message, Modal, Skeleton} from "antd";
import {
    useDeleteExerciseMutation,
    useGetAdminLessonExercisesQuery
} from "../../../../../../services/exercise/exercise.service.ts";

const { confirm } = Modal;

interface ExerciseTableProps {
    onEdit: (exercise: IExerciseAdminDetail) => void;
    lessons: ILesson[];
    loading: boolean;
}

const ExerciseTable = ({onEdit, lessons, loading}: ExerciseTableProps) => {
    const [selectedLessonId, setSelectedLessonId] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState('');
    const {data: exercises = [], isFetching} = useGetAdminLessonExercisesQuery(selectedLessonId, {
        skip: selectedLessonId === 0,
        refetchOnMountOrArgChange: true
    });
    const [deleteExercise, { isLoading: isDeleting }] = useDeleteExerciseMutation();

    const handleDelete = (id: number | string, question: string) => {
        confirm({
            title: 'Xóa bài tập này?',
            icon: <ExclamationCircleFilled className="text-red-500" />,
            content: (
                <div className="text-gray-400">
                    Bạn có chắc chắn muốn xóa câu hỏi: <br />
                    <span className="text-emerald-400 font-medium">"{question}"</span>? <br />
                    Hành động này không thể hoàn tác.
                </div>
            ),
            okText: 'Xóa ngay',
            okType: 'danger',
            cancelText: 'Hủy',
            centered: true,
            async onOk() {
                try {
                    await deleteExercise(id).unwrap();
                    message.success('Xóa bài tập thành công!');
                } catch (error: any) {
                    message.error(error?.data?.message || 'Lỗi khi xóa bài tập');
                }
            },
        });
    };

    const filteredExercises = useMemo(() => {
        if (!exercises) return [];
        return exercises.filter(ex => {
            const searchLower = searchQuery.toLowerCase();
            return ex.question.toLowerCase().includes(searchLower) ||
                ex.exercise_id.toString().includes(searchLower);
        });
    }, [searchQuery, exercises]);

    const getLessonName = (lessonId: string | number) => {
        if (!lessonId) return 'Tất cả bài học';
        const lesson = lessons.find(l => String(l.lesson_id) === String(lessonId));
        return lesson ? lesson.title : 'Không xác định';
    };

    useEffect(() => {
        if (lessons.length > 0 && !selectedLessonId) {
            setSelectedLessonId(lessons[0].lesson_id);
        }
    }, [lessons]);

    const getTypeBadge = (type: IExerciseAdminDetail['exercise_type']) => {
        switch (type) {
            case 'MULTIPLE_CHOICE':
                return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'TRUE_FALSE':
                return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            default:
                return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

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


    return (
        <div className="space-y-6">
            {/* Selection & Filters Header */}
            <div
                className="bg-[#1a202c]/60 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl p-6 flex lg:flex-row gap-6 items-center">

                {/* Lesson Selector */}
                <div className="w-1/3 lg:w-72 space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Chọn bài
                        học</label>
                    <div className="relative group">
                        <select
                            value={selectedLessonId}
                            onChange={(e) => {
                                console.log(selectedLessonId);
                                setSelectedLessonId(Number(e.target.value))
                            }}
                            className="w-full pl-12 pr-10 py-3 bg-[#0f131a]/50 text-gray-200 rounded-xl border border-white/5 outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none cursor-pointer shadow-inner text-sm transition-all"
                        >
                            <option value="" disabled>T-- Chọn bài học để xem --</option>
                            {lessons.map(lesson => (
                                <option key={lesson.lesson_id} value={lesson.lesson_id}>{lesson.title}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                            <DownOutlined size={16} className="rotate-90"/>
                        </div>
                    </div>
                </div>

                {/* Search Input */}
                <div className="flex-1 w-full space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Tìm kiếm bài
                        tập</label>
                    <div className="relative group">
                        <SearchOutlined size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-400 transition-colors"/>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                console.log(e.target.value);
                                setSearchQuery(e.target.value)
                            }}
                            placeholder="Nhập tên bài tập hoặc ID..."
                            className="w-full pl-12 pr-4 py-3 bg-[#0f131a]/50 text-gray-200 rounded-xl border border-white/5 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder-gray-600 shadow-inner text-sm"
                        />
                    </div>
                </div>

                {/* Filters Summary */}
                <div className="hidden lg:flex flex-col justify-end items-end space-y-1">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Kết quả lọc</span>
                    <div className="flex gap-2">
              <span
                  className="bg-emerald-500/10 text-emerald-400 text-[11px] px-3 py-1 rounded-full border border-emerald-500/20 font-bold">
                {filteredExercises.length} Bài tập
              </span>
                    </div>
                </div>
            </div>

            {/* Exercises Table */}
            <div
                className="bg-[#1a202c]/60 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
                {isFetching && (
                    <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] z-10 flex items-center justify-center">
                        <Skeleton active className="p-10" />
                    </div>
                )}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-400 uppercase bg-black/20">
                        <tr>
                            <th className="px-6 py-5 font-semibold">Bài tập</th>
                            <th className="px-6 py-5 font-semibold">Bài học</th>
                            <th className="px-6 py-5 font-semibold text-center">Loại bài tập</th>
                            <th className="px-6 py-5 font-semibold text-center">Ngày tạo</th>
                            <th className="px-6 py-5 font-semibold text-right">Tác vụ</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                        {filteredExercises.length > 0 ? (
                            filteredExercises.map((ex) => (
                                <tr key={ex.exercise_id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span
                                                className="font-semibold text-gray-200 group-hover:text-emerald-300 transition-colors">{ex.question}</span>
                                            <span
                                                className="text-[10px] text-gray-500 font-mono mt-1 opacity-70 tracking-wider">{ex.exercise_id}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"/>
                                            <span
                                                className="text-xs text-gray-400 max-w-[200px] truncate">{getLessonName(ex.lesson_id)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <div className="flex items-center justify-center">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getTypeBadge(ex.exercise_type)}`}>
                          {ex.exercise_type === 'MULTIPLE_CHOICE' ? <FileTextOutlined size={12} /> : <CheckCircleOutlined size={12} />}
                            {ex.exercise_type}
                        </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                      <span className="text-gray-500 text-xs font-medium">
                        {formatDateTime(ex.created_at)}
                      </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div
                                            className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => onEdit(ex)}
                                                className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-all transform hover:scale-110"
                                            >
                                                <EditOutlined size={18}/>
                                            </button>
                                            <button
                                                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all transform hover:scale-110"
                                                onClick={() => handleDelete(ex.exercise_id, ex.question)}
                                                disabled={isDeleting}
                                            >
                                                <DeleteOutlined size={18}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-20 text-center">
                                    <div className="flex flex-col items-center gap-3 opacity-30">
                                        <CodeOutlined size={48} className="text-gray-400"/>
                                        <p className="text-sm font-medium tracking-wide">Không tìm thấy bài tập nào cho
                                            bài học này</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="h-14 bg-black/10 border-t border-white/5 flex items-center justify-center">
    <span className="text-[11px] text-gray-600 font-bold uppercase tracking-widest">
        {/* Kiểm tra nếu selectedLessonId trống hoặc bằng "all" */}
        {(!selectedLessonId)
            ? 'Tất cả bài học'
            : getLessonName(selectedLessonId)}
        {" - "}
        {filteredExercises.length} bài tập
    </span>
                </div>
            </div>
        </div>
    );
}

export default ExerciseTable