import type {IExerciseAdminDetail} from "../../../../../../types/exercise.types.ts";
import type {ILesson} from "../../../../../../types/lesson.types.ts";
import {useEffect, useMemo, useState} from "react";
import {
    AppstoreOutlined, ClockCircleOutlined,
    DeleteOutlined,
    EditOutlined, ExclamationCircleFilled,
    ReadOutlined,
    SearchOutlined,
    UnorderedListOutlined
} from "@ant-design/icons";
import {message, Modal, Skeleton} from "antd";
import {
    useDeleteExerciseMutation,
    useGetAdminLessonExercisesQuery
} from "../../../../../../services/exercise/exercise.service.ts";

const {confirm} = Modal;

interface ExerciseTableProps {
    onEdit: (exercise: IExerciseAdminDetail) => void;
    lessons: ILesson[];
    loading: boolean;
}

const QuestionTable = ({onEdit, lessons, loading}: ExerciseTableProps) => {
    const [selectedLessonId, setSelectedLessonId] = useState<number>(0);
    const [searchQueryExercise, setSearchQueryExercise] = useState('');
    const [searchQueryLesson, setSearchQueryLesson] = useState('');
    const {data: exercises = []} = useGetAdminLessonExercisesQuery(selectedLessonId, {
        skip: selectedLessonId === 0,
        refetchOnMountOrArgChange: true
    });
    const [deleteExercise, {isLoading: isDeleting}] = useDeleteExerciseMutation();

    const handleDelete = (id: number, name: string) => {
        confirm({
            title: 'Xác nhận xóa câu hỏi?',
            icon: <ExclamationCircleFilled/>,
            content: `Bạn có chắc chắn muốn xóa "${name}"? Hành động này không thể hoàn tác.`,
            okText: 'Xóa ngay',
            okType: 'danger',
            cancelText: 'Hủy',
            centered: true,
            async onOk() {
                try {
                    await deleteExercise(id).unwrap();
                    message.success('Đã xóa câu hỏi thành công');
                } catch (error: any) {
                    message.error(error?.data?.message || 'Không thể xóa câu hỏi này');
                }
            },
        });
    };

    const filteredExercises = useMemo(() => {
        if (!exercises) return [];
        return exercises.filter(ex => {
            const searchLower = searchQueryExercise.toLowerCase();
            return ex.question.toLowerCase().includes(searchLower)
        });
    }, [searchQueryExercise, exercises]);

    const filteredLessons = useMemo(() => {
        if (!lessons) return [];
        return lessons.filter(res => {
            const searchLower = searchQueryLesson.toLowerCase();
            return res.title.toLowerCase().includes(searchLower)
        });
    }, [lessons, searchQueryLesson]);

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
        <div className="space-y-8">
            {/* Lesson Cards Selector */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                        <AppstoreOutlined size={18} className="text-emerald-400"/>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Chọn bài học
                            lý</h3>
                    </div>
                    <div className="relative group w-2/3 sm:w-80">
                        <SearchOutlined size={16}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 transition-colors"/>
                        <input
                            type="text"
                            value={searchQueryLesson}
                            onChange={(e) => setSearchQueryLesson(e.target.value)}
                            placeholder="Tìm kiếm bài học"
                            className="w-full pl-11 pr-4 py-2.5 bg-[#0f131a]/60 text-gray-200 rounded-2xl border border-white/10 outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all placeholder-gray-600 shadow-inner text-sm"
                        />
                    </div>
                </div>

                <div className="max-h-[290px] overflow-y-auto pr-2">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredLessons.length > 0 ? (filteredLessons.map((lesson) => (
                            <button
                                key={lesson.lesson_id}
                                onClick={() => setSelectedLessonId(lesson.lesson_id)}
                                className={`group relative flex flex-col p-4 rounded-2xl border transition-all duration-300 text-left overflow-hidden h-full ${
                                    selectedLessonId === lesson.lesson_id
                                        ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/20'
                                        : 'bg-[#0f131a]/40 border-white/5 hover:border-white/20 hover:bg-[#1a202c]/40'
                                }`}
                            >
                                <div
                                    className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center transition-all duration-300 ${
                                        selectedLessonId === lesson.lesson_id ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white/5 text-gray-500'
                                    }`}>
                                    <ReadOutlined size={20}/>
                                </div>
                                <span
                                    className={`text-sm font-bold tracking-tight line-clamp-1 ${selectedLessonId === lesson.lesson_id ? 'text-emerald-400' : 'text-gray-300'}`}>
                    {lesson.title}
                  </span>
                                <div className="flex items-center gap-2 mt-1">
                                    <span
                                        className="text-[10px] text-white font-bold uppercase">{lesson.difficulty_level}</span>
                                </div>
                            </button>
                        ))) : (
                            <td className="px-8 py-8 text-center">
                                <div className="flex flex-col items-center gap-3 opacity-20">
                                    <UnorderedListOutlined size={40} className="text-gray-400"/>
                                    <p className="text-sm font-bold text-gray-300">Không có dữ liệu</p>
                                </div>
                            </td>
                        )}
                    </div>
                </div>
            </div>

            {/* Table Section with Integrated Search */}
            <div className="space-y-4">
                <div className="flex sm:flex-row justify-between items-end sm:items-center gap-4 px-2">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-6 bg-emerald-500 rounded-full"/>
                        <h4 className="text-lg font-bold text-white tracking-tight">Danh sách câu hỏi</h4>
                        <span
                            className="text-xs text-gray-500 font-medium ml-2">({filteredExercises.length} kết quả)</span>
                    </div>

                    {/* Neat Compact Search Bar */}
                    <div className="relative group w-2/3 sm:w-80">
                        <SearchOutlined size={16}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 transition-colors"/>
                        <input
                            type="text"
                            value={searchQueryExercise}
                            onChange={(e) => setSearchQueryExercise(e.target.value)}
                            placeholder="Tìm kiếm câu hỏi"
                            className="w-full pl-11 pr-4 py-2.5 bg-[#0f131a]/60 text-gray-200 rounded-2xl border border-white/10 outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all placeholder-gray-600 shadow-inner text-sm"
                        />
                    </div>
                </div>

                <div
                    className="bg-[#1a202c]/60 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-[11px] text-gray-500 uppercase font-bold bg-black/20 tracking-wider">
                            <tr>
                                <th className="px-8 py-5">Nội dung câu hỏi</th>
                                <th className="px-8 py-5">Bài học</th>
                                <th className="px-8 py-5 text-center">Phân loại</th>
                                <th className="px-8 py-5 text-center">Cập nhật</th>
                                <th className="px-8 py-5 text-right">Thao tác</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                            {filteredExercises.length > 0 ? (
                                filteredExercises.map((ex) => (
                                    <tr key={ex.exercise_id}
                                        className="group hover:bg-white/3 transition-colors duration-300">
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col gap-1">
                          <span className="font-bold text-gray-200 group-hover:text-emerald-300 transition-colors">
                            {ex.question}
                          </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                        <span className="text-xs font-semibold text-gray-400 truncate max-w-[150px] block">
                          {getLessonName(ex.lesson_id)}
                        </span>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                        <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getTypeBadge(ex.exercise_type)}`}>
                          {ex.exercise_type}
                        </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col items-center">
                            <span className="text-gray-400 text-xs flex items-center gap-1">
                                <ClockCircleOutlined size={12} />
                                {formatDateTime(ex.created_at)}
                            </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div
                                                className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                <button
                                                    onClick={() => onEdit(ex)}
                                                    className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-all"
                                                >
                                                    <EditOutlined size={16}/>
                                                </button>
                                                <button
                                                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                                    onClick={() => handleDelete(ex.exercise_id, ex.question)}
                                                    disabled={isDeleting}
                                                >
                                                    <DeleteOutlined size={16}/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-8 py-24 text-center">
                                        <div className="flex flex-col items-center gap-3 opacity-20">
                                            <UnorderedListOutlined size={40} className="text-gray-400"/>
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
    );
}

export default QuestionTable