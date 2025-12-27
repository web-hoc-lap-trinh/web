import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Skeleton, DatePicker } from "antd";
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

// Bảng màu hiện đại cho biểu đồ
const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];

interface Props {
    data: any[] | undefined;
    loading: boolean;
    onDateChange: (dates: any) => void;
}

const CategoryDistributionChart = ({ data, loading, onDateChange }: Props) => {
    if (loading) return <Skeleton active className="bg-[#1e293b]/50 p-6 rounded-[24px] h-[400px]" />;

    return (
        <div className="bg-[#1e293b]/50 backdrop-blur-xl border border-white/5 p-6 rounded-[24px] h-full">
            <div className="flex flex-col mb-6 gap-4">
                <div>
                    <h3 className="text-white text-lg font-semibold">Phân bố bài học</h3>
                    <p className="text-gray-400 text-xs">Tỷ lệ bài học theo từng danh mục</p>
                </div>

                {/* Bộ lọc thời gian */}
                <RangePicker
                    className="bg-white/5 border-none hover:bg-white/10"
                    onChange={onDateChange}
                    placeholder={['Từ ngày', 'Đến ngày']}
                />
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="lesson_count"
                            nameKey="category_name"
                        >
                            {data?.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default CategoryDistributionChart;