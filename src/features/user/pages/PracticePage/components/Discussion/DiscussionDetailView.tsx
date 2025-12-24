import { ArrowLeftOutlined, EyeOutlined, MessageOutlined } from "@ant-design/icons";
import { Avatar, Button, Input, Skeleton, Tag, Form, Empty } from "antd";
import { useGetDiscussionQuery, useGetRepliesQuery, useCreateReplyMutation } from "../../../../../../services/discussion/discussion.service";
import ReplyItem, { buildReplyTree } from "./ReplyItem";
// import VoteControl from "./VoteControl";
import dayjs from "dayjs";
import { useAuth } from "../../../../../../hooks/useAuth";

interface DiscussionDetailViewProps {
  discussionId: number;
  onBack: () => void;
}

const DiscussionDetailView = ({ discussionId, onBack }: DiscussionDetailViewProps) => {
  const { data: discussion, isLoading: isDiscussionLoading } = useGetDiscussionQuery(discussionId);
  const { data: replyData, isLoading: isReplyLoading, refetch: refetchReplies } = useGetRepliesQuery(discussionId);
  const [createReply, { isLoading: isSubmitting }] = useCreateReplyMutation();
  const [form] = Form.useForm();
    const { user } = useAuth();

  const handleRootReply = async (values: { content: string }) => {
    await createReply({ discussionId, data: { content: values.content } }).unwrap();
    form.resetFields();
    refetchReplies(); // Refresh list
  };

  if (isDiscussionLoading) return <div className="p-8"><Skeleton active paragraph={{ rows: 6 }} /></div>;
  if (!discussion) return <div className="p-8"><Empty description="Post not found" /></div>;

  const repliesTree = replyData ? buildReplyTree(replyData.items) : [];

  return (
    <div className=" min-h-full flex flex-col">
      {/* Header Navigation */}
      <div className="flex items-center px-4 h-12 sticky top-0 z-20">
        <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={onBack}    
            className="text-gray-400 hover:text-white -ml-2"
        >
            Back
        </Button>
      </div>

      <div className="p-5 overflow-y-auto custom-scrollbar flex-1">
        {/* Post Title & Tags */}
        <h1 className="text-xl font-semibold text-white mb-3 leading-snug">
            {discussion.title}
        </h1>
        
        <div className="flex items-center gap-3 mb-6">
            <Avatar src={discussion.user.avatar_url} className="bg-white/10">{discussion.user.full_name[0]}</Avatar>
            <div className="flex flex-col">
                <span className="text-sm text-gray-200 font-medium">{discussion.user.full_name}</span>
                <span className="text-xs text-gray-500">{dayjs(discussion.created_at).format('MMM D, YYYY')}</span>
            </div>
        </div>

        {/* Post Content */}
        <div className="text-gray-300 text-sm leading-7 mb-8 whitespace-pre-wrap font-sans">
            {discussion.content}
        </div>

        {/* Post Actions / Tags */}
        <div className="flex items-center gap-2 mb-8">
            {discussion.discussion_type === 'SOLUTION' && <Tag color="blue">Solution</Tag>}
            {discussion.discussion_type === 'QUESTION' && <Tag color="cyan">Question</Tag>}
            {discussion.is_solution && <Tag color="green">Solved</Tag>}
        </div>

        {/* Controls Bar (Vote & Reply) */}
        <div className="flex items-center justify-between border-y border-white/10 py-3 mb-6">
            {/* <VoteControl 
                voteCount={discussion.vote_count} 
                userVote={discussion.user_vote_type} 
                discussionId={discussion.discussion_id}
                orientation="horizontal" // LeetCode style: horizontal vote for post
            /> */}
            <div className="flex items-center gap-4 text-gray-500 text-sm">
                {/* <span className="flex items-center gap-1"><EyeOutlined /> {discussion.view_count}</span> */}
                <span className="flex items-center gap-1"><MessageOutlined /> {discussion.total_replies}</span>
            </div>
        </div>

        {/* Comments Section */}
        <div className="mb-4">
            <div className="font-medium text-white mb-4">Bình luận ({replyData?.total || 0})</div>
            
            {/* Input */}
            <div className="flex gap-3 mb-8">
                <Avatar src={user?.avatar_url} className="bg-white/10 mt-1">{user?.full_name?.[0]}</Avatar>
                <div className="flex-1">
                    <Form form={form} onFinish={handleRootReply}>
                        <Form.Item name="content" className="mb-2">
                            <Input.TextArea 
                                placeholder="Nhập bình luận của bạn..." 
                                autoSize={{ minRows: 2, maxRows: 6 }}
                                className="bg-[#333] border-none text-white placeholder:text-gray-500 rounded-lg p-3 focus:bg-[#404040] focus:shadow-none"
                            />
                        </Form.Item>
                        <div className="flex justify-end">
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                loading={isSubmitting}
                                size="small"
                                className="bg-blue-600 border-none"
                            >
                                Đăng bài
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>

            {/* List */}
            {isReplyLoading ? <Skeleton active /> : (
                <div className="flex flex-col gap-6 pb-10">
                    {repliesTree.map(reply => (
                        <ReplyItem 
                            key={reply.reply_id} 
                            reply={reply} 
                            discussionId={discussion.discussion_id} 
                        />
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default DiscussionDetailView;