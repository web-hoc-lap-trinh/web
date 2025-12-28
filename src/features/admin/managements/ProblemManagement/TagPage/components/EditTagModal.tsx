import { useEffect, useState } from 'react';
import { Modal, Form, Input, Switch, ColorPicker, message } from 'antd';
import {
    EditOutlined,
    InfoCircleOutlined,
    BgColorsOutlined,
    CheckCircleOutlined
} from "@ant-design/icons";
import {useGetTagQuery, useUpdateTagMutation} from "../../../../../../services/tag/tag.service.ts";
import type { UpdateTagPayload } from "../../../../../../services/tag/tag.types.ts";

interface EditTagModalProps {
    isOpen: boolean;
    onClose: () => void;
    tagId: number; // Dữ liệu tag cần chỉnh sửa
}

const EditTagModal = ({ isOpen, onClose, tagId }: EditTagModalProps) => {
    const [form] = Form.useForm();
    const [color, setColor] = useState('#10b981');
    const {data: tag} = useGetTagQuery(tagId);
    const [updateTag, { isLoading }] = useUpdateTagMutation();

    // Cập nhật dữ liệu vào form khi tag thay đổi hoặc modal mở
    useEffect(() => {
        if (tag && isOpen) {
            form.setFieldsValue({
                name: tag.name,
                description: tag.description,
                is_active: !!tag.is_active,
                color: tag.color
            });
            setColor(tag.color || '#10b981');
        }
    }, [tag, isOpen, form]);

    const handleSubmit = async (values: any) => {
        if (!tag) return;

        try {
            const payload: UpdateTagPayload = {
                name: values.name,
                description: values.description,
                color: typeof values.color === 'string' ? values.color : color,
                is_active: values.is_active,
            };

            await updateTag({ id: tag.tag_id, data: payload }).unwrap();
            message.success('Cập nhật nhãn thành công!');
            onClose();
        } catch (error: any) {
            message.error(`Có lỗi xảy ra: ${error?.data?.message || 'Không thể cập nhật'}`);
        }
    };

    return (
        <Modal
            title={null}
            open={isOpen}
            onCancel={onClose}
            footer={null}
            centered
            width={500}
            styles={{
                mask: { backdropFilter: 'blur(4px)' },
                content: { padding: 0, backgroundColor: 'transparent', boxShadow: 'none' }
            }}
        >
            <div className="bg-[#1a202c] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-white/5 bg-white/5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                        <EditOutlined className="text-blue-400 text-lg" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white tracking-tight">Chỉnh sửa Nhãn</h3>
                        <p className="text-xs text-gray-500">Cập nhật thông tin phân loại: <span className="text-blue-400">{tag?.name}</span></p>
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-8">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        requiredMark={false}
                    >
                        <Form.Item
                            label={<span className="text-gray-400 font-medium flex items-center gap-2">Tên nhãn</span>}
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng nhập tên nhãn!' }]}
                        >
                            <Input
                                className="bg-black/40 border-white/10 text-white hover:border-blue-500/50 focus:border-blue-500 h-11 rounded-xl"
                            />
                        </Form.Item>

                        <Form.Item
                            label={<span className="text-gray-400 font-medium flex items-center gap-2"><InfoCircleOutlined size={14}/> Mô tả</span>}
                            name="description"
                        >
                            <Input.TextArea
                                rows={3}
                                className="bg-black/40 border-white/10 text-white hover:border-blue-500/50 focus:border-blue-500 rounded-xl"
                            />
                        </Form.Item>

                        <div className="grid grid-cols-2 gap-6 mt-2">
                            <Form.Item
                                label={<span className="text-gray-400 font-medium flex items-center gap-2"><BgColorsOutlined size={14}/> Màu hiển thị</span>}
                                name="color"
                            >
                                <div className="flex items-center gap-3 bg-black/40 p-2 rounded-xl border border-white/10 h-11">
                                    <ColorPicker
                                        value={color}
                                        onChange={(val) => setColor(val.toHexString())}
                                        showText
                                    />
                                </div>
                            </Form.Item>

                            <Form.Item
                                label={<span className="text-gray-400 font-medium flex items-center gap-2"><CheckCircleOutlined size={14}/> Trạng thái</span>}
                                name="is_active"
                                valuePropName="checked"
                            >
                                <Switch className="bg-blue-600" />
                                {/*<div className="flex items-center justify-between bg-black/40 px-4 rounded-xl border border-white/10 h-11">
                                    <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Kích hoạt</span>
                                </div>*/}
                            </Form.Item>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 mt-8">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2.5 rounded-xl text-gray-400 font-bold text-sm hover:bg-white/5 transition-all"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-8 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/20 transition-all"
                            >
                                {isLoading ? 'Đang lưu...' : 'Cập nhật'}
                            </button>
                        </div>
                    </Form>
                </div>
            </div>
        </Modal>
    );
};

export default EditTagModal;