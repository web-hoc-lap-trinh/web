import { Modal, Spin, Avatar, Tag, Input, Button, message } from "antd";
import { UserOutlined, SendOutlined } from "@ant-design/icons";
import {
    useGetDiscussionQuery,
    useCreateReplyMutation, useGetAdminRepliesQuery
} from "../../../../../../services/discussion/discussion.service.ts";
import { useState } from "react";
import ReplyItem from "./ReplyItem"; // Component đã hướng dẫn ở lượt trước

interface Props {
    discussionId: number | null;
    isOpen: boolean;
    onClose: () => void;
}

const DiscussionDetail = ({ discussionId, isOpen, onClose }: Props) => {
    const { data: post, isLoading } = useGetDiscussionQuery(discussionId!, { skip: !discussionId });
    const { data: replies } = useGetAdminRepliesQuery(discussionId!, { skip: !discussionId });
    const [createReply, { isLoading: isSubmitting }] = useCreateReplyMutation();
    const [adminComment, setAdminComment] = useState("");

    const formatDateTime = (isoString: string | undefined) => {
        if (!isoString) {return "Invalid Date";}

        const date = new Date(isoString);
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleSendReply = async (content: string, parentId?: number) => {
        try {
            await createReply({
                discussionId: discussionId!,
                data: { content, parent_reply_id: parentId || null }
            }).unwrap();
            message.success("Đã gửi phản hồi");
            if (!parentId) setAdminComment("");
        } catch (err) {
            message.error(`Lỗi khi gửi phản hồi [${err}]`);
        }
    };

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={1000}
            centered
            className="discussion-detail-modal"
        >
            {isLoading ? (
                <div className="p-20 text-center"><Spin size="large" /></div>
            ) : (
                <div className="flex flex-col h-[85vh]">
                    {/* Header: Thông tin bài viết */}
                    <div className="p-6 bg-white/5 border-b border-white/5">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex gap-3">
                                <Avatar src={post?.user.avatar_url} icon={<UserOutlined />} className="border border-emerald-500/50" />
                                <div>
                                    <h2 className="text-xl font-bold text-white">{post?.title}</h2>
                                    <p className="text-xs text-gray-500">Bởi {post?.user.full_name} • {formatDateTime(post?.created_at)}</p>
                                </div>
                            </div>
                            <Tag className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 uppercase font-bold text-[10px]">
                                {post?.discussion_type}
                            </Tag>
                        </div>
                        <div
                            className="text-gray-300 text-sm leading-relaxed max-h-40 overflow-y-auto custom-scrollbar"
                            dangerouslySetInnerHTML={{ __html: post?.content || "" }}
                        />
                    </div>

                    {/* Danh sách Reply */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                        <h3 className="text-gray-500 text-[11px] font-bold uppercase tracking-widest">
                            Phản hồi ({post?.reply_count || 0})
                        </h3>
                        {replies ? (replies.map(reply => (
                            <ReplyItem
                                key={reply.reply_id}
                                reply={reply}
                                onReply={(c, pId) => handleSendReply(c, pId)}
                                isSubmitting={isSubmitting}
                            />
                        ))) : (
                            <div>
                                Không có phản hồi
                            </div>
                            )}
                    </div>

                    {/* Footer: Ô nhập phản hồi nhanh của Admin */}
                    <div className="p-4 bg-black/40 border-t border-white/5">
                        <div className="flex gap-3">
                            <Input.TextArea
                                value={adminComment}
                                onChange={(e) => setAdminComment(e.target.value)}
                                placeholder="Viết phản hồi của Admin..."
                                autoSize={{ minRows: 1, maxRows: 4 }}
                                className="bg-white/5 border-white/10 text-white hover:border-emerald-500/50"
                            />
                            <Button
                                type="primary"
                                icon={<SendOutlined />}
                                onClick={() => handleSendReply(adminComment)}
                                loading={isSubmitting}
                                className="h-full bg-emerald-600 border-none"
                            >
                                Gửi
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default DiscussionDetail;