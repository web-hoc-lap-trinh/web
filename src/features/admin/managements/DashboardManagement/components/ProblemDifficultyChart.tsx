import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Skeleton } from "antd";
import type {IProblemDifficulty} from "../../../../../types/dashboard.types.ts";

const DIFFICULTY_COLORS: Record<string, string> = {
    'EASY': '#3b82f6',   // Blue
    'MEDIUM': '#eab308', // Yellow
    'HARD': '#ef4444',   // Red
};

interface Props {
    data: IProblemDifficulty[] | undefined;
    loading: boolean;
}

type ChartItem = {
    difficulty: string;
    count: number;
    [key: string]: string | number | undefined;
};

const ProblemDifficultyChart = ({ data, loading }: Props) => {
    if (loading) return <Skeleton active className="bg-[#1e293b]/50 p-6 rounded-3xl h-[350px]" />;

    const chartData: ChartItem[] | undefined = data?.map((d) => ({ ...d }));

    return (
        <div className="bg-[#1e293b]/50 backdrop-blur-xl border border-white/5 p-6 rounded-3xl h-full">
            <div className="mb-6">
                <h3 className="text-white text-lg font-semibold">Độ khó bài tập</h3>
                <p className="text-gray-400 text-xs">Phân bố bài toán theo cấp độ</p>
            </div>

            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={8}
                            dataKey="count"
                            nameKey="difficulty"
                        >
                            {chartData?.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={DIFFICULTY_COLORS[(entry.difficulty as string)] || '#94a3b8'}
                                    stroke="none"
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }}
                            itemStyle={{ fontSize: '12px', textTransform: 'capitalize' }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            formatter={(value) => <span className="text-gray-400 text-xs uppercase">{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Hiển thị nhanh số liệu dưới biểu đồ */}
            <div className="flex justify-around mt-4">
                {data?.map((item) => (
                    <div key={item.difficulty} className="text-center">
                        <p className="text-gray-500 text-[10px] uppercase font-bold">{item.difficulty}</p>
                        <p className="text-white font-semibold">{item.count}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProblemDifficultyChart;