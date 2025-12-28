import { 
  ArrowLeftOutlined, 
  ClockCircleOutlined, 
  PlayCircleFilled, 
} from "@ant-design/icons";
import { Button, Tag, Empty } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetLessonsByCategoryQuery } from "../../../../../services/lesson/lesson.service";
import { useMemo } from "react";
import LessonItem from "./components/LessonItem";
import CourseDetailSkeleton from "./components/CourseDetailSkeleton";

const CourseDetail = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const parsedCategoryId = Number(categoryId);
  const { data: lessons = [], isLoading } = useGetLessonsByCategoryQuery(
    Number.isFinite(parsedCategoryId) ? parsedCategoryId : skipToken
  );

  const categoryInfo = lessons.length > 0 ? lessons[0].category : null;

  const sortedLessons = useMemo(() => {
    return [...lessons].sort((a, b) => a.category.order_index - b.category.order_index);
  }, [lessons]);

  const totalViews = lessons.reduce((acc, curr) => acc + curr.view_count, 0);

  if (isLoading) {
    return <CourseDetailSkeleton />;
  }

  if (!lessons.length) {
    return (
      <div className="min-h-screen bg-[#051311] flex flex-col items-center justify-center p-4">
        <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate(-1)}
            className="mb-6 bg-transparent text-gray-400 border-white/10 hover:text-emerald-400 hover:border-emerald-400/70"
        >
            Quay lại
        </Button>
        <Empty 
            description={<span className="text-gray-400">Chưa có bài học nào trong chủ đề này</span>} 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#051311] text-gray-200 font-sans pb-20">
      <div className="bg-linear-to-b from-emerald-900/20 to-[#051311] border-b border-white/5 pt-28 pb-12 px-4">
        <div className="container mx-auto max-w-5xl">
            <button 
                onClick={() => navigate(-1)}
                className="group flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition-colors mb-6 text-sm font-medium"
            >
                <ArrowLeftOutlined /> Quay lại danh sách
            </button>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <Tag color="cyan" className="m-0 bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
                           {categoryInfo?.name || "Khóa học"}
                        </Tag>
                        <span className="text-gray-500 text-sm flex items-center gap-1">
                           <ClockCircleOutlined /> Cập nhật lần cuối: {new Date(lessons[0].updated_at).toLocaleDateString('vi-VN')}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-semibold md:font-bold text-white mb-3 md:mb-4">
                        {categoryInfo?.name ? `Lộ trình: ${categoryInfo.name}` : "Chi tiết khóa học"}
                    </h1>
                    <p className="text-gray-400 max-w-2xl text-sm md:text-base">
                        Khám phá {lessons.length} bài học được thiết kế bài bản từ cơ bản đến nâng cao. 
                        Hãy bắt đầu hành trình chinh phục kiến thức ngay hôm nay.
                    </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 flex gap-6 md:min-w-[220px]">
                    <div>
                        <div className="text-gray-400 text-[11px] uppercase font-semibold tracking-[0.12em]">Tổng bài học</div>
                        <div className="text-2xl font-semibold text-white mt-1">{lessons.length}</div>
                    </div>
                    <div className="w-px bg-white/10"></div>
                    <div>
                        <div className="text-gray-400 text-[11px] uppercase font-semibold tracking-[0.12em]">Lượt học</div>
                        <div className="text-2xl font-semibold text-white mt-1">{totalViews.toLocaleString()}</div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-emerald-500 rounded-full inline-block"></span>
                    Danh sách bài học
                </h2>

                {sortedLessons.map((lesson, index) => (
                    <LessonItem 
                        key={lesson.lesson_id} 
                        lesson={lesson} 
                        index={index} 
                    />
                ))}
            </div>
            <div className="lg:col-span-1">
                <div className="sticky top-28 space-y-6">
                    <div className="bg-linear-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-white font-bold text-lg mb-2">Sẵn sàng học chưa?</h3>
                            <p className="text-emerald-100/70 text-sm mb-4">
                                Bắt đầu ngay với bài học đầu tiên để nắm vững kiến thức nền tảng.
                            </p>
                            <Button 
                                type="primary" 
                                size="large"
                                className="w-full bg-emerald-500! hover:bg-emerald-400! border-none font-semibold h-11 shadow-lg shadow-emerald-900/20"
                                icon={<PlayCircleFilled />}
                                onClick={() => navigate(`/learn/${categoryId}`)}
                            >
                                Học ngay
                            </Button>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl"></div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;