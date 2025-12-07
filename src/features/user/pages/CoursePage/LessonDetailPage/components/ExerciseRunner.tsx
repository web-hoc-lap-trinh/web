import { 
  ArrowLeftOutlined, 
  ArrowRightOutlined, 
  CheckCircleOutlined, 
  FlagOutlined, 
} from "@ant-design/icons";
import { Button, Progress, Skeleton, message } from "antd";
import { useEffect, useState } from "react";
import { 
  useGetExerciseDetailQuery, 
  useStartLessonExerciseQuery, 
  useSubmitAnswerMutation 
} from "../../../../../../services/exercise/exercise.service";
import type { SubmitAnswerResponse } from "../../../../../../services/exercise/exercise.types";
import ExerciseOption from "./ExerciseOption";

interface ExerciseRunnerProps {
  lessonId: string;
  onExit: () => void;
}

const ExerciseRunner = ({ lessonId, onExit }: ExerciseRunnerProps) => {
  const [currentExerciseId, setCurrentExerciseId] = useState<number | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [result, setResult] = useState<SubmitAnswerResponse | null>(null);

  const { 
    data: startData, 
    isLoading: isStarting, 
    isSuccess: isStartSuccess 
  } = useStartLessonExerciseQuery(lessonId, { skip: !!currentExerciseId });

  const { 
    data: detailData, 
    isLoading: isLoadingDetail,
    isFetching: isFetchingDetail
  } = useGetExerciseDetailQuery(currentExerciseId || 0, { skip: !currentExerciseId });

  const [submitAnswer, { isLoading: isSubmitting }] = useSubmitAnswerMutation();
  useEffect(() => {
    if (isStartSuccess && startData && !currentExerciseId) {
      setCurrentExerciseId(startData.exercise.exercise_id);
    }
  }, [isStartSuccess, startData]);

  const activeSession = currentExerciseId && detailData ? detailData : startData;
  const currentExercise = activeSession?.exercise;
  const navigation = activeSession?.navigation;

  const handleSubmit = async () => {
    if (!currentExerciseId || !selectedOptionId) return;
    try {
      const res = await submitAnswer({
        exerciseId: currentExerciseId,
        data: { answer: selectedOptionId }
      }).unwrap();
      setResult(res);
    } catch (error) {
      message.error("Lỗi khi nộp bài");
    }
  };

  const handleNext = () => {
    if (navigation?.next_exercise_id) {
      setResult(null);
      setSelectedOptionId(null);
      setCurrentExerciseId(navigation.next_exercise_id);
    } else {
      message.success("Chúc mừng bạn đã hoàn thành bài tập!");
      onExit();
    }
  };

  if (isStarting || !currentExercise) {
    return (
      <div className="p-8 bg-white/5 border border-white/10 rounded-2xl min-h-[400px]">
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  const progressPercent = navigation 
    ? Math.round((navigation.current_index / navigation.total_questions) * 100) 
    : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-xl">
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          className="text-gray-400 hover:text-white"
          onClick={onExit}
        />
        <div className="flex-1">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>Câu hỏi {navigation?.current_index} / {navigation?.total_questions}</span>
            <span>{progressPercent}% hoàn thành</span>
          </div>
          <Progress 
            percent={progressPercent} 
            showInfo={false} 
            strokeColor={{ '0%': '#10b981', '100%': '#34d399' }} 
            trailColor="rgba(255,255,255,0.1)"
            size="small"
          />
        </div>
      </div>

      <div className="bg-[#051311] border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="relative z-10 mb-8">
            <h3 className="text-white text-xl md:text-2xl font-semibold leading-relaxed">
                {currentExercise.question}
            </h3>
        </div>
        <div className="relative z-10 grid grid-cols-1 gap-3 mb-8">
            {currentExercise.options.map((opt) => (
                <ExerciseOption 
                    key={opt.id}
                    option={opt}
                    isSelected={selectedOptionId === opt.id}
                    isSubmitted={!!result}
                    isCorrect={result?.correct_answer === opt.id}
                    isUserSelected={selectedOptionId === opt.id}
                    onClick={() => !result && setSelectedOptionId(opt.id)}
                />
            ))}
        </div>

        {result && (
            <div className={`mb-8 p-5 rounded-xl border ${result.is_correct ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                <div className="flex items-center gap-2 font-bold mb-2">
                    {result.is_correct ? (
                        <span className="text-emerald-400"><CheckCircleOutlined /> Chính xác!</span>
                    ) : (
                        <span className="text-red-400"><FlagOutlined /> Chưa chính xác</span>
                    )}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                    <strong className="text-gray-200">Giải thích:</strong> {result.explanation}
                </p>
            </div>
        )}

        <div className="flex justify-between items-center pt-6 border-t border-white/10">
            {isFetchingDetail ? <span className="text-emerald-500 text-sm animate-pulse">Đang tải câu hỏi...</span> : <span></span>}

            {!result ? (
                <Button 
                    type="primary"
                    size="large"
                    onClick={handleSubmit}
                    loading={isSubmitting}
                    disabled={!selectedOptionId}
                    className="!bg-emerald-600 hover:!bg-emerald-500 border-none px-8 font-semibold shadow-lg shadow-emerald-900/20"
                >
                    Kiểm tra
                </Button>
            ) : (
                <Button 
                    type="primary"
                    size="large"
                    onClick={handleNext}
                    icon={<ArrowRightOutlined />}
                    iconPosition="end"
                    className="!bg-gray-100 !text-gray-900 hover:!bg-white border-none px-8 font-semibold shadow-lg shadow-white/10"
                >
                    {navigation?.is_last ? "Hoàn thành" : "Câu tiếp theo"}
                </Button>
            )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseRunner;