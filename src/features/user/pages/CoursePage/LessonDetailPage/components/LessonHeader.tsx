import { ClockCircleOutlined, EyeOutlined, BookOutlined } from "@ant-design/icons";
import { Tag, Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import type { ILesson } from "../../../../../../types/lesson.types";

interface LessonHeaderProps {
  lesson: ILesson;
}

const LessonHeader = ({ lesson }: LessonHeaderProps) => {
  const difficultyConfig = {
    BEGINNER: { color: "success", label: "Cơ bản", icon: "🟢" },
    INTERMEDIATE: { color: "warning", label: "Trung bình", icon: "🟡" },
    ADVANCED: { color: "error", label: "Nâng cao", icon: "🔴" },
  };

  const diff = difficultyConfig[lesson.difficulty_level] || difficultyConfig.BEGINNER;

  return (
    <div className="bg-linear-to-b from-emerald-900/20 to-[#051311] border-b border-white/5 pt-24 pb-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <Breadcrumb
          className="mb-4 [&_.ant-breadcrumb-link]:!text-gray-400 [&_.ant-breadcrumb-link]:hover:!text-emerald-400 [&_.ant-breadcrumb-separator]:!text-gray-100"
          items={[
            { title: <Link to="/user/courses"><span className="text-gray-100">Khóa học</span></Link> },
            { 
              title: <Link to={`/user/courses/${lesson.category.category_id}`}>
                <span className="text-gray-100">{lesson.category.name}</span>
              </Link> 
            },
            { title: lesson.title }
          ]}
        />

        <div className="mt-4 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Tag 
                color="cyan" 
                className="m-0 bg-emerald-500/10 border-emerald-500/20 text-emerald-400 px-3 py-1"
              >
                <BookOutlined className="mr-1" /> {lesson.category.name}
              </Tag>
              <Tag 
                bordered={false} 
                color={diff.color} 
                className="m-0 text-xs px-3 py-1 bg-white/5!"
              >
                <span className="mr-1">{diff.icon}</span>
                {diff.label}
              </Tag>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              {lesson.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <ClockCircleOutlined className="text-base" /> 
                <span>Cập nhật: {new Date(lesson.updated_at).toLocaleDateString('vi-VN')}</span>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-700"></span>
              <span className="flex items-center gap-2">
                <EyeOutlined className="text-base" /> 
                <span>{lesson.view_count.toLocaleString()} lượt xem</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonHeader;
