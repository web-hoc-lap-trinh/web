import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Skeleton, DatePicker } from "antd";

const { RangePicker } = DatePicker;

// Màu sắc quy ước cho các trạng thái lập trình
const STATUS_COLORS: Record<string, string> = {
    'ACCEPTED': '#10b981',      // Xanh lá
    'WRONG_ANSWER': '#ef4444',  // Đỏ
    'TIME_LIMIT': '#f59e0b',    // Cam
    'RUNTIME_ERROR': '#8b5cf6', // Tím
    'COMPILE_ERROR': '#64748b', // Xám
    'MEMORY_LIMIT': '#3b82f6',  // Xanh dương
};

interface Props {
    data: any[] | undefined;
    loading: boolean;
    onDateChange: (dates: any) => void;
}

const SubmissionStatusChart = ({ data, loading, onDateChange }: Props) => {
    if (loading) return <Skeleton active className="bg-[#1e293b]/50 p-6 rounded-2xl h-[400px]" />;

    return (
        <div className="bg-[#1e293b]/50 backdrop-blur-xl border border-white/5 p-6 rounded-2xl h-full">
            <div className="flex flex-col mb-6 gap-4">
                <div>
                    <h3 className="text-white text-lg font-semibold">Trạng thái chấm bài</h3>
                    <p className="text-gray-400 text-xs">Tỷ lệ các kết quả nộp bài hệ thống</p>
                </div>

                <RangePicker
                    className="bg-white/5 border-none"
                    onChange={onDateChange}
                />
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="count"
                            nameKey="status"
                        >
                            {data?.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={STATUS_COLORS[entry.status] || '#cbd5e1'}
                                    stroke="none"
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }}
                            itemStyle={{ fontSize: '12px' }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            formatter={(value) => <span className="text-gray-400 text-xs">{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SubmissionStatusChart;