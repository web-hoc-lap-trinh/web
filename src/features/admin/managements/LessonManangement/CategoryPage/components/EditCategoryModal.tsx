import { useState, useEffect } from "react";
import { CheckCircleOutlined, CloseCircleOutlined, CloseOutlined } from "@ant-design/icons";
import { useGetCategoryQuery, useUpdateCategoryMutation } from "../../../../../../services/category/category.service.ts";
import { Skeleton, message } from "antd";

interface EditCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    categoryId: number;
}

const EditCategoryModal = ({ isOpen, onClose, categoryId }: EditCategoryModalProps) => {
    // 1. Gọi Service lấy chi tiết
    const { data: category, isLoading, isFetching } = useGetCategoryQuery(categoryId, {
        skip: categoryId === 0
    });

    const [formData, setFormData] = useState({
        name: "",
        order_index: 0,
        icon_url: "",
        is_active: true
    });

    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

    // 4. useEffect: Cập nhật state khi dữ liệu API trả về thành công
    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name,
                order_index: category.order_index,
                icon_url: category.icon_url,
                is_active: category.is_active
            });
        }
    }, [category, isOpen]); // Chạy lại khi có dữ liệu mới hoặc khi Modal mở ra

    const handleSave = async () => {
        if (!categoryId) return;

        try {
            // Tạo payload sạch
            const payload = {
                name: formData.name,
                order_index: Number(formData.order_index), // Đảm bảo là kiểu số
                is_active: formData.is_active,
                icon_url: formData.icon_url,
                // Nếu API yêu cầu File thay vì string cho icon, bạn cần xử lý ở đây
            };

            await updateCategory({
                categoryId,
                data: payload
            }).unwrap();

            message.success("Cập nhật thành công!");
            onClose();
        } catch (error: any) {
            console.error("Update Error:", error);
            // Hiển thị thông báo lỗi từ Server nếu có
            const errorMsg = error?.data?.message || "Có lỗi xảy ra khi cập nhật!";
            message.error(errorMsg);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
            <div className="relative w-full max-w-md bg-[#1a202c] rounded-3xl shadow-2xl border border-white/10 overflow-hidden transform transition-all">

                {/* Header */}
                <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div>
                        <h3 className="text-xl font-bold text-white tracking-wide">Sửa chủ đề</h3>
                        <p className="text-xs text-gray-500 font-mono mt-1">{categoryId}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors">
                        <CloseOutlined size={20} />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    {isLoading || isFetching ? (
                        <Skeleton active paragraph={{ rows: 6 }} />
                    ) : (
                        <>
                            {/* Tên chủ đề */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest ml-1">Tên chủ đề</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full px-4 py-3 bg-[#0f131a]/50 text-gray-200 rounded-xl border border-white/10 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                 Thứ tự
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest ml-1">Thứ tự</label>
                                    <input
                                        type="number"
                                        value={formData.order_index}
                                        onChange={(e) => setFormData({...formData, order_index: parseInt(e.target.value)})}
                                        className="w-full px-4 py-3 bg-[#0f131a]/50 text-gray-200 rounded-xl border border-white/10 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                                    />
                                </div>
                                 Trạng thái
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest ml-1">Trạng thái</label>
                                    <button
                                        onClick={() => setFormData({...formData, is_active: !formData.is_active})}
                                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border font-semibold transition-all ${formData.is_active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                        {formData.is_active ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                                        <span>{formData.is_active ? 'Hoạt động' : 'Tạm dừng'}</span>
                                        <span>{formData.is_active}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Icon URL */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest ml-1">Icon URL</label>
                                <input
                                    type="text"
                                    value={formData.icon_url}
                                    onChange={(e) => setFormData({...formData, icon_url: e.target.value})}
                                    className="w-full px-4 py-3 bg-[#0f131a]/50 text-gray-200 rounded-xl border border-white/10 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                                />
                            </div>
                        </>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="px-8 py-6 border-t border-white/5 bg-black/20 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:bg-white/5 transition-all">Đóng</button>
                    <button
                        onClick={handleSave}
                        disabled={isUpdating || isLoading}
                        className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50"
                    >
                        {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditCategoryModal;