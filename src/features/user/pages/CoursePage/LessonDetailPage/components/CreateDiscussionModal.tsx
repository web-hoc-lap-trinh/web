import { Modal, Form, Input, Select, Button, message } from "antd";
import { useCreateDiscussionMutation } from "../../../../../../services/discussion/discussion.service";
import { useEffect } from "react";

interface CreateDiscussionModalProps {
  visible: boolean;
  onCancel: () => void;
  lessonId: string;
}

const CreateDiscussionModal = ({ visible, onCancel, lessonId }: CreateDiscussionModalProps) => {
  const [form] = Form.useForm();
  const [createDiscussion, { isLoading }] = useCreateDiscussionMutation();

  useEffect(() => {
    if (!visible) {
      form.resetFields();
    }
  }, [visible, form]);

  const handleSubmit = async (values: any) => {
    try {
      await createDiscussion({
        lesson_id: lessonId,
        title: values.title,
        content: values.content,
        discussion_type: values.discussion_type,
        is_solution: false, 
      }).unwrap();

      message.success("Đăng thảo luận thành công!");
      onCancel(); 
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <Modal
      title={<span className="text-white text-lg">Tạo thảo luận mới</span>}
      open={visible}
      onCancel={onCancel}
      footer={null} 
      width={600}
      className="dark-modal" 
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
        body: {
            paddingTop: 0
        },
        mask: {
            backdropFilter: 'blur(4px)'
        }
      }}
      closeIcon={<span className="text-gray-400 hover:text-white">✕</span>}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ discussion_type: "DISCUSSION" }}
      >
        {/* 1. Chọn loại thảo luận */}
        <Form.Item
          name="discussion_type"
          label={<span className="text-gray-300">Loại bài đăng</span>}
          rules={[{ required: true, message: "Vui lòng chọn loại bài đăng" }]}
        >
          <Select
            className="[&_.ant-select-selector]:!bg-white/5 [&_.ant-select-selector]:!border-white/10 [&_.ant-select-selector]:!text-white"
            popupClassName="!bg-[#2a2a2a]"
            dropdownStyle={{ border: '1px solid rgba(255,255,255,0.1)' }}
            options={[
              { value: "DISCUSSION", label: "💬 Thảo luận chung" },
              { value: "QUESTION", label: "❓ Hỏi đáp / Gặp lỗi" },
              { value: "SHARE", label: "💡 Chia sẻ kiến thức" },
              { value: "FEEDBACK", label: "📝 Góp ý bài học" },
            ]}
          />
        </Form.Item>

        {/* 2. Tiêu đề */}
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
            placeholder="Tóm tắt vấn đề của bạn..." 
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:bg-white/10 focus:border-emerald-500"
          />
        </Form.Item>

        {/* 3. Nội dung */}
        <Form.Item
          name="content"
          label={<span className="text-gray-300">Nội dung chi tiết</span>}
          rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
          help={<span className="text-xs text-gray-500">Hỗ trợ định dạng Markdown</span>}
        >
          <Input.TextArea
            placeholder="Mô tả chi tiết, đính kèm code nếu cần..."
            rows={6}
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:bg-white/10 focus:border-emerald-500"
          />
        </Form.Item>

        {/* 4. Action Buttons */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
          <Button 
            onClick={onCancel}
            className="bg-transparent border-white/20 text-gray-300 hover:!text-white hover:!border-white"
          >
            Hủy bỏ
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={isLoading}
            className="bg-emerald-600 hover:!bg-emerald-500 border-none font-semibold shadow-lg shadow-emerald-900/20"
          >
            Đăng bài
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateDiscussionModal;