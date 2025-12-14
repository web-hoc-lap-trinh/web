import { Input, Select, Tag } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import type { Difficulty, ProblemListQuery } from "../../../../../types/problem.types";

interface Props {
  search: string;
  onSearch: (value: string) => void;
  difficulty?: Difficulty;
  onDifficultyChange: (value: Difficulty | undefined) => void;
  sort: ProblemListQuery["sort"];
  order: ProblemListQuery["order"];
  onSortChange: (value: ProblemListQuery["sort"]) => void;
  onOrderChange: (value: ProblemListQuery["order"]) => void;
}

const difficultyOptions: { label: string; value?: Difficulty; color: string }[] = [
  { label: "Tất cả", value: undefined, color: "default" },
  { label: "Dễ", value: "EASY", color: "success" },
  { label: "Trung bình", value: "MEDIUM", color: "gold" },
  { label: "Khó", value: "HARD", color: "error" },
];

const sortOptions: { label: string; value: ProblemListQuery["sort"] }[] = [
  { label: "Mới nhất", value: "created_at" },
  { label: "Tiêu đề", value: "title" },
  { label: "Độ khó", value: "difficulty" },
  { label: "Nộp bài", value: "submission_count" },
  { label: "AC", value: "accepted_count" },
];

const ProblemFilters = ({
  search,
  onSearch,
  difficulty,
  onDifficultyChange,
  sort,
  order,
  onSortChange,
  onOrderChange,
}: Props) => {
  return (
    <div className="bg-[#0a1916] border border-white/5 rounded-2xl p-5 shadow-lg shadow-emerald-900/10">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <Input
            prefix={<SearchOutlined className="text-gray-500" />}
            placeholder="Tìm kiếm bài tập..."
            allowClear
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="bg-black/20 border-white/10 text-white placeholder:text-gray-600 hover:border-emerald-500/50 focus:border-emerald-500 h-10 rounded-xl"
          />
        </div>

        {/* Sort & Order */}
        <div className="flex gap-2 min-w-[300px]">
          <Select
            value={sort}
            onChange={onSortChange}
            options={sortOptions}
            className="flex-1 h-10"
            suffixIcon={<FilterOutlined className="text-gray-500" />}
            variant="filled" 
          />
          <Select
            value={order}
            onChange={onOrderChange}
            options={[
              { label: "Giảm dần", value: "DESC" },
              { label: "Tăng dần", value: "ASC" },
            ]}
            className="w-32 h-10"
            variant="filled"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <span className="text-sm text-gray-500 mr-2">Độ khó:</span>
        {difficultyOptions.map((opt) => {
           const isActive = difficulty === opt.value;
           return (
            <Tag
              key={opt.label}
              className={`cursor-pointer px-4 py-1.5 rounded-lg border text-sm transition-all select-none ${
                isActive
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-semibold"
                  : "bg-white/5 text-gray-400 border-transparent hover:border-white/20 hover:text-gray-200"
              }`}
              onClick={() => onDifficultyChange(opt.value)}
            >
              {opt.label}
            </Tag>
          );
        })}
      </div>
    </div>
  );
};

export default ProblemFilters;
