import { PlayCircleFilled, TrophyOutlined } from "@ant-design/icons";
import { Button } from "antd";

const LessonActions = () => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 flex flex-col gap-3 lg:min-w-60">
      <Button 
        type="primary" 
        size="large"
        icon={<PlayCircleFilled />}
        className="w-full !bg-emerald-500 hover:!bg-emerald-400 border-none font-semibold h-12 shadow-lg shadow-emerald-900/30 text-base"
      >
        Bắt đầu học
      </Button>
      <Button 
        size="large"
        icon={<TrophyOutlined />}
        className="w-full bg-white/5 hover:bg-white/10! border-white/10 text-gray-300 hover:text-white! font-medium h-12"
      >
        Làm bài tập
      </Button>
    </div>
  );
};

export default LessonActions;
