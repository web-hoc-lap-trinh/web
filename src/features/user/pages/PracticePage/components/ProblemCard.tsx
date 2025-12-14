import { Button, Tooltip, Avatar } from "antd";
import { useNavigate } from "react-router-dom";
import {
  ClockCircleOutlined,
  FireOutlined,
  UserOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import type { IProblem } from "../../../../../types/problem.types";

interface Props {
  problem: IProblem;
  loading?: boolean;
}

const difficultyConfig: Record<IProblem["difficulty"], { label: string; color: string; bg: string }> = {
  EASY: { label: "Dễ", color: "#10b981", bg: "rgba(16, 185, 129, 0.1)" },     
  MEDIUM: { label: "Trung bình", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)" }, 
  HARD: { label: "Khó", color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)" },     
};

const stripHtml = (html?: string) => html?.replace(/<[^>]+>/g, "") || "";

const ProblemCard = ({ problem, loading }: Props) => {
  const navigate = useNavigate();
  const diff = difficultyConfig[problem.difficulty];
  
  const rate = problem.acceptance_rate 
    ? parseFloat(problem.acceptance_rate) 
    : problem.submission_count 
      ? Math.round(((problem.accepted_count || 0) / problem.submission_count) * 100) 
      : 0;

  return (
    <div
      className="group relative flex flex-col md:flex-row gap-5 rounded-2xl border border-white/5 bg-[#0a1916] p-5 transition-all duration-300 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-900/20 hover:-translate-y-1 cursor-pointer"
      onClick={() => navigate(`/practice/${problem.problem_id}`)}
    >
      <div 
        className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full transition-all group-hover:w-1.5"
        style={{ backgroundColor: diff.color }}
      />

      <div className="flex-1 pl-3">
        <div className="flex flex-wrap items-center gap-3 mb-2">
            <span 
              className="px-2.5 py-0.5 rounded-md text-xs font-bold border border-transparent"
              style={{ color: diff.color, backgroundColor: diff.bg, borderColor: `${diff.color}30` }}
            >
              {diff.label}
            </span>
            
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-xs text-gray-300">
               <TrophyOutlined className="text-yellow-500" />
               <span className="font-mono">{problem.points} pts</span>
            </div>

            <span className="text-gray-500 text-xs flex items-center gap-1 ml-auto md:ml-0">
               <ClockCircleOutlined /> 
               {new Date(problem.created_at).toLocaleDateString("vi-VN")}
            </span>
        </div>

        <h3 className="text-xl font-bold text-gray-100 group-hover:text-emerald-400 transition-colors mb-2">
          {problem.title}
        </h3>
        
        <p className="text-gray-400 text-sm line-clamp-2 mb-4 pr-4">
          {stripHtml(problem.description) || "Chưa có mô tả cho bài tập này..."}
        </p>

        <div className="flex flex-wrap gap-2">
          {problem.tags?.slice(0, 5).map((tag) => (
            <span
              key={tag.tag_id}
              className="text-xs px-2 py-1 rounded border transition-opacity hover:opacity-80"
              style={{
                color: tag.color || "#e5e7eb",
                backgroundColor: `${tag.color || "#ffffff"}15`, 
                borderColor: `${tag.color || "#ffffff"}30`
              }}
            >
              #{tag.name}
            </span>
          ))}
          {(problem.tags?.length || 0) > 5 && (
            <span className="text-xs px-2 py-1 rounded bg-white/5 text-gray-400 border border-white/10">
              +{problem.tags!.length - 5}
            </span>
          )}
        </div>
      </div>

      <div className="flex md:flex-col items-center justify-between md:justify-center md:items-end gap-4 md:border-l md:border-white/5 md:pl-5 min-w-[140px]">
        <div className="text-right hidden md:block">
           <div className="text-xs text-gray-400 mb-1">Tác giả</div>
           <div className="flex items-center justify-end gap-2 text-sm font-medium text-emerald-100/80">
              {problem.author?.full_name || "Admin"}
              <Avatar size="small" icon={<UserOutlined />} className="bg-emerald-700/50" />
           </div>
        </div>

        <div className="flex flex-col items-end">
           <div className="text-xs text-gray-400 mb-1">Tỷ lệ chấp nhận</div>
           <div className="flex items-center gap-2">
              <span className={`text-lg font-mono font-bold ${rate > 50 ? 'text-emerald-400' : rate > 20 ? 'text-yellow-400' : 'text-red-400'}`}>
                {typeof rate === 'number' ? rate.toFixed(1) : rate}%
              </span>
              <Tooltip title={`Đã giải: ${problem.accepted_count} / Tổng nộp: ${problem.submission_count}`}>
                 <CheckCircleOutlined className="text-gray-500 text-xs cursor-help" />
              </Tooltip>
           </div>
        </div>

        <Button
          type="primary"
          ghost
          className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10! hover:text-emerald-300!"
          icon={<FireOutlined />}
          loading={loading}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/practice/${problem.problem_id}`);
          }}
        >
          Giải ngay
        </Button>
      </div>
    </div>
  );
};

export default ProblemCard;