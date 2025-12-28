import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Empty } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetLessonQuery } from "../../../../../services/lesson/lesson.service";
import LessonHeader from "./components/LessonHeader";
import LessonContentTabs from "./components/LessonContentTabs";
import LessonDetailSkeleton from "./components/LessonDetailSkeleton";

const LessonDetailPage = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const { data: lesson, isLoading, isError } = useGetLessonQuery(
    lessonId ? Number(lessonId) : skipToken
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
      <LessonHeader lesson={lesson} />
      <div className="container mx-auto max-w-6xl px-4 py-10">
        <LessonContentTabs lesson={lesson} />
      </div>
    </div>
  );
};

export default LessonDetailPage;
