import {
    ComposedChart, Line, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Skeleton, Select } from "antd";
import type {IUserGrowth} from "../../../../../types/dashboard.types.ts";

interface Props {
    data: IUserGrowth[] | undefined;
    loading: boolean;
    days: number;
    setDays: (value: number) => void;
}

const UserGrowthChart = ({ data, loading, days, setDays }: Props) => {
    if (loading) {
        return (
            <div className="bg-[#1e293b]/50 p-6 rounded-2xl h-[450px] flex items-center justify-center">
                <Skeleton active paragraph={{ rows: 8 }} />
            </div>
        );
    }

    const chartData = data?.map(item => ({
        ...item,
        displayDate: new Date(item.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
    }));

    return (
        <div className="bg-[#1e293b]/50 backdrop-blur-xl border border-white/5 p-6 rounded-2xl">
            {/* Header của biểu đồ */}
            <div className="flex sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h3 className="text-white text-lg font-semibold">Tăng trưởng người dùng</h3>
                    <p className="text-gray-400 text-xs">Thống kê chi tiết lượng người dùng mới và tổng quy mô</p>
                </div>

                <Select
                    value={days}
                    onChange={setDays}
                    className="w-32 custom-select"
                    variant="borderless"
                    popupClassName="bg-[#1e293b] border border-white/10"
                    options={[
                        { value: 7, label: <span className="text-gray-300">7 ngày</span> },
                        { value: 30, label: <span className="text-gray-300">30 ngày</span> },
                        { value: 90, label: <span className="text-gray-300">90 ngày</span> },
                    ]}
                    style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}
                />
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis
                            dataKey="displayDate"
                            stroke="#64748b"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        {/* Trục Y trái cho Tổng User */}
                        <YAxis
                            yAxisId="left"
                            stroke="#10b981"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                        />
                        {/* Trục Y phải cho User mới (thường số lượng nhỏ hơn nên cần trục riêng để cột không bị quá thấp) */}
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            stroke="#3b82f6"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                        />

                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#0f172a',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                fontSize: '12px'
                            }}
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        />
                        <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px' }} />

                        {/* Biểu đồ Cột cho Người dùng mới */}
                        <Bar
                            yAxisId="right"
                            name="Người dùng mới"
                            dataKey="new_users"
                            fill="#3b82f6"
                            barSize={days > 30 ? 8 : 20} // Tự động thu nhỏ cột nếu xem nhiều ngày
                            radius={[4, 4, 0, 0]}
                        />

                        {/* Biểu đồ Đường cho Tổng người dùng */}
                        <Line
                            yAxisId="left"
                            name="Tổng người dùng"
                            type="monotone"
                            dataKey="total_users"
                            stroke="#10b981"
                            strokeWidth={3}
                            dot={{ r: 3, fill: '#10b981', strokeWidth: 2, stroke: '#1e293b' }}
                            activeDot={{ r: 5, strokeWidth: 0 }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default UserGrowthChart;