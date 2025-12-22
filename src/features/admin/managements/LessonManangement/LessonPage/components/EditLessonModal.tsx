import { useState, useEffect } from "react";
import { CloseOutlined, LoadingOutlined } from "@ant-design/icons";
import { Skeleton, message } from "antd";
import { useGetLessonQuery, useUpdateLessonMutation } from "../../../../../../services/lesson/lesson.service.ts";
import { useGetCategoriesQuery } from "../../../../../../services/category/category.service.ts";
import type { DifficultyLevel } from "../../../../../../types/lesson.types.ts";
import MDEditor from '@uiw/react-md-editor';

interface EditLessonModalProps {
    isOpen: boolean;
    onClose: () => void;
    lessonId: string | null;
}

const EditLessonModal = ({ isOpen, onClose, lessonId }: EditLessonModalProps) => {
    // 1. Fetch dữ liệu
    const { data: categories = [] } = useGetCategoriesQuery();
    const { data: lesson, isLoading, isFetching } = useGetLessonQuery(lessonId as string, {
        skip: !lessonId || !isOpen,
    });

    const [updateLesson, { isLoading: isUpdating }] = useUpdateLessonMutation();

    // 2. State quản lý Form (Thêm trường content)
    const [formData, setFormData] = useState({
        title: "",
        category_id: "",
        difficulty_level: "BEGINNER" as DifficultyLevel,
        description: "",
        content: "", // Chứa dữ liệu Markdown
    });

    // 3. Đổ dữ liệu vào Form khi có data từ API
    useEffect(() => {
        if (lesson && isOpen) {
            setFormData({
                title: lesson.title,
                category_id: lesson.category?.category_id || "",
                difficulty_level: lesson.difficulty_level,
                description: lesson.description || "",
                content: lesson.content || "", // Đổ nội dung markdown vào editor
            });
        }
    }, [lesson, isOpen]);

    const handleSave = async () => {
        if (!lessonId) return;
        try {
            await updateLesson({
                lessonId,
                data: formData
            }).unwrap();
            message.success("Cập nhật bài học thành công!");
            onClose();
        } catch (error: any) {
            message.error(error?.data?.message || "Lỗi cập nhật bài học");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={onClose} />

            {/* Mở rộng max-w-5xl để phù hợp với Editor */}
            <div className="relative w-full max-w-5xl max-h-[95vh] bg-[#1a202c] rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-8 py-5 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div>
                        <h3 className="text-xl font-bold text-white tracking-wide">Chỉnh sửa nội dung bài học</h3>
                        <p className="text-xs text-gray-500 mt-1 font-mono uppercase">Mã bài học: {lessonId}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                        <CloseOutlined />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                    {isLoading || isFetching ? (
                        <Skeleton active paragraph={{ rows: 10 }} />
                    ) : (
                        <>
                            {/* Row 1: Title & Category */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Tiêu đề bài học</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#0f131a]/50 text-gray-200 rounded-xl border border-white/10 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Chủ đề</label>
                                    <select
                                        value={formData.category_id}
                                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#0f131a]/50 text-gray-200 rounded-xl border border-white/10 focus:ring-2 focus:ring-emerald-500/50 outline-none cursor-pointer"
                                    >
                                        <option value="">Chọn chủ đề</option>
                                        {categories.map(cat => (
                                            <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Row 2: Level & Description */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Mức độ</label>
                                    <select
                                        value={formData.difficulty_level}
                                        onChange={(e) => setFormData({ ...formData, difficulty_level: e.target.value as DifficultyLevel })}
                                        className="w-full px-4 py-3 bg-[#0f131a]/50 text-gray-200 rounded-xl border border-white/10 focus:ring-2 focus:ring-emerald-500/50 outline-none"
                                    >
                                        <option value="BEGINNER">Cơ bản (Beginner)</option>
                                        <option value="INTERMEDIATE">Trung bình (Intermediate)</option>
                                        <option value="ADVANCED">Nâng cao (Advanced)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Mô tả ngắn</label>
                                    <input
                                        type="text"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#0f131a]/50 text-gray-200 rounded-xl border border-white/10 focus:ring-2 focus:ring-emerald-500/50 outline-none"
                                    />
                                </div>
                            </div>

                            {/* UIW Markdown Editor Section */}
                            <div className="space-y-2 flex flex-col min-h-[400px]">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Nội dung bài học (Markdown)</label>
                                <div data-color-mode="dark" className="mt-2 flex-1 rounded-xl overflow-hidden border border-white/10">
                                    <MDEditor
                                        value={formData.content}
                                        onChange={(val) => setFormData(prev => ({ ...prev, content: val || "" }))}
                                        height={450}
                                        preview="live"
                                        className="!bg-[#0f131a] !border-none"
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-white/5 bg-black/20 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:bg-white/5 transition-all">
                        Hủy
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isUpdating || isLoading}
                        className="px-8 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50"
                    >
                        {isUpdating ? <><LoadingOutlined className="mr-2" /> Đang lưu...</> : "Lưu thay đổi"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditLessonModal;