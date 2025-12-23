import { Avatar, Tag } from "antd";
import { EyeOutlined, CommentOutlined, CaretUpOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { IDiscussion } from "../../../../../types/discussion.types";

dayjs.extend(relativeTime);

interface DiscussionListItemProps {
  discussion: IDiscussion;
  onClick: () => void;
}

const DiscussionListItem = ({ discussion, onClick }: DiscussionListItemProps) => {
  // Mapping Tag Colors giống LeetCode
  const getTypeTag = () => {
    switch(discussion.discussion_type) {
        case "SOLUTION": return <Tag color="blue" className="mr-2 border-none">Solution</Tag>;
        case "QUESTION": return <Tag color="cyan" className="mr-2 border-none">Question</Tag>;
        case "BUG_REPORT": return <Tag color="red" className="mr-2 border-none">Bug</Tag>;
        default: return null;
    }
  };

  return (
    <div 
      onClick={onClick}
      className="group flex gap-3 p-4 hover:bg-white/5 cursor-pointer transition-colors"
    >
      <div className="flex-shrink-0 pt-1">
        <Avatar 
            src={discussion.user.avatar_url} 
            icon={<UserOutlined />} 
            size="small"
            className="bg-white/10"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
            <div className="pr-4">
                <h4 className="text-gray-200 font-medium text-sm mb-1 truncate group-hover:text-emerald-500 transition-colors">
                    {discussion.title}
                </h4>
                <div className="flex items-center text-xs text-gray-500 gap-2">
                    <span className="text-gray-400 hover:text-white transition-colors">{discussion.user.full_name}</span>
                    <span>•</span>
                    <span>{dayjs(discussion.created_at).fromNow()}</span>
                </div>
            </div>
        </div>
        
        <div className="mt-2 flex items-center">
            {getTypeTag()}
            {discussion.is_solution && discussion.discussion_type !== 'SOLUTION' && (
                <Tag color="green" className="mr-2 border-none">Answered</Tag>
            )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-1 text-xs text-gray-500 min-w-[40px]">
         {/* <div className="flex items-center gap-1">
            <EyeOutlined /> {discussion.view_count}
         </div> */}
         <div className="flex items-center gap-1">
            <CommentOutlined /> {discussion.total_replies}
         </div>
      </div>
    </div>
  );
};

export default DiscussionListItem;