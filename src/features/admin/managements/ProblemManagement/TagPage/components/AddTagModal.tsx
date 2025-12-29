import { useState } from 'react';
import { Modal, Form, Input, Switch, ColorPicker, message } from 'antd';
import {
    PlusOutlined,
    InfoCircleOutlined,
    BgColorsOutlined,
    CheckCircleOutlined
} from "@ant-design/icons";
import {useCreateTagMutation} from "../../../../../../services/tag/tag.service.ts";
import type {CreateTagPayload} from "../../../../../../services/tag/tag.types.ts";

interface CreateTagModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddTagModal = ({ isOpen, onClose }: CreateTagModalProps) => {
    const [form] = Form.useForm();
    const [createTag, { isLoading }] = useCreateTagMutation();
    const [color, setColor] = useState('#10b981'); // Mặc định màu emerald-500

    const handleSubmit = async (values: any) => {
        try {
            const payload: CreateTagPayload = {
                name: values.name,
                description: values.description,
                color: typeof values.color === 'string' ? values.color : color,
                is_active: values.is_active,
            };

            await createTag(payload).unwrap();
            message.success('Tạo nhãn mới thành công!');
            form.resetFields();
            onClose();
        } catch (error) {
            message.error(`Có lỗi xảy ra khi tạo nhãn: ${error}`);
        }
    };

    return (
        <Modal
            title={null}
            open={isOpen}
            onCancel={onClose}
            onOk={() => form.submit()}
            confirmLoading={isLoading}
            centered
            width={500}
            footer={null}
            styles={{
                mask: { backdropFilter: 'blur(4px)' },
                content: { padding: 0, backgroundColor: 'transparent', boxShadow: 'none' }
            }}
            >
                <div className="bg-[#1a202c] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                    {/* Header */}
                    <div className="p-6 border-b border-white/5 bg-white/5 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                            <PlusOutlined className="text-emerald-400 text-lg" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white tracking-tight">Thêm Nhãn Mới</h3>
                            <p className="text-xs text-gray-500">Tạo phân loại mới cho kho bài tập</p>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="p-8">
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            initialValues={{ is_active: true }}
                            requiredMark={false}
                        >
                            {/* Tên Nhãn */}
                            <Form.Item
                                label={<span className="text-gray-400 font-medium flex items-center gap-2"><PlusOutlined size={14}/> Tên nhãn</span>}
                                name="name"
                                rules={[{ required: true, message: 'Vui lòng nhập tên nhãn!' }]}
                            >
                                <Input
                                    placeholder="Ví dụ: Cấu trúc dữ liệu"
                                    className="bg-black/40 border-white/10 text-white placeholder:text-gray-600 hover:border-emerald-500/50 focus:border-emerald-500 h-11 rounded-xl"
                                />
                            </Form.Item>

                            {/* Mô tả */}
                            <Form.Item
                                label={<span className="text-gray-400 font-medium flex items-center gap-2"><InfoCircleOutlined size={14}/> Mô tả</span>}
                                name="description"
                            >
                                <Input.TextArea
                                    placeholder="Nhập mô tả ngắn gọn về nhãn này..."
                                    rows={3}
                                    className="bg-black/40 border-white/10 text-white placeholder:text-gray-600 hover:border-emerald-500/50 focus:border-emerald-500 rounded-xl"
                                />
                            </Form.Item>

                            <div className="grid grid-cols-2 gap-6 mt-2">
                                {/* Màu sắc */}
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

                                {/* Trạng thái */}
                                <Form.Item
                                    label={<span className="text-gray-400 font-medium flex items-center gap-2"><CheckCircleOutlined size={14}/> Trạng thái</span>}
                                    name="is_active"
                                    valuePropName="checked"
                                    getValueFromEvent={(checked) => checked}
                                >
                                    <Switch className="bg-gray-700" />
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
                                        Hủy bỏ
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="px-8 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
                                    >
                                        {isLoading ? 'Đang tạo...' : 'Lưu nhãn'}
                                    </button>
                                </div>
                        </Form>
                    </div>
                </div>
             </Modal>
    )
};

export default AddTagModal;