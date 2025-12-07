import { ArrowLeftOutlined, EyeOutlined, MessageOutlined } from "@ant-design/icons";
import { Avatar, Button, Input, Skeleton, Tag, Form, Empty } from "antd";
import { useGetDiscussionQuery, useGetRepliesQuery, useCreateReplyMutation } from "../../../../../../services/discussion/discussion.service";
import ReplyItem, { buildReplyTree } from "./ReplyItem";
import VoteControl from "./VoteControl";

interface DiscussionDetailViewProps {
  discussionId: number;
  onBack: () => void;
}

const DiscussionDetailView = ({ discussionId, onBack }: DiscussionDetailViewProps) => {
  const { data: discussion, isLoading: isDiscussionLoading } = useGetDiscussionQuery(discussionId);
  const { data: replyData, isLoading: isReplyLoading } = useGetRepliesQuery(discussionId);
  const [createReply, { isLoading: isSubmitting }] = useCreateReplyMutation();
  const [form] = Form.useForm();

  const handleRootReply = async (values: { content: string }) => {
    await createReply({ discussionId, data: { content: values.content } }).unwrap();
    form.resetFields();
  };

  if (isDiscussionLoading) return <div className="p-8"><Skeleton active avatar paragraph={{ rows: 4 }} /></div>;
  if (!discussion) return <Empty description="Không tìm thấy bài thảo luận" />;

  const repliesTree = replyData ? buildReplyTree(replyData.items) : [];

  return (
    <div className="bg-[#051311] min-h-[600px] flex flex-col">
      {/* Header Bar */}
      <div className="flex items-center gap-4 border-b border-white/10 pb-4 mb-6">
        <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={onBack}
            className="text-gray-400 hover:text-white"
        />
        <h2 className="text-white text-lg font-semibold truncate flex-1">{discussion.title}</h2>
      </div>

      {/* Main Discussion Content */}
      <div className="flex gap-4 mb-8">
        <VoteControl 
            voteCount={discussion.vote_count} 
            userVote={discussion.user_vote_type} 
            discussionId={discussion.discussion_id} 
        />
        
        <div className="flex-1">
            <div className="flex items-center gap-3 mb-4 text-xs text-gray-500">
                <Avatar size="small" src={discussion.user.avatar_url} className="bg-white/10">{discussion.user.full_name[0]}</Avatar>
                <span className="text-emerald-400 font-medium">{discussion.user.full_name}</span>
                <span>•</span>
                <span>{new Date(discussion.created_at).toLocaleDateString('vi-VN')}</span>
                <div className="ml-auto flex gap-3">
                    <span className="flex items-center gap-1"><EyeOutlined /> {discussion.view_count}</span>
                    <span className="flex items-center gap-1"><MessageOutlined /> {discussion.total_replies}</span>
                </div>
            </div>

            <div className="text-gray-200 leading-relaxed whitespace-pre-wrap mb-4">
                {discussion.content}
            </div>

            <div className="flex gap-2">
                <Tag color={discussion.discussion_type === "QUESTION" ? "orange" : "blue"} className="border-none bg-white/10">
                    {discussion.discussion_type}
                </Tag>
                {discussion.is_solution && <Tag color="success" className="border-none">Đã giải quyết</Tag>}
            </div>
        </div>
      </div>

      {/* Reply Input Area */}
      <div className="bg-[#0a1514] p-4 rounded-xl border border-white/10 mb-8">
         <Form form={form} onFinish={handleRootReply}>
            <Form.Item name="content" className="mb-3">
                <Input.TextArea 
                    placeholder="Viết bình luận của bạn..." 
                    autoSize={{ minRows: 3, maxRows: 6 }}
                    className="bg-transparent border-none text-gray-200 placeholder:text-gray-600 focus:shadow-none p-0 resize-none"
                />
            </Form.Item>
            <div className="flex justify-between items-center border-t border-white/5 pt-3">
                <span className="text-xs text-gray-500">Sử dụng Markdown</span>
                <Button type="primary" htmlType="submit" loading={isSubmitting} className="bg-emerald-600 border-none">
                    Gửi bình luận
                </Button>
            </div>
         </Form>
      </div>

      {/* Replies List */}
      <div>
        <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
            {replyData?.total || 0} Bình luận
        </h3>
        
        {isReplyLoading ? <Skeleton active /> : (
            <div className="flex flex-col gap-6">
                {repliesTree.length > 0 ? repliesTree.map(reply => (
                    <ReplyItem key={reply.reply_id} reply={reply} discussionId={discussion.discussion_id} />
                )) : (
                    <div className="text-center text-gray-500 py-8">Chưa có bình luận nào. Hãy là người đầu tiên!</div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default DiscussionDetailView;