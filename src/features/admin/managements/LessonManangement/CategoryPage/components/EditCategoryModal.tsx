import { CloseOutlined, UploadOutlined, PictureOutlined } from "@ant-design/icons";
import { useState, useEffect, useRef } from "react";
import {
    useGetAdminCategoryQuery,
    useUpdateCategoryMutation
} from "../../../../../../services/category/category.service.ts";
import { Skeleton, message } from "antd";
import { createPortal } from "react-dom";

interface EditCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    categoryId: number;
}

const EditCategoryModal = ({ isOpen, onClose, categoryId }: EditCategoryModalProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 1. Lấy dữ liệu chi tiết
    const { data: category, isLoading, isFetching } = useGetAdminCategoryQuery(categoryId, {
        skip: !isOpen || categoryId === 0,
        refetchOnMountOrArgChange: true
    });

    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

    // 2. State quản lý form
    const [formData, setFormData] = useState({
        name: "",
        is_active: true,
        icon_file: null as File | null
    });
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // 3. Sync dữ liệu từ API vào Form
    useEffect(() => {
        if (category && isOpen) {
            setFormData({
                name: category.name,
                is_active: category.is_active,
                icon_file: null // File mới mặc định là null
            });
            setPreviewUrl(category.icon_url); // Hiển thị ảnh cũ từ server
        }
    }, [category, isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) return message.error("Ảnh không được quá 2MB");
            setFormData({ ...formData, icon_file: file });
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        if (!formData.name.trim()) return message.warning("Vui lòng nhập tên chủ đề");

        try {
            // Lưu ý: Payload gửi đi có thể chứa File (nếu đổi ảnh) hoặc giữ nguyên ảnh cũ
            await updateCategory({
                categoryId,
                data: {
                    name: formData.name,
                    ...(formData.icon_file && { icon_file: formData.icon_file }),
                    order_index: category?.order_index || 1
                }
            }).unwrap();

            message.success("Cập nhật thành công!");
            onClose();
        } catch (error: any) {
            message.error(error?.data?.message || "Có lỗi xảy ra khi cập nhật!");
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

            <div className="relative w-full max-w-md bg-[#1a202c] rounded-3xl shadow-2xl border border-white/10 overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/2">
                    <div>
                        <h3 className="text-xl font-bold text-white tracking-tight">Sửa chủ đề</h3>
                        <p className="text-[10px] text-emerald-500 font-mono mt-1 uppercase tracking-wider">ID: #{categoryId}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 transition-colors">
                        <CloseOutlined />
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    {isLoading || isFetching ? (
                        <div className="py-10"><Skeleton active /></div>
                    ) : (
                        <>
                            {/* Upload Area */}
                            <div className="flex flex-col items-center">
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="relative w-28 h-28 rounded-3xl border-2 border-dashed border-white/10 bg-[#0f131a]/50 flex items-center justify-center cursor-pointer hover:border-emerald-500/50 transition-all group overflow-hidden"
                                >
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <PictureOutlined className="text-2xl text-gray-500" />
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <UploadOutlined className="text-white text-xl" />
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-500 mt-3 font-bold uppercase tracking-widest">Thay đổi biểu tượng</p>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                            </div>

                            <div className="space-y-5">
                                {/* Tên chủ đề */}
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Tên chủ đề</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full px-5 py-3.5 bg-[#0f131a]/50 text-white rounded-2xl border border-white/5 focus:border-emerald-500/50 outline-none transition-all"
                                    />
                                </div>

                                {/* Trạng thái Switch */}
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Trạng thái hoạt động</label>
                                    <div
                                        onClick={() => setFormData({...formData, is_active: !formData.is_active})}
                                        className="flex items-center justify-between px-5 py-4 bg-[#0f131a]/50 rounded-2xl border border-white/5 cursor-pointer hover:bg-[#161b22] transition-all"
                                    >
                                        <span className={`text-sm font-semibold ${formData.is_active ? 'text-emerald-400' : 'text-gray-500'}`}>
                                            {formData.is_active ? 'Đang kích hoạt' : 'Đang tạm dừng'}
                                        </span>
                                        <div className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${formData.is_active ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-gray-700'}`}>
                                            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${formData.is_active ? 'translate-x-6' : 'translate-x-0'}`} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="px-8 py-6 bg-white/2 border-t border-white/5 flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-gray-400 hover:bg-white/5 transition-all">
                        Hủy
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isUpdating || isLoading}
                        className="flex-2 py-3.5 rounded-2xl text-sm font-bold text-white bg-linear-to-r from-emerald-600 to-teal-600 shadow-xl shadow-emerald-900/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default EditCategoryModal;