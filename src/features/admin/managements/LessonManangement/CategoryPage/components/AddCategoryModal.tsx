import { CloseOutlined, UploadOutlined, PictureOutlined } from "@ant-design/icons";
import { useState, useRef } from "react";
import { useCreateCategoryMutation } from "../../../../../../services/category/category.service.ts";
import {Input, message, Modal} from "antd";

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

    return (
        <Modal
            open={isOpen}
            onCancel={handleClose}
            footer={null} // Tự định nghĩa footer để giữ style UI của bạn
            closeIcon={<CloseOutlined className="text-gray-400" />}
            centered
            width={450}
            styles={{
                mask: { backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0, 0, 0, 0.6)' },
                content: { padding: 0, backgroundColor: '#1a202c', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }
            }}
        >
            {/* Header */}
            <div className="px-8 py-6 border-b border-white/5">
                <h3 className="text-xl font-bold text-white tracking-tight">Tạo chủ đề</h3>
                <p className="text-xs text-gray-500 mt-1">Thêm danh mục mới vào hệ thống</p>
            </div>

            <div className="p-8 space-y-8">
                {/* Upload Section */}
                <div className="flex flex-col items-center">
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="relative w-28 h-28 rounded-3xl border-2 border-dashed border-white/10 bg-[#0f131a]/50 flex items-center justify-center cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group overflow-hidden"
                    >
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-center space-y-2">
                                <PictureOutlined className="text-2xl text-gray-400 group-hover:text-emerald-400" />
                                <p className="text-[10px] text-gray-500 font-medium uppercase">Tải icon</p>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <UploadOutlined className="text-white text-xl" />
                        </div>
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                </div>

                {/* Form Fields */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Tên chủ đề</label>
                        <Input
                            placeholder="Ví dụ: Công nghệ, Đời sống..."
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full h-12 bg-[#0f131a]/50 text-white rounded-xl border-white/5 hover:border-emerald-500/50 focus:border-emerald-500/50"
                            style={{ color: 'white' }}
                        />
                    </div>

                    {/*<div className="space-y-2">
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
                    </div>*/}
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 pb-8 pe-8">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl text-gray-400 font-bold text-sm hover:bg-white/5 transition-all"
                >
                    Hủy bỏ
                </button>
                <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="px-8 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
                >
                    {isLoading ? 'Đang tạo...' : 'Lưu nhãn'}
                </button>
            </div>
        </Modal>
    );
};

export default AddCategoryModal;