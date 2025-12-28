import { CloseOutlined, UploadOutlined, PictureOutlined } from "@ant-design/icons";
import { useState, useEffect, useRef } from "react";
import {
    useGetAdminCategoryQuery,
    useUpdateCategoryMutation
} from "../../../../../../services/category/category.service.ts";
import {Button, Modal, Skeleton, message, Switch, Input} from "antd";

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
                    is_active: formData.is_active,
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

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            footer={null}
            closeIcon={<CloseOutlined className="text-gray-400" />}
            centered
            width={450}
            styles={{
                mask: { backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0, 0, 0, 0.6)' },
                content: { padding: 0, backgroundColor: '#1a202c', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }
            }}
        >
            {/* Header */}
            <div className="px-8 py-6 border-b border-white/5 bg-white/2">
                <h3 className="text-xl font-bold text-white tracking-tight">Sửa chủ đề</h3>
                <p className="text-[10px] text-emerald-500 font-mono mt-1 uppercase tracking-wider">ID: #{categoryId}</p>
            </div>

            <div className="p-8">
                {isLoading || isFetching ? (
                    <div className="py-10">
                        <Skeleton active paragraph={{ rows: 4 }} />
                    </div>
                ) : (
                    <div className="space-y-8">
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

                        <div className="space-y-6">
                            {/* Tên chủ đề */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Tên chủ đề</label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    placeholder="Nhập tên chủ đề..."
                                    className="w-full h-12 bg-[#0f131a]/50 text-white rounded-xl border-white/5 hover:border-emerald-500/50 focus:border-emerald-500/50"
                                    style={{ color: 'white' }}
                                />
                            </div>

                            {/* Trạng thái Switch */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Trạng thái hoạt động</label>
                                <div className="flex items-center justify-between px-5 py-4 bg-[#0f131a]/50 rounded-2xl border border-white/5">
                                    <span className={`text-sm font-semibold transition-colors ${formData.is_active ? 'text-emerald-400' : 'text-gray-500'}`}>
                                        {formData.is_active ? 'Đang kích hoạt' : 'Đang tạm dừng'}
                                    </span>
                                    <Switch
                                        checked={formData.is_active}
                                        onChange={(checked) => setFormData({...formData, is_active: checked})}
                                        className={formData.is_active ? 'bg-emerald-500' : 'bg-gray-600'}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-8 py-6 bg-white/2 border-t border-white/5 flex gap-3">
                <Button
                    onClick={onClose}
                    className="flex-1 h-12 rounded-xl text-gray-400 border-none bg-white/5 hover:bg-white/10"
                >
                    Hủy
                </Button>
                <Button
                    loading={isUpdating}
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex-[2] h-12 rounded-xl text-sm font-bold border-none bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/20"
                >
                    Lưu thay đổi
                </Button>
            </div>
        </Modal>
    );
};

export default EditCategoryModal;