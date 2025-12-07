import { CaretDownFilled, CaretUpFilled } from "@ant-design/icons";
import { Button, message } from "antd";
import { clsx } from "clsx";
import { useVoteMutation } from "../../../../../../services/discussion/discussion.service";
import type { VoteType } from "../../../../../../types/discussion.types";

interface VoteControlProps {
  discussionId?: number;
  replyId?: number;
  voteCount: number;
  userVote?: VoteType | null;
  size?: "small" | "normal";
}

const VoteControl = ({ discussionId, replyId, voteCount, userVote, size = "normal" }: VoteControlProps) => {
  const [vote, { isLoading }] = useVoteMutation();

  const handleVote = async (type: VoteType) => {
    if (isLoading) return;
    try {
        await vote({ discussion_id: discussionId, reply_id: replyId, vote_type: type }).unwrap();
    } catch (err) {
        message.error("Lỗi khi vote");
    }
  };

  const isUpvoted = userVote === "UPVOTE";
  const isDownvoted = userVote === "DOWNVOTE";

  return (
    <div className={clsx("flex flex-col items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/5", size === "small" && "scale-90")}>
      <Button
        type="text"
        size="small"
        onClick={() => handleVote("UPVOTE")}
        className={clsx(
          "flex items-center justify-center min-w-[24px] h-6 p-0 border-none",
          isUpvoted ? "text-emerald-400 hover:text-emerald-300" : "text-gray-500 hover:text-emerald-400"
        )}
        icon={<CaretUpFilled className="text-xl" />}
      />
      
      <span className={clsx("font-bold text-sm", isUpvoted ? "text-emerald-400" : isDownvoted ? "text-red-400" : "text-gray-300")}>
        {voteCount}
      </span>

      <Button
        type="text"
        size="small"
        onClick={() => handleVote("DOWNVOTE")}
        className={clsx(
          "flex items-center justify-center min-w-[24px] h-6 p-0 border-none",
          isDownvoted ? "text-red-400 hover:text-red-300" : "text-gray-500 hover:text-red-400"
        )}
        icon={<CaretDownFilled className="text-xl" />}
      />
    </div>
  );
};

export default VoteControl;