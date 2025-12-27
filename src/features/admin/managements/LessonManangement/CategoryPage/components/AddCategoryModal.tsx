import { CheckCircleOutlined, CloseCircleOutlined, CloseOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useCreateCategoryMutation } from "../../../../../../services/category/category.service.ts";
import { message } from "antd";
import {createPortal} from "react-dom";

interface AddCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddCategoryModal = ({ isOpen, onClose }: AddCategoryModalProps) => {
    // 1. Khởi tạo mutation
    const [createCategory, { isLoading }] = useCreateCategoryMutation();

    // 2. Khởi tạo State mặc định cho form
    const [formData, setFormData] = useState({
        name: "",
        order_index: 1,
        is_active: true,
        icon_url: ""
    });

    // Hàm reset form sau khi đóng hoặc tạo thành công
    const handleClose = () => {
        setFormData({ name: "", order_index: 1, is_active: true, icon_url: "" });
        onClose();
    };

    // 3. Hàm xử lý gửi dữ liệu
    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            return message.warning("Vui lòng nhập tên chủ đề");
        }

        try {
            // Lưu ý: Đảm bảo order_index là kiểu number
            await createCategory({
                ...formData,
                order_index: Number(formData.order_index)
            }).unwrap();

            message.success("Thêm chủ đề mới thành công!");
            handleClose();
        } catch (error: any) {
            console.error("Create error:", error);
            message.error(error?.data?.message || "Không thể tạo chủ đề");
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={handleClose} />
            <div className="relative w-full max-w-md bg-[#1a202c] rounded-3xl shadow-2xl border border-white/10 overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <h3 className="text-xl font-bold text-white tracking-wide">Thêm chủ đề mới</h3>
                    <button onClick={handleClose} className="p-2 text-gray-400 hover:text-white transition-colors">
                        <CloseOutlined size={20} />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    {/* Tên chủ đề */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest ml-1">Tên chủ đề</label>
                        <input
                            type="text"
                            placeholder="Nhập tên chủ đề..."
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full px-4 py-3 bg-[#0f131a]/50 text-gray-200 rounded-xl border border-white/10 focus:ring-2 focus:ring-emerald-500/50 transition-all outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Thứ tự */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest ml-1">Thứ tự hiển thị</label>
                            <input
                                type="number"
                                value={formData.order_index}
                                onChange={(e) => setFormData({...formData, order_index: parseInt(e.target.value) || 0})}
                                className="w-full px-4 py-3 bg-[#0f131a]/50 text-gray-200 rounded-xl border border-white/10 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                            />
                        </div>
                        {/* Trạng thái */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest ml-1">Trạng thái</label>
                            <button
                                onClick={() => setFormData({...formData, is_active: !formData.is_active})}
                                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border font-semibold transition-all ${
                                    formData.is_active
                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                                }`}
                            >
                                {formData.is_active ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                                <span>{formData.is_active ? 'Hoạt động' : 'Tạm dừng'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Icon URL */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest ml-1">Icon URL (SVG/PNG)</label>
                        <input
                            type="text"
                            placeholder="https://..."
                            value={formData.icon_url}
                            onChange={(e) => setFormData({...formData, icon_url: e.target.value})}
                            className="w-full px-4 py-3 bg-[#0f131a]/50 text-gray-200 rounded-xl border border-white/10 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-6 border-t border-white/5 bg-black/20 flex justify-end gap-3">
                    <button
                        onClick={handleClose}
                        className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:bg-white/5 transition-all"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg shadow-emerald-900/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Đang xử lý..." : "Tạo chủ đề"}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AddCategoryModal;