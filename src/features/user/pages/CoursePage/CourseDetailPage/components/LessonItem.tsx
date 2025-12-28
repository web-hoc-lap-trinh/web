import { Tag } from "antd";
import { EyeOutlined, PlayCircleFilled, CheckCircleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { ILesson } from "../../../../../../types/lesson.types";

const LessonItem = ({ lesson, index }: { lesson: ILesson; index: number }) => {
    const navigate = useNavigate();

    const difficultyConfig = {
        BEGINNER: { color: "success", label: "Cơ bản" },
        INTERMEDIATE: { color: "warning", label: "Trung bình" },
        ADVANCED: { color: "error", label: "Nâng cao" },
    };
    
    const diff = difficultyConfig[lesson.difficulty_level] || difficultyConfig.BEGINNER;

    return (
        <div 
            onClick={() => navigate(`/learn/${lesson.lesson_id}`)}
            className="group relative bg-white/5 border border-white/5 hover:border-emerald-500/40 hover:bg-white/8 rounded-xl p-4 md:p-5 transition-all duration-300 cursor-pointer flex gap-4 md:gap-5 items-center"
        >
            <div className="shrink-0 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 font-mono text-xs md:text-sm group-hover:text-emerald-400 group-hover:border-emerald-500/50 transition-colors">
                {index + 1}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-medium text-lg truncate group-hover:text-emerald-400 transition-colors">
                        {lesson.title}
                    </h3>
                    <CheckCircleFilled className="text-emerald-500 text-sm" />
                </div>
                
                <div className="flex items-center gap-3 text-xs text-gray-500">
                    <Tag bordered={false} color={diff.color} className="m-0 text-[10px] px-2 py-0 leading-4 bg-white/5!">
                        {diff.label}
                    </Tag>
                    <span className="flex items-center gap-1">
                        <EyeOutlined /> {lesson.view_count} xem
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                    <span>{new Date(lesson.updated_at).toLocaleDateString('vi-VN')}</span>
                </div>
            </div>

            <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                    <PlayCircleFilled />
                </div>
            </div>
        </div>
    );
}

export default LessonItem;