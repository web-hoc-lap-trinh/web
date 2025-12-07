import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Empty } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useGetLessonQuery } from "../../../../../services/lesson/lesson.service";
import LessonHeader from "./components/LessonHeader";
import LessonActions from "./components/LessonActions";
import LessonContentTabs from "./components/LessonContentTabs";
import LessonProgressCard from "./components/LessonProgressCard";
import RelatedLessonsCard from "./components/RelatedLessonsCard";
import SupportCard from "./components/SupportCard";
import LessonDetailSkeleton from "./components/LessonDetailSkeleton";

const LessonDetailPage = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const { data: lesson, isLoading, isError } = useGetLessonQuery(
    lessonId || "", 
    { skip: !lessonId }
  );

  if (isLoading) {
    return <LessonDetailSkeleton />;
  }

  if (isError || !lesson) {
    return (
      <div className="min-h-screen bg-[#051311] flex flex-col items-center justify-center p-4">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(-1)}
          className="mb-6 bg-transparent text-gray-400 border-white/10 hover:text-emerald-400! hover:border-emerald-400/70!"
        >
          Quay lại
        </Button>
        <Empty 
          description={
            <div className="text-center">
              <p className="text-gray-400 text-lg mb-1">Không tìm thấy bài học</p>
              <p className="text-gray-500 text-sm">Bài học có thể đã bị xóa hoặc không tồn tại</p>
            </div>
          }
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#051311] text-gray-200 font-sans pb-20">
      {/* Header Section */}
      <LessonHeader lesson={lesson} />

      {/* Actions - Mobile/Tablet View */}
      <div className="lg:hidden container mx-auto max-w-6xl px-4 -mt-4 mb-6">
        <LessonActions />
      </div>

      {/* Content Section */}
      <div className="container mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <LessonContentTabs lesson={lesson} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Actions - Desktop View */}
              <div className="hidden lg:block">
                <LessonActions />
              </div>

              <LessonProgressCard />
              <RelatedLessonsCard />
              <SupportCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonDetailPage;
