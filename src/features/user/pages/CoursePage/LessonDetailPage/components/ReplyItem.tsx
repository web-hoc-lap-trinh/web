import { UserOutlined, MessageOutlined } from "@ant-design/icons";
import { Avatar, Button, Input, Form } from "antd";
import { useState } from "react";
import { useCreateReplyMutation } from "../../../../../../services/discussion/discussion.service";
import type { IReply } from "../../../../../../types/discussion.types";
import VoteControl from "./VoteControl";
import { timeAgo } from "../../../../../../utils/Time";

const ReplyItem = ({ reply, discussionId }: { reply: IReply; discussionId: number }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [form] = Form.useForm();
  const [createReply, { isLoading }] = useCreateReplyMutation();

  const handleReplySubmit = async (values: { content: string }) => {
    await createReply({
      discussionId,
      data: { content: values.content, parent_reply_id: reply.reply_id },
    }).unwrap();
    setIsReplying(false);
    form.resetFields();
  };

  return (
    <div className="flex gap-3 group">
      <div className="flex flex-col items-center">
        <Avatar 
            size="small" 
            src={reply.user.avatar_url} 
            icon={<UserOutlined />} 
            className="bg-white/10"
        />
        {reply.children && reply.children.length > 0 && (
            <div className="w-px h-full bg-white/10 my-2"></div>
        )}
      </div>

      <div className="flex-1 pb-6">
        <div className="bg-white/5 border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <span className="text-emerald-400 font-medium text-sm mr-2">{reply.user.full_name}</span>
                    <span className="text-gray-500 text-xs">{timeAgo(reply.created_at)}</span>
                </div>
            </div>
            
            <div className="text-gray-300 text-sm mb-3 whitespace-pre-wrap leading-relaxed">
                {reply.content}
            </div>

            <div className="flex items-center gap-4">
                <VoteControl 
                    voteCount={reply.vote_count} 
                    userVote={reply.user_vote_type} 
                    replyId={reply.reply_id}
                    discussionId={discussionId}
                    size="small"
                />
                
                <Button 
                    type="text" 
                    size="small" 
                    icon={<MessageOutlined />}
                    className="text-gray-500 hover:text-emerald-400 text-xs"
                    onClick={() => setIsReplying(!isReplying)}
                >
                    Trả lời
                </Button>
            </div>
        </div>

        {isReplying && (
             <div className="mt-3 ml-2 pl-4 border-l-2 border-white/10">
                <Form form={form} onFinish={handleReplySubmit}>
                    <Form.Item name="content" rules={[{ required: true, message: 'Nhập nội dung...' }]} className="mb-2">
                        <Input.TextArea 
                            placeholder={`Trả lời ${reply.user.full_name}...`} 
                            autoSize={{ minRows: 2, maxRows: 4 }}
                            className="bg-[#0a1514] border-white/10 text-gray-300 focus:bg-[#0a1514] placeholder:text-gray-600"
                        />
                    </Form.Item>
                    <div className="flex justify-end gap-2">
                        <Button size="small" type="text" className="text-gray-400" onClick={() => setIsReplying(false)}>Hủy</Button>
                        <Button size="small" type="primary" htmlType="submit" loading={isLoading} className="bg-emerald-600">Gửi</Button>
                    </div>
                </Form>
             </div>
        )}

        {reply.children && reply.children.length > 0 && (
            <div className="mt-4 flex flex-col gap-4">
                {reply.children.map(child => (
                    <ReplyItem key={child.reply_id} reply={child} discussionId={discussionId} />
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

const buildReplyTree = (replies: IReply[]) => {
    const map = new Map<number, IReply>();
    const roots: IReply[] = [];
    
    replies.forEach(r => map.set(r.reply_id, { ...r, children: [] }));
    
    replies.forEach(r => {
        if (r.parent_reply_id && map.has(r.parent_reply_id)) {
            map.get(r.parent_reply_id)!.children!.push(map.get(r.reply_id)!);
        } else {
            roots.push(map.get(r.reply_id)!);
        }
    });
    return roots;
};

export default ReplyItem;
export { buildReplyTree };