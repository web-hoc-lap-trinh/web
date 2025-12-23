import { useNavigate } from "react-router-dom";
import { Tag, Button } from "antd";
import { RightOutlined, CheckCircleFilled } from "@ant-design/icons";
import type { IProblem } from "../../../../../types/problem.types";

const difficultyColors = {
  EASY: { color: "#10b981", bg: "rgba(16, 185, 129, 0.1)" },
  MEDIUM: { color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)" },
  HARD: { color: "#f43f5e", bg: "rgba(244, 63, 94, 0.1)" },
};

const DailyProblemItem = ({ problem, isSolved }: { problem: IProblem; isSolved?: boolean }) => {
  const navigate = useNavigate();
  const diff = difficultyColors[problem.difficulty];

  return (
    <div 
      onClick={() => navigate(`/practice/${problem.problem_id}`)}
      className="group flex items-center justify-between rounded-xl border border-white/5 bg-[#0a1916] p-4 transition-all hover:border-emerald-500/50 hover:bg-white/5 cursor-pointer"
    >
      <div className="flex items-center gap-4">
        {/* Status Icon */}
        <div className={`flex h-10 w-10 items-center justify-center rounded-full border ${isSolved ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-white/10 bg-white/5'}`}>
            {isSolved ? <CheckCircleFilled className="text-emerald-500 text-lg" /> : <span className="text-gray-600 font-bold">{problem.problem_id}</span>}
        </div>

        <div>
          <h3 className="text-base font-bold text-gray-200 group-hover:text-emerald-400 transition-colors">
            {problem.title}
          </h3>
          <div className="mt-1 flex gap-2">
            <Tag
              bordered={false}
              className="m-0 rounded text-[10px] font-bold uppercase leading-tight"
              style={{ color: diff.color, backgroundColor: diff.bg }}
            >
              {problem.difficulty}
            </Tag>
            <span className="text-xs text-gray-500">• {problem.points} điểm</span>
          </div>
        </div>
      </div>

      <Button 
        type="text" 
        icon={<RightOutlined />} 
        className="text-gray-500 group-hover:text-emerald-400 group-hover:bg-emerald-500/10"
      />
    </div>
  );
};

export default DailyProblemItem;