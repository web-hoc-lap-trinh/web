import { useEffect, useState } from "react";
import { Typography, Progress } from "antd";
import { FireFilled, ClockCircleOutlined, TrophyOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/vi";

dayjs.locale("vi");

const DailyChallengeHero = ({ completedCount = 0, total = 5 }: { completedCount?: number, total?: number }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = dayjs();
      const tomorrow = dayjs().endOf('day');
      const diff = tomorrow.diff(now);

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${h}h ${m}m ${s}s`);
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();
    return () => clearInterval(timer);
  }, []);

  const percent = Math.round((completedCount / total) * 100);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-r from-emerald-900/40 to-[#030e0c] p-8 shadow-2xl shadow-emerald-900/20">
      {/* Background Effects */}
      <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/4 rounded-full bg-emerald-500/20 blur-[100px]" />

      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange-400 border border-orange-500/20">
              <FireFilled className="mr-1" /> Daily Challenge
            </span>
            <span className="text-gray-400 text-sm">
              {dayjs().format("dddd, D MMMM, YYYY")}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Thử thách hôm nay
          </h1>
          <p className="max-w-xl text-lg text-gray-400">
            Hoàn thành 5 bài tập để nhận huy hiệu ngày và tích lũy điểm thưởng.
          </p>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-xl bg-black/40 px-4 py-2 border border-white/5">
              <ClockCircleOutlined className="text-emerald-400" />
              <span className="font-mono text-lg font-bold text-white">{timeLeft}</span>
              <span className="text-xs text-gray-500">còn lại</span>
            </div>
          </div>
        </div>

        {/* Progress Circle */}
        <div className="flex items-center gap-6 rounded-2xl bg-white/5 p-6 border border-white/5 backdrop-blur-sm">
          <Progress
            type="circle"
            percent={percent}
            size={80}
            strokeColor="#10b981"
            trailColor="rgba(255,255,255,0.1)"
            format={() => <TrophyOutlined className="text-2xl text-yellow-500" />}
          />
          <div>
            <div className="text-2xl font-bold text-white">{completedCount}/{total}</div>
            <div className="text-sm text-gray-400">Đã hoàn thành</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyChallengeHero;