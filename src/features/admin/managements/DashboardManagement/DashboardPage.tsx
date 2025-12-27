import HeaderBar from "../../../../components/common/HeaderBar.tsx";
import DashboardStats from "./components/DashboardStats.tsx";
import {
    useGetCategoryDistributionQuery,
    useGetDashboardStatsQuery, useGetProblemDifficultyQuery, useGetSubmissionAnalyticQuery,
    useGetUserGrowthQuery
} from "../../../../services/admin/admin.service.ts";
import UserGrowthChart from "./components/UserGrowthChart.tsx";
import {useState} from "react";
import CategoryDistributionChart from "./components/CategoryDistributionChart.tsx";
import SubmissionStatusChart from "./components/SubmissionStatusChart.tsx";
import ProblemDifficultyChart from "./components/ProblemDifficultyChart.tsx";

const DashboardPage = () => {
    const [days, setDays] = useState(30);
    const [dateRange, setDateRange] = useState<{startDate?: string, endDate?: string}>({});
    const [subDateRange, setSubDateRange] = useState({});
    const {data: stats, isLoading: statsLoading} = useGetDashboardStatsQuery()
    const { data: growthData, isLoading: growthLoading } = useGetUserGrowthQuery(days);
    const { data: categoryData, isLoading: categoryLoading } = useGetCategoryDistributionQuery(dateRange);
    const { data: submissionData, isLoading: subLoading } = useGetSubmissionAnalyticQuery(subDateRange);
    const { data: difficultyData, isLoading: diffLoading } = useGetProblemDifficultyQuery();

    const handleCatDateChange = (dates: any) => {
        if (dates) {
            setDateRange({
                startDate: dates[0].format('YYYY-MM-DD'),
                endDate: dates[1].format('YYYY-MM-DD')
            });
        } else {
            setDateRange({});
        }
    };

    const handleSubDateChange = (dates: any) => {
        if (dates) {
            setSubDateRange({
                startDate: dates[0].format('YYYY-MM-DD'),
                endDate: dates[1].format('YYYY-MM-DD')
            });
        } else {
            setSubDateRange({});
        }
    };

    return (
        <div className="flex-1 overflow-auto px-10 pb-10 z-10">
            <HeaderBar title={"Tổng quan"} />

            {/* Hàng 1: Thống kê số liệu nhanh */}
            <DashboardStats data={stats} loading={statsLoading} />

            {/* Hàng 2: Biểu đồ đường Tăng trưởng người dùng (Full Width) */}
            <div className="mt-8">
                <UserGrowthChart data={growthData} loading={growthLoading} days={days} setDays={setDays} />
            </div>

            {/* Hàng 3: Ba biểu đồ tròn bổ trợ (Grid 3 cột) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                <CategoryDistributionChart
                    data={categoryData}
                    loading={categoryLoading}
                    onDateChange={handleCatDateChange}
                />
                <SubmissionStatusChart
                    data={submissionData}
                    loading={subLoading}
                    onDateChange={handleSubDateChange}
                />
                <ProblemDifficultyChart
                    data={difficultyData}
                    loading={diffLoading}
                />
            </div>
        </div>
    )
};

export default DashboardPage;