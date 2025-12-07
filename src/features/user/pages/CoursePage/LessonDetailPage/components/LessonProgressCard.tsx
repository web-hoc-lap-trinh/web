import { CheckCircleFilled } from "@ant-design/icons";

const LessonProgressCard = () => {
  const progress = 0; // TODO: Get from user progress API

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg">
      <h3 className="text-white font-semibold text-lg mb-5 flex items-center gap-2">
        <span className="w-1 h-6 bg-emerald-500 rounded-full inline-block"></span>
        Tiến độ học tập
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400 font-medium">Hoàn thành</span>
          <span className="text-emerald-400 font-bold text-lg">{progress}%</span>
        </div>
        
        <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden border border-white/10">
          <div 
            className="bg-linear-to-r from-emerald-500 to-teal-500 h-full transition-all duration-500 shadow-sm shadow-emerald-500/50"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="pt-3 space-y-3 border-t border-white/10 mt-4">
          <div className="flex items-start gap-3 text-sm text-gray-400 hover:text-gray-300 transition-colors">
            <CheckCircleFilled className="text-gray-600 mt-0.5 text-base" />
            <span>Xem video bài giảng</span>
          </div>
          <div className="flex items-start gap-3 text-sm text-gray-400 hover:text-gray-300 transition-colors">
            <CheckCircleFilled className="text-gray-600 mt-0.5 text-base" />
            <span>Hoàn thành bài tập</span>
          </div>
          <div className="flex items-start gap-3 text-sm text-gray-400 hover:text-gray-300 transition-colors">
            <CheckCircleFilled className="text-gray-600 mt-0.5 text-base" />
            <span>Đạt điểm tối thiểu 70%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonProgressCard;
