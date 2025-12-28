import { useState } from "react";
import { Avatar, Button, Input, Form, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useCreateReplyMutation } from "../../../../../../services/discussion/discussion.service";
import type { IReply } from "../../../../../../types/discussion.types";

dayjs.extend(relativeTime);

export const buildReplyTree = (replies: IReply[]): IReply[] => {
    const map = new Map<number, IReply>();
    const roots: IReply[] = [];
    replies.forEach(reply => map.set(reply.reply_id, { ...reply, children: [] }));
    replies.forEach(reply => {
        if (reply.parent_reply_id && map.has(reply.parent_reply_id)) {
            map.get(reply.parent_reply_id)!.children!.push(map.get(reply.reply_id)!);
        } else {
            roots.push(map.get(reply.reply_id)!);
        }
    });
    return roots;
};

interface ReplyItemProps {
  reply: IReply;
  discussionId: number;
  level?: number;
}

const ReplyItem = ({ reply, discussionId, level = 0 }: ReplyItemProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [createReply, { isLoading }] = useCreateReplyMutation();
  const [form] = Form.useForm();

  const handleReply = async (values: { content: string }) => {
    try {
      await createReply({
        discussionId,
        data: { content: values.content, parent_reply_id: reply.reply_id }
      }).unwrap();
      setIsReplying(false);
      form.resetFields();
      message.success("Replied!");
    } catch { message.error("Error posting reply."); }
  };

  return (
    <div className={`flex gap-3 ${level > 0 ? "pl-8 border-l-2 border-[#333] ml-2" : ""}`}>
      <Avatar size="small" src={reply.user.avatar_url} icon={<UserOutlined />} className="bg-white/10 mt-1 shrink-0" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
            <span className="text-gray-300 text-xs font-bold">{reply.user.full_name}</span>
            <span className="text-gray-600 text-xs">{dayjs(reply.created_at).fromNow()}</span>
        </div>

        <div className="text-gray-400 text-sm mb-2 whitespace-pre-wrap leading-6">
            {reply.content}
        </div>

        {/* <div className="flex items-center gap-4 mb-2">
            <VoteControl 
                voteCount={reply.vote_count} 
                userVote={reply.user_vote_type} 
                replyId={reply.reply_id}
                discussionId={discussionId}
                orientation="horizontal"
            />
            <Button 
                type="text" 
                size="small" 
                icon={<MessageOutlined />} 
                className="text-gray-500 hover:text-gray-300 text-xs px-0 flex items-center"
                onClick={() => setIsReplying(!isReplying)}
            >
                Reply
            </Button>
        </div> */}

        {isReplying && (
            <div className="mb-4 mt-2">
                <Form form={form} onFinish={handleReply}>
                    <Form.Item name="content" rules={[{ required: true }]} className="mb-2">
                        <Input.TextArea autoSize={{ minRows: 2 }} className="bg-[#333] border-none text-white rounded p-2" />
                    </Form.Item>
                    <div className="flex gap-2 justify-end">
                        <Button size="small" onClick={() => setIsReplying(false)} type="text" className="text-gray-400">Cancel</Button>
                        <Button type="primary" size="small" htmlType="submit" loading={isLoading} className="bg-blue-600 border-none">Reply</Button>
                    </div>
                </Form>
            </div>
        )}

        {reply.children && reply.children.map(child => (
            <div className="mt-4" key={child.reply_id}>
                <ReplyItem reply={child} discussionId={discussionId} level={level + 1} />
            </div>
        ))}
      </div>
    </div>
  );
};

export default ReplyItem;