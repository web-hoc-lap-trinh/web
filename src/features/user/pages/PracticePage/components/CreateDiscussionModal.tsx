import { Modal, Form, Input, Select, Button, message } from "antd";
import { useCreateDiscussionMutation } from "../../../../../services/discussion/discussion.service";
import { useEffect } from "react";
import type { DiscussionType } from "../../../../../types/discussion.types";

interface CreateDiscussionModalProps {
  visible: boolean;
  onCancel: () => void;
  context: { type: 'lesson' | 'problem', id: string | number };
}

const CreateDiscussionModal = ({ visible, onCancel, context }: CreateDiscussionModalProps) => {
  const [form] = Form.useForm();
  const [createDiscussion, { isLoading }] = useCreateDiscussionMutation();

  useEffect(() => {
    if (!visible) {
      form.resetFields();
    }
  }, [visible, form]);

  const handleSubmit = async (values: { title: string; content: string; discussion_type: DiscussionType }) => {
    try {
      const payload: any = {
        title: values.title,
        content: values.content,
        discussion_type: values.discussion_type,
        is_solution: values.discussion_type === "SOLUTION",
      };

      if (context.type === 'lesson') {
        payload.lesson_id = context.id;
      } else {
        payload.problem_id = context.id;
      }

      await createDiscussion(payload).unwrap();

      message.success("Đăng thảo luận thành công!");
      onCancel(); 
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  const discussionTypeOptions = [
    { value: "GENERAL", label: "💬 Thảo luận chung" },
    { value: "QUESTION", label: "❓ Hỏi đáp / Gặp lỗi" },
    { value: "SOLUTION", label: "💡 Chia sẻ lời giải" },
    { value: "BUG_REPORT", label: "🐛 Báo lỗi hệ thống/đề bài" },
  ];

  return (
    <Modal
      title={<span className="text-white text-lg">Tạo thảo luận mới</span>}
      open={visible}
      onCancel={onCancel}
      footer={null} 
      width={600}
      styles={{
        content: {
            backgroundColor: '#1f1f1f',
            border: '1px solid rgba(255,255,255,0.1)',
        },
        header: {
            backgroundColor: 'transparent',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            paddingBottom: 16,
            marginBottom: 24,
        },
        body: { paddingTop: 0 },
        mask: { backdropFilter: 'blur(4px)' }
      }}
      closeIcon={<span className="text-gray-400 hover:text-white">✕</span>}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ discussion_type: "GENERAL" }}
      >
        <Form.Item
          name="discussion_type"
          label={<span className="text-gray-300">Loại bài đăng</span>}
          rules={[{ required: true, message: "Vui lòng chọn loại bài đăng" }]}
        >
          <Select
            className="[&_.ant-select-selector]:bg-white/5! [&_.ant-select-selector]:border-white/10! [&_.ant-select-selector]:text-white!"
            popupClassName="!bg-[#2a2a2a]"
            dropdownStyle={{ border: '1px solid rgba(255,255,255,0.1)' }}
            // SỬA: Sử dụng options đã map lại
            options={discussionTypeOptions}
          />
        </Form.Item>

        <Form.Item
          name="title"
          label={<span className="text-gray-300">Tiêu đề</span>}
          rules={[
            { required: true, message: "Vui lòng nhập tiêu đề" },
            { min: 5, message: "Tiêu đề quá ngắn" },
            { max: 100, message: "Tiêu đề không quá 100 ký tự" }
          ]}
        >
          <Input 
            placeholder="Tóm tắt vấn đề..." 
            className="[&_.ant-input]:bg-white/5! [&_.ant-input]:border-white/10! [&_.ant-input]:text-white placeholder:[&_.ant-input]:text-gray-600 focus:[&_.ant-input]:border-emerald-500"
          />
        </Form.Item>

        <Form.Item
          name="content"
          label={<span className="text-gray-300">Nội dung chi tiết</span>}
          rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
        >
          <Input.TextArea
            placeholder="Mô tả chi tiết, đính kèm code nếu cần..."
            rows={6}
            className="[&_.ant-input]:bg-white/5! [&_.ant-input]:border-white/10! [&_.ant-input]:text-white placeholder:[&_.ant-input]:text-gray-600 focus:[&_.ant-input]:border-emerald-500"
          />
        </Form.Item>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
          <Button 
            onClick={onCancel}
            className="bg-transparent border-white/20 text-gray-300 hover:text-white! hover:border-white!"
          >
            Hủy bỏ
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={isLoading}
            className="bg-emerald-600 border-none hover:bg-emerald-500! shadow-lg shadow-emerald-900/20"
          >
            Đăng bài
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateDiscussionModal;