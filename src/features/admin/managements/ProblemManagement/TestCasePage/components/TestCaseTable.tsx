import type {IProblem, ITestCase} from "../../../../../../types/problem.types.ts";
import {useEffect, useMemo, useState} from "react";
import {useGetProblemTestCasesQuery} from "../../../../../../services/problem/problem.service.ts";
import {
    CheckCircleOutlined,
    ClockCircleOutlined, CloseCircleOutlined, CodeOutlined,
    DeleteOutlined, DownOutlined, EditOutlined, SearchOutlined, StarFilled
} from "@ant-design/icons";
import {Skeleton} from "antd";

interface TestCaseTableProps {
    onEdit: (testCase: ITestCase) => void;
    problems: IProblem[];
    loading: boolean;
}

const TestCaseTable = ({onEdit, problems, loading}: TestCaseTableProps) => {
    const [selectedProblemId, setSelectedProblemId] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState('');
    const {data: testCases, isFetching} = useGetProblemTestCasesQuery(selectedProblemId, {
        skip: selectedProblemId === 0,
        refetchOnMountOrArgChange: true
    });

    useEffect(() => {
        if (problems.length > 0 && selectedProblemId === 0) {
            setSelectedProblemId(problems[0].problem_id);
        }
    }, [problems, selectedProblemId]);

    const filteredTestCases = useMemo(() => {
        if (!testCases) return [];
        return testCases.filter(ex => {
            const searchLower = searchQuery.toLowerCase();
            return ex.input_data.toLowerCase().includes(searchLower) ||
                ex.expected_output.toString().includes(searchLower);
        });
    }, [searchQuery, testCases]);

    const getProblemName = (exId: number) => {
        return problems.find(e => e.problem_id === exId)?.title || 'N/A';
    };

    const formatDateTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({length: 6}).map((_, idx) => (
                    <Skeleton
                        key={idx}
                        active
                        className="bg-white/5! rounded-2xl! p-5!"
                        paragraph={{rows: 3}}
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Filters */}
            <div className="bg-[#1a202c]/60 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl p-6 flex lg:flex-row gap-6 items-center">
                {(isFetching || loading) && (
                    <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] z-10 rounded-3xl flex items-center justify-center">
                        <div className="text-emerald-400 animate-pulse font-bold text-xs tracking-widest uppercase">Đang tải dữ liệu...</div>
                    </div>
                )}
                {/* Exercise Selector */}
                <div className="w-1/3 lg:w-72 space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Chọn bài tập</label>
                    <div className="relative group">
                        <select
                            value={selectedProblemId}
                            onChange={(e) => {
                                setSelectedProblemId(Number(e.target.value))
                            }}
                            className="w-full pl-12 pr-10 py-3 bg-[#0f131a]/50 text-gray-200 rounded-xl border border-white/5 outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none cursor-pointer shadow-inner text-sm transition-all"
                        >
                            <option value="" disabled>-- Chọn bài học để xem --</option>
                            {problems.map(problem => (
                                <option key={problem.problem_id} value={problem.problem_id}>{problem.title}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                            <DownOutlined size={16} className="rotate-90"/>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="flex-1 w-full space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Tìm kiếm nội dung test case</label>
                    <div className="relative group">
                        <SearchOutlined size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Tìm kiếm dữ liệu input hoặc output..."
                            className="w-full pl-12 pr-4 py-3.5 bg-[#0f131a]/50 text-gray-200 rounded-xl border border-white/10 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder-gray-600 text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Test Case Table */}
            <div className="bg-[#1a202c]/60 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-400 uppercase bg-black/20">
                        <tr>
                            <th className="px-6 py-5 font-semibold">Input Data</th>
                            <th className="px-6 py-5 font-semibold">Expected Output</th>
                            <th className="px-6 py-5 font-semibold text-center">Loại (Sample)</th>
                            <th className="px-6 py-5 font-semibold text-center">Điểm</th>
                            <th className="px-6 py-5 font-semibold text-center">Ngày tạo</th>
                            <th className="px-6 py-5"></th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                        {filteredTestCases.length > 0 ? (
                            filteredTestCases.map((tc) => (
                                <tr key={tc.test_case_id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                        <pre className="bg-black/40 p-2 rounded-lg text-[11px] font-mono text-emerald-400/90 border border-white/5 max-w-[200px] overflow-hidden truncate">
                          {tc.input_data}
                        </pre>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                      <pre className="bg-black/40 p-2 rounded-lg text-[11px] font-mono text-amber-400/90 border border-white/5 max-w-[200px] overflow-hidden truncate">
                        {tc.expected_output}
                      </pre>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <div className="flex justify-center">
                                            {tc.is_sample ? (
                                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider">
                                                    <CheckCircleOutlined size={12} />
                                                    Sample
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-500/10 text-gray-500 border border-white/5 text-[10px] font-bold uppercase tracking-wider">
                                                    <CloseCircleOutlined size={12} />
                                                    Hidden
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <div className="flex items-center justify-center gap-1 font-bold text-emerald-400">
                                            <StarFilled size={12} className="fill-emerald-400/20" />
                                            {tc.score}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <div className="flex items-center justify-center gap-1.5 text-gray-500 text-xs">
                                            <ClockCircleOutlined size={12} />
                                            {formatDateTime(tc.created_at)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => onEdit(tc)}
                                                className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-all"
                                            >
                                                <EditOutlined size={18} />
                                            </button>
                                            <button
                                                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                            >
                                                <DeleteOutlined size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-20 text-center">
                                    <div className="flex flex-col items-center gap-3 opacity-30">
                                        <CodeOutlined size={48} className="text-gray-400" />
                                        <p className="text-sm font-medium tracking-wide">Không tìm thấy test case nào cho bài tập này</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="h-14 bg-black/10 border-t border-white/5 flex items-center justify-between px-8">
           <span className="text-[11px] text-gray-600 font-bold uppercase tracking-widest">
             {selectedProblemId === 0 ? 'Tất cả bài tập' : getProblemName(selectedProblemId)}
           </span>
                    <span className="text-[11px] text-emerald-500/70 font-bold uppercase tracking-widest">
             {filteredTestCases.length} Test Cases
           </span>
                </div>
            </div>
        </div>
    );
}

export default TestCaseTable