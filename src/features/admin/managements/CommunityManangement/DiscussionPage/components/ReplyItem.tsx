import { Avatar, Button, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import type {IAdminReply} from "../../../../../../types/discussion.types.ts";

interface ReplyItemProps {
    reply: IAdminReply;
    onReply: (content: string, parentId: number) => Promise<void>;
    isSubmitting: boolean;
}

const ReplyItem = ({ reply, onReply, isSubmitting }: ReplyItemProps) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState("");

    const handleSubmit = async () => {
        await onReply(replyContent, reply.reply_id);
        setReplyContent("");
        setIsReplying(false);
    };

    return (
        <div className="group">
            <div className="flex gap-4 p-4 bg-white/3 rounded-2xl border border-white/5 transition-all hover:border-emerald-500/20">
                <Avatar src={reply.user.avatar_url} icon={<UserOutlined />} className="flex-shrink-0" />
                <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-200 text-sm">{reply.user.full_name}</span>
                        <span className="text-[10px] text-gray-500">{new Date(reply.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">{reply.content}</p>

                    <div className="flex items-center gap-4 pt-2">
                        <button
                            onClick={() => setIsReplying(!isReplying)}
                            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                        >
                            Phản hồi
                        </button>
                    </div>

                    {/* Nested Reply Input */}
                    {isReplying && (
                        <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2">
                            <Input.TextArea
                                size="small"
                                rows={2}
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder={`Phản hồi ${reply.user.full_name}...`}
                                className="bg-black/40 border-white/10 text-white text-sm"
                            />
                            <div className="flex gap-2">
                                <Button
                                    size="small"
                                    type="primary"
                                    onClick={handleSubmit}
                                    loading={isSubmitting}
                                    className="bg-emerald-600 border-none"
                                >
                                    Gửi
                                </Button>
                                <Button
                                    size="small"
                                    type="text"
                                    onClick={() => setIsReplying(false)}
                                    className="text-gray-500 hover:text-gray-300"
                                >
                                    Hủy
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Render children if any (Đệ quy) */}
            {(reply as any).children?.length > 0 && (
                <div className="ml-12 mt-2 border-l-2 border-white/5 pl-4 space-y-2">
                    {(reply as any).children.map((child: IAdminReply) => (
                        <ReplyItem key={child.reply_id} reply={child} onReply={onReply} isSubmitting={isSubmitting} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReplyItem;