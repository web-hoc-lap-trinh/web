import { ConfigProvider, theme, Skeleton, Empty, Button } from "antd";
import { useGetDailyChallengeQuery } from "../../../../services/problem/problem.service";
import { useGetDailyActivityTodayQuery } from "../../../../services/daily-activity/daily-activity.service";
import DailyChallengeHero from "./components/DailyChallengeHero";
import DailyProblemItem from "./components/DailyProblemItem";
import { RocketOutlined, SyncOutlined } from "@ant-design/icons";

const ChallengePage = () => {
  const {
    data: dailyProblems,
    isLoading: isLoadingProblems,
    isError,
    refetch
  } = useGetDailyChallengeQuery();

  const {
    data: activityStats,
    isLoading: isLoadingStats
  } = useGetDailyActivityTodayQuery();

  const problemsSolvedCount = activityStats?.problems_solved || 0;
  const currentStreak = activityStats?.streak_day || 0;
  const totalProblems = dailyProblems?.length || 5;

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#10b981",
          colorBgContainer: "#0a1916",
        },
      }}
    >
      <div className="min-h-screen bg-[#030e0c] pb-16 pt-20 font-sans text-white">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-8">
            <DailyChallengeHero
              completedCount={problemsSolvedCount}
              total={totalProblems}
            />
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Danh sách bài tập</h2>
                <Button type="link" className="text-emerald-400! p-0" onClick={() => refetch()}>
                  <SyncOutlined spin={isLoadingProblems} />
                </Button>
              </div>

              {isLoadingProblems ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton.Button key={i} active block className="h-20! rounded-xl!" />
                  ))}
                </div>
              ) : isError || !dailyProblems || dailyProblems.length === 0 ? (
                <Empty
                  description={<span className="text-gray-400">Không có thử thách nào hôm nay</span>}
                  className="py-10 bg-white/5 rounded-2xl border border-white/5 border-dashed"
                />
              ) : (
                <div className="space-y-3">
                  {dailyProblems.map((problem) => (
                    <DailyProblemItem
                      key={problem.problem_id}
                      problem={problem}
                      isSolved={false}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-3xl border border-emerald-500/20 bg-linear-to-br from-emerald-900/20 to-[#0a1916] p-6 text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-3xl text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  <RocketOutlined />
                </div>

                {isLoadingStats ? (
                  <Skeleton.Button active className="mb-2 w-24!" />
                ) : (
                  <div className="text-3xl font-extrabold text-white animate-fade-in">
                    {currentStreak} Ngày
                  </div>
                )}

                <div className="text-sm font-medium text-emerald-400">Current Streak</div>
                <p className="mt-2 text-xs text-gray-400">
                  Giải ít nhất 1 bài mỗi ngày để duy trì chuỗi lửa!
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default ChallengePage;