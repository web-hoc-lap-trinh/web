import type {ILesson} from "../../../../../../types/lesson.types.ts";
import {
    AppstoreOutlined,
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleFilled, ReadOutlined,
    SearchOutlined,
    UnorderedListOutlined, UploadOutlined
} from "@ant-design/icons";
import {message, Modal, Skeleton} from "antd";
import {
    useDeleteLessonMutation, useGetAdminLessonsQuery,
    useGetLessonsByCategoryQuery, useUploadLessonMediaMutation
} from "../../../../../../services/lesson/lesson.service.ts";
import {useEffect, useMemo, useRef, useState} from "react";
import type {ICategory} from "../../../../../../types/category.types.ts";

const {confirm} = Modal;

interface LessonTableProps {
    onEdit: (lesson: ILesson) => void;
    categories: ICategory[];
    loading: boolean;
}

const LessonTable = ({onEdit, categories, loading}: LessonTableProps) => {
    const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
    const [searchQueryCategory, setSearchQueryCategory] = useState('');
    const [searchQueryLesson, setSearchQueryLesson] = useState('');
    const [uploadMedia, { isLoading: isUploadingMedia }] = useUploadLessonMediaMutation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeLessonId, setActiveLessonId] = useState<number | null>(null);
    const {data: lessons = []} = useGetAdminLessonsQuery()
    const [deleteLesson, {isLoading: isDeleting}] = useDeleteLessonMutation();

    const filteredCategories = useMemo(() => {
        if (!categories) return [];
        return categories.filter(res => {
            const searchLower = searchQueryCategory.toLowerCase();
            return res.name.toLowerCase().includes(searchLower)
        });
    }, [searchQueryCategory, categories]);

    const filteredLessons = useMemo(() => {
        if (!lessons) return [];
        return lessons.filter(res => {
            const matchesSearch = res.title.toLowerCase().includes(searchQueryLesson.toLowerCase());
            const matchesCategory = selectedCategoryId === 0 || res.category_id === selectedCategoryId;
            return matchesSearch && matchesCategory;
        });
    }, [lessons, searchQueryLesson, selectedCategoryId]);

    /*useEffect(() => {
        if (categories.length > 0 && !selectedCategoryId) {
            setSelectedCategoryId(categories[0].category_id);
        }
    }, [categories]);*/

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !activeLessonId) return;

        const hide = message.loading("Đang tải tệp lên...", 0);
        try {
            // Gọi mutation (giả sử backend của bạn cần LessonID hoặc chỉ cần upload lấy URL)
            const imageUrl = await uploadMedia(file).unwrap();

            message.success("Tải lên thành công!");
            console.log("Link ảnh mới:", imageUrl);

            // Lưu ý: Sau khi upload thành công, bạn có thể cần gọi thêm một API
            // để cập nhật lesson_id đó với imageUrl này nếu backend chưa tự động làm.
        } catch (error: any) {
            message.error(error?.data?.message || "Lỗi khi tải tệp lên");
        } finally {
            hide();
            setActiveLessonId(null);
            if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
        }
    };

    const triggerUpload = (lessonId: number) => {
        setActiveLessonId(lessonId);
        fileInputRef.current?.click();
    };

    const handleDelete = (id: number, name: string) => {
        confirm({
            title: 'Xác nhận xóa bài học?',
            icon: <ExclamationCircleFilled />,
            content: `Bạn có chắc chắn muốn xóa "${name}"? Hành động này không thể hoàn tác.`,
            okText: 'Xóa ngay',
            okType: 'danger',
            cancelText: 'Hủy',
            centered: true,
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

    return (
        <div className="space-y-8">
            {/* Glassmorphism Card Container */}
            {/* Header Controls */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                        <AppstoreOutlined size={18} className="text-emerald-400" />
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Chọn chủ đề cần quản lý</h3>
                    </div>
                    <div className="relative group w-2/3 sm:w-80">
                        <SearchOutlined size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                        <input
                            type="text"
                            value={searchQueryCategory}
                            onChange={(e) => setSearchQueryCategory(e.target.value)}
                            placeholder="Tìm kiếm bài học"
                            className="w-full pl-11 pr-4 py-2.5 bg-[#0f131a]/60 text-gray-200 rounded-2xl border border-white/10 outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all placeholder-gray-600 shadow-inner text-sm"
                        />
                    </div>
                </div>

                <div className="max-h-[290px] overflow-y-auto pr-2">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        <button
                            key={0}
                            onClick={() => setSelectedCategoryId(0)}
                            className={`group relative flex flex-col p-4 rounded-[24px] border transition-all duration-300 text-left overflow-hidden h-full ${
                                selectedCategoryId === 0
                                    ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/20'
                                    : 'bg-[#0f131a]/40 border-white/5 hover:border-white/20 hover:bg-[#1a202c]/40'
                            }`}
                        >
                            <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center transition-all duration-300 ${
                                selectedCategoryId === 0 ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white/5 text-gray-500'
                            }`}>
                                <ReadOutlined size={20} />
                            </div>
                            <span className={`text-sm font-bold tracking-tight line-clamp-1 ${selectedCategoryId === 0 ? 'text-emerald-400' : 'text-gray-300'}`}>
                                    All
                                </span>
                        </button>
                        {filteredCategories.length > 0 ? (filteredCategories.map((category) => (
                            <button
                                key={category.category_id}
                                onClick={() => setSelectedCategoryId(category.category_id)}
                                className={`group relative flex flex-col p-4 rounded-[24px] border transition-all duration-300 text-left overflow-hidden h-full ${
                                    selectedCategoryId === category.category_id
                                        ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/20'
                                        : 'bg-[#0f131a]/40 border-white/5 hover:border-white/20 hover:bg-[#1a202c]/40'
                                }`}
                            >
                                <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center transition-all duration-300 ${
                                    selectedCategoryId === category.category_id ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white/5 text-gray-500'
                                }`}>
                                    <ReadOutlined size={20} />
                                </div>
                                <span className={`text-sm font-bold tracking-tight line-clamp-1 ${selectedCategoryId === category.category_id ? 'text-emerald-400' : 'text-gray-300'}`}>
                                    {category.name}
                                </span>
                                <div className="flex items-center gap-2 mt-1">
                                    <span
                                        className="text-[9px] text-gray-600 font-bold uppercase">{category.is_active ? "ACTIVE" : "INACTIVE"}</span>
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
                        <h4 className="text-lg font-bold text-white tracking-tight">Danh sách bài học</h4>
                        <span className="text-xs text-gray-500 font-medium ml-2">({filteredLessons.length} kết quả)</span>
                    </div>

                    {/* Neat Compact Search Bar */}
                    <div className="relative group w-2/3 sm:w-80">
                        <SearchOutlined size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                        <input
                            type="text"
                            value={searchQueryLesson}
                            onChange={(e) => setSearchQueryLesson(e.target.value)}
                            placeholder="Tìm kiếm câu hỏi"
                            className="w-full pl-11 pr-4 py-2.5 bg-[#0f131a]/60 text-gray-200 rounded-2xl border border-white/10 outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all placeholder-gray-600 shadow-inner text-sm"
                        />
                    </div>
                </div>

                <div className="bg-[#1a202c]/60 backdrop-blur-xl rounded-[32px] border border-white/5 shadow-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-400 uppercase bg-black/20">
                            <tr>
                                {/*<th className="px-6 py-5 font-semibold tracking-wider text-gray-500">Mã bài học</th>*/}
                                <th className="px-6 py-5 font-semibold tracking-wider text-gray-500">Tên bài học</th>
                                <th className="px-6 py-5 font-semibold tracking-wider text-gray-500 text-center">Mức độ</th>
                                <th className="px-6 py-5 font-semibold tracking-wider text-gray-500 text-center">Thời gian
                                </th>
                                <th className="px-6 py-5 font-semibold tracking-wider text-gray-500">Trạng thái</th>
                                <th className="px-6 py-5 font-semibold tracking-wider text-gray-500 text-center"></th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                            {filteredLessons.length > 0 ? (
                                    filteredLessons.map((lesson) => {
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
                                            <td className="px-6 py-5 text-center">
                            <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${getLevelBadge(lesson.difficulty_level)}`}>
                              {lesson.difficulty_level}
                            </span>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                            <span className="text-gray-500 text-[10px] font-bold">
                              {formatDateTime(lesson.updated_at)}
                            </span>
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
                                            <td className="px-6 py-5 text-center">
                                                <div
                                                    className="p-2.5 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => triggerUpload(lesson.lesson_id) } // Thay đổi ở đây
                                                        disabled={isUploadingMedia}
                                                        className={`p-2 rounded-lg transition-all transform hover:scale-110 ${
                                                            isUploadingMedia ? 'text-gray-600' : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10'
                                                        }`}
                                                    >
                                                        <UploadOutlined size={18}/>
                                                    </button>
                                                    <button
                                                        onClick={() => onEdit(lesson)}
                                                        className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-all transform hover:scale-110"
                                                    >
                                                        <EditOutlined size={18}/>
                                                    </button>
                                                    <button
                                                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all transform hover:scale-110"
                                                        onClick={() => handleDelete(lesson.lesson_id, lesson.title)}
                                                        disabled={isDeleting}
                                                    >
                                                        <DeleteOutlined size={18}/>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                                ) : (
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
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*,video/*" // Tùy chỉnh loại tệp bạn muốn
                onChange={handleFileChange}
            />
        </div>
    )
}

export default LessonTable