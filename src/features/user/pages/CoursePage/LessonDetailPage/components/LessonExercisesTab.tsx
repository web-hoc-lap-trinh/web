import { PlayCircleFilled, FileTextOutlined } from "@ant-design/icons";
import { Button, Empty } from "antd";
import { useState } from "react";
import { useGetLessonExercisesQuery } from "../../../../../../services/exercise/exercise.service";
import ExerciseRunner from "./ExerciseRunner";

interface LessonExercisesTabProps {
  lessonId: string;
}

const LessonExercisesTab = ({ lessonId }: LessonExercisesTabProps) => {
  const [isStarted, setIsStarted] = useState(false);
  const { data: exercises = [], isLoading } = useGetLessonExercisesQuery(lessonId);
  if (isStarted) {
    return <ExerciseRunner lessonId={lessonId} onExit={() => setIsStarted(false)} />;
  }

  if (!isLoading && exercises.length === 0) {
    return (
      <div className="bg-[#051311] border border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center min-h-[400px]">
         <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-3xl text-gray-500 mb-4">
            <FileTextOutlined />
         </div>
         <h3 className="text-gray-300 font-medium text-lg mb-1">Chưa có bài tập</h3>
         <p className="text-gray-500 text-sm">Bài tập cho bài học này đang được cập nhật.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#051311] border border-white/10 rounded-2xl overflow-hidden shadow-xl shadow-black/20 relative min-h-[500px] flex flex-col items-center justify-center text-center p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/10 via-transparent to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#051311] to-transparent pointer-events-none"></div>

      <div className="relative z-10 max-w-md w-full">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 text-4xl mb-6 mx-auto shadow-lg shadow-emerald-500/10 border border-emerald-500/20">
            <FileTextOutlined />
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Bài tập thực hành
        </h2>
        
        <p className="text-gray-400 mb-8 leading-relaxed">
            Củng cố kiến thức vừa học thông qua <strong>{exercises.length} câu hỏi</strong> trắc nghiệm. 
            Bạn cần hoàn thành tối thiểu 80% để mở khóa bài học tiếp theo.
        </p>

        <div className="flex flex-col gap-3">
            <Button 
                type="primary" 
                size="large"
                icon={<PlayCircleFilled />}
                onClick={() => setIsStarted(true)}
                className="w-full !bg-emerald-500 hover:!bg-emerald-400 border-none font-bold h-12 text-base shadow-xl shadow-emerald-500/20"
            >
                Bắt đầu làm bài
            </Button>
            
            <div className="text-xs text-gray-500 mt-2">
                Thời gian ước tính: {Math.ceil(exercises.length * 1.5)} phút
            </div>
        </div>
      </div>
    </div>
  );
};

export default LessonExercisesTab;