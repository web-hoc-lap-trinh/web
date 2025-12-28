import { CheckCircleOutlined, CloseCircleOutlined, CloseOutlined, UploadOutlined, PictureOutlined } from "@ant-design/icons";
import { useState, useRef } from "react";
import { useCreateCategoryMutation } from "../../../../../../services/category/category.service.ts";
import { message } from "antd";
import { createPortal } from "react-dom";

interface AddCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddCategoryModal = ({ isOpen, onClose }: AddCategoryModalProps) => {
    const [createCategory, { isLoading }] = useCreateCategoryMutation();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        name: "",
        is_active: true,
        icon_file: null as File | null
    });
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) return message.error("Ảnh không được quá 2MB");
            setFormData({ ...formData, icon_file: file });
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleClose = () => {
        setFormData({ name: "", is_active: true, icon_file: null });
        setPreviewUrl(null);
        onClose();
    };

    const handleSubmit = async () => {
        if (!formData.name.trim()) return message.warning("Vui lòng nhập tên chủ đề");
        if (!formData.icon_file) return message.warning("Vui lòng tải lên icon chủ đề");

        try {
            await createCategory({
                name: formData.name,
                icon_file: formData.icon_file,
                // Giả sử backend cần order_index mặc định hoặc bạn bỏ qua nếu DB tự tăng
                order_index: 1
            }).unwrap();

            message.success("Thêm chủ đề mới thành công!");
            handleClose();
        } catch (error: any) {
            message.error(error?.data?.message || "Không thể tạo chủ đề");
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={handleClose} />

            <div className="relative w-full max-w-md bg-[#1a202c] rounded-[32px] shadow-2xl border border-white/10 overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-8 py-6 flex justify-between items-center border-b border-white/5">
                    <div>
                        <h3 className="text-xl font-bold text-white tracking-tight">Tạo chủ đề</h3>
                        <p className="text-xs text-gray-500 mt-1">Thêm danh mục mới vào hệ thống</p>
                    </div>
                    <button onClick={handleClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 transition-colors">
                        <CloseOutlined />
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    {/* Phần Upload Ảnh - Đưa lên đầu làm điểm nhấn */}
                    <div className="flex flex-col items-center justify-center">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="relative w-28 h-28 rounded-3xl border-2 border-dashed border-white/10 bg-[#0f131a]/50 flex items-center justify-center cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group overflow-hidden"
                        >
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center space-y-2">
                                    <PictureOutlined className="text-2xl text-gray-500 group-hover:text-emerald-400" />
                                    <p className="text-[10px] text-gray-500 font-medium">TẢI ICON</p>
                                </div>
                            )}
                            {/* Overlay khi hover */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <UploadOutlined className="text-white text-xl" />
                            </div>
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.1em] ml-1">Tên chủ đề</label>
                            <input
                                type="text"
                                placeholder="Ví dụ: Công nghệ, Đời sống..."
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full px-5 py-3.5 bg-[#0f131a]/50 text-white rounded-2xl border border-white/5 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.1em] ml-1">Trạng thái hoạt động</label>
                            <div
                                onClick={() => setFormData({...formData, is_active: !formData.is_active})}
                                className="flex items-center justify-between px-5 py-4 bg-[#0f131a]/50 rounded-2xl border border-white/5 cursor-pointer hover:bg-[#161b22] transition-all"
                            >
                                <span className={`text-sm font-semibold ${formData.is_active ? 'text-emerald-400' : 'text-gray-500'}`}>
                                    {formData.is_active ? 'Đang kích hoạt' : 'Đang tạm dừng'}
                                </span>

                                {/* Switch UI */}
                                <div className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${formData.is_active ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-gray-700'}`}>
                                    <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${formData.is_active ? 'translate-x-6' : 'translate-x-0'}`} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-6 bg-white/[0.02] border-t border-white/5 flex gap-3">
                    <button
                        onClick={handleClose}
                        className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-gray-400 hover:bg-white/5 transition-all"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="flex-[2] py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 shadow-xl shadow-emerald-900/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {isLoading ? "Đang xử lý..." : "Xác nhận tạo"}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AddCategoryModal;