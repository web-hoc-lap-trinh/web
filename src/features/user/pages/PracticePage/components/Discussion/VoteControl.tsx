import { Button, message } from "antd";
import { useVoteMutation } from "../../../../../../services/discussion/discussion.service";
import type { VoteType } from "../../../../../../types/discussion.types";

interface VoteControlProps {
  voteCount: number;
  userVote?: VoteType | null;
  discussionId?: number;
  replyId?: number;
  orientation?: "vertical" | "horizontal"; 
}

const VoteControl = ({ 
  voteCount, 
  userVote, 
  discussionId, 
  replyId, 
  orientation = "vertical" 
}: VoteControlProps) => {
  const [vote] = useVoteMutation();

  const handleVote = async (type: VoteType) => {
    try {
      await vote({
        discussion_id: discussionId,
        reply_id: replyId,
        vote_type: type,
      }).unwrap();
    } catch (error) {
      message.error("Lỗi khi vote, vui lòng thử lại.");
    }
  };

  const isUpvoted = userVote === "UPVOTE";
  const isDownvoted = userVote === "DOWNVOTE";

  if (orientation === "horizontal") {
    return (
      <div className="flex items-center gap-1 bg-white/5 rounded-md p-1 border border-white/5">
        <Button 
            type="text" 
            size="small" 
            onClick={() => handleVote("UPVOTE")}
            className={`h-6 w-6 min-w-0 border-0 ${isUpvoted ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-500 hover:text-gray-300'}`}
        />
        <span className={`text-xs font-bold min-w-5 text-center ${isUpvoted ? 'text-emerald-400' : isDownvoted ? 'text-red-400' : 'text-gray-400'}`}>
            {voteCount}
        </span>
        <Button 
            type="text" 
            size="small" 
            onClick={() => handleVote("DOWNVOTE")}
            className={`h-6 w-6 min-w-0 border-0 ${isDownvoted ? 'text-red-400 bg-red-500/10' : 'text-gray-500 hover:text-gray-300'}`}
        />
      </div>
    );
  }

  // Vertical layout (cho bài post chính)
  return (
    <div className="flex flex-col items-center gap-1 pt-1">
      <Button 
        type="text" 
        onClick={() => handleVote("UPVOTE")}
        className={`border-0 h-auto p-1 ${isUpvoted ? 'text-emerald-400' : 'text-gray-500 hover:text-gray-300 hover:bg-transparent'}`}
      />
      <span className={`text-lg font-bold ${isUpvoted ? 'text-emerald-400' : isDownvoted ? 'text-red-400' : 'text-gray-300'}`}>
        {voteCount}
      </span>
      <Button 
        type="text" 
        onClick={() => handleVote("DOWNVOTE")}
        className={`border-0 h-auto p-1 ${isDownvoted ? 'text-red-400' : 'text-gray-500 hover:text-gray-300 hover:bg-transparent'}`}
      />
    </div>
  );
};

export default VoteControl;