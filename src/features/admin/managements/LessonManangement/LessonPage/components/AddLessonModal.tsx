import { useState } from "react";
import { CloseOutlined, LoadingOutlined } from "@ant-design/icons";
import { message } from "antd";
import { useCreateLessonMutation } from "../../../../../../services/lesson/lesson.service.ts";
import { useGetCategoriesQuery } from "../../../../../../services/category/category.service.ts";
import type { DifficultyLevel } from "../../../../../../types/lesson.types.ts";
import MDEditor from '@uiw/react-md-editor';
import {createPortal} from "react-dom";
import type {CreateTryItYourselfPayload} from "../../../../../../services/try-it-yourself/try-it-yourself.types.ts";
import {
    useCreateLessonTryItYourselfMutation
} from "../../../../../../services/try-it-yourself/try-it-yourself.service.ts";
import TextEditor from "../../../../../../components/common/TextEditor.tsx";

interface AddLessonModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddLessonModal = ({ isOpen, onClose }: AddLessonModalProps) => {
    const { data: categories = [] } = useGetCategoriesQuery();
    const [createLesson, { isLoading: isCreating }] = useCreateLessonMutation();
    const [createTIY] = useCreateLessonTryItYourselfMutation();

    const [formData, setFormData] = useState({
        title: "",
        category_id: "",
        difficulty_level: "BEGINNER" as DifficultyLevel,
        description: "",
        content: "",
    });

    const handleClose = () => {
        setFormData({ title: "", category_id: "", difficulty_level: "BEGINNER", description: "", content: "" });
        onClose();
    };

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.content) {
            return message.warning("Vui lòng điền đầy đủ tiêu đề và nội dung!");
        }
        try {
            const res = await createLesson(formData).unwrap();
            const payload: CreateTryItYourselfPayload = {
                language_code: 'cpp',
                example_code: "a"
            }
            await createTIY({
                lessonId: res.lesson_id,
                data: payload,
            });
            message.success("Tạo bài học thành công!");
            handleClose();
        } catch (error: any) {
            message.error(error?.data?.message || "Lỗi khi tạo bài học");
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={handleClose} />

            <div className="relative w-full max-w-5xl max-h-[95vh] bg-[#1a202c] rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col animate-in zoom-in-95">

                {/* Header */}
                <div className="px-8 py-5 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <h3 className="text-xl font-bold text-white tracking-tight">Soạn thảo bài học mới</h3>
                    <button onClick={handleClose} className="p-2 text-gray-400 hover:text-white transition-colors">
                        <CloseOutlined size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">Tiêu đề bài học</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    placeholder="Nhập tiêu đề..."
                                    className="w-full mt-2 px-4 py-3 bg-[#0f131a]/50 text-gray-200 rounded-xl border border-white/10 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">Chủ đề</label>
                                <select
                                    value={formData.category_id}
                                    onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                                    className="w-full mt-2 px-4 py-3 bg-[#0f131a]/50 text-gray-200 rounded-xl border border-white/10 outline-none cursor-pointer"
                                >
                                    <option value="">-- Chọn chủ đề --</option>
                                    {categories.map(cat => <option key={cat.category_id} value={cat.category_id} className="bg-[#1a202c]">{cat.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">Mức độ</label>
                                <select
                                    value={formData.difficulty_level}
                                    onChange={(e) => setFormData({...formData, difficulty_level: e.target.value as DifficultyLevel})}
                                    className="w-full mt-2 px-4 py-3 bg-[#0f131a]/50 text-gray-200 rounded-xl border border-white/10 outline-none"
                                >
                                    <option value="BEGINNER">Cơ bản</option>
                                    <option value="INTERMEDIATE">Trung bình</option>
                                    <option value="ADVANCED">Nâng cao</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">Mô tả ngắn</label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    placeholder="Tóm tắt nội dung..."
                                    className="w-full mt-2 px-4 py-3 bg-[#0f131a]/50 text-gray-200 rounded-xl border border-white/10 focus:ring-2 focus:ring-emerald-500/50 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* UIW Markdown Editor */}
                    <TextEditor
                        value={formData.content}
                        onChange={(val) => handleChange('content', val)}/>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-white/5 bg-black/20 flex justify-end gap-3">
                    <button onClick={handleClose} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:bg-white/5 transition-all">Hủy</button>
                    <button
                        onClick={handleSubmit}
                        disabled={isCreating}
                        className="px-8 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50"
                    >
                        {isCreating ? <LoadingOutlined className="mr-2" /> : "Lưu bài học"}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AddLessonModal;