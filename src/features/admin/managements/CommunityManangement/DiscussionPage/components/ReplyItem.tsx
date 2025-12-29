import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import type {IAdminReply} from "../../../../../../types/discussion.types.ts";

interface ReplyItemProps {
    reply: IAdminReply;
}

const ReplyItem = ({ reply }: ReplyItemProps) => {
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
                </div>
            </div>
        </div>
    );
};

export default ReplyItem;