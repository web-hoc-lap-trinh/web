import type {IProblem, ITestCase} from "../../../../../../types/problem.types.ts";
import {useEffect, useMemo, useState} from "react";
import {
    useDeleteTestCaseMutation,
    useGetProblemTestCasesQuery
} from "../../../../../../services/problem/problem.service.ts";
import {
    AppstoreOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined, CloseCircleOutlined,
    DeleteOutlined, EditOutlined,
    ExclamationCircleFilled, ReadOutlined, SearchOutlined, StarFilled, UnorderedListOutlined
} from "@ant-design/icons";
import {message, Modal, Skeleton} from "antd";

const {confirm} = Modal;

interface TestCaseTableProps {
    onEdit: (testCase: ITestCase) => void;
    problems: IProblem[];
    loading: boolean;
}

const TestCaseTable = ({onEdit, problems, loading}: TestCaseTableProps) => {
    const [selectedProblemId, setSelectedProblemId] = useState<number>(0);
    const [searchQueryProblem, setSearchQueryProblem] = useState('');
    const [searchQueryTestCase, setSearchQueryTestCase] = useState('');
    const {data: testCases} = useGetProblemTestCasesQuery(selectedProblemId, {
        skip: selectedProblemId === 0,
        refetchOnMountOrArgChange: true
    });
    const [deleteTestCase, {isLoading: isDeleting}] = useDeleteTestCaseMutation()

    useEffect(() => {
        if (problems.length > 0 && selectedProblemId === 0) {
            setSelectedProblemId(problems[0].problem_id);
        }
    }, [problems, selectedProblemId]);
    
    const filteredProblems = useMemo(() => {
        if(!problems) return [];
        return problems.filter((problem) => {
            const searchLower = searchQueryProblem.toLowerCase();
            return problem.title.toLowerCase().includes(searchLower);
        })
    }, [searchQueryProblem, problems]);

    const filteredTestCases = useMemo(() => {
        if (!testCases) return [];
        return testCases.filter(ex => {
            const searchLower = searchQueryTestCase.toLowerCase();
            return ex.input_data.toLowerCase().includes(searchLower) ||
                ex.expected_output.toString().includes(searchLower);
        });
    }, [searchQueryTestCase, testCases]);

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

    const handleDelete = (id: number, name: string) => {
        confirm({
            title: 'Xác nhận xóa Test case?',
            icon: <ExclamationCircleFilled />,
            content: `Bạn có chắc chắn muốn xóa "${name}"? Hành động này không thể hoàn tác.`,
            okText: 'Xóa ngay',
            okType: 'danger',
            cancelText: 'Hủy',
            centered: true,
            async onOk() {
                try {
                    await deleteTestCase(id).unwrap();
                    message.success('Đã xóa test case thành công');
                } catch (error: any) {
                    message.error(error?.data?.message || 'Không thể xóa test case này');
                }
            },
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
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                        <AppstoreOutlined size={18} className="text-emerald-400" />
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Chọn bài tập cần quản lý</h3>
                    </div>
                    <div className="relative group w-2/3 sm:w-80">
                        <SearchOutlined size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                        <input
                            type="text"
                            value={searchQueryProblem}
                            onChange={(e) => setSearchQueryProblem(e.target.value)}
                            placeholder="Tìm kiếm bài học"
                            className="w-full pl-11 pr-4 py-2.5 bg-[#0f131a]/60 text-gray-200 rounded-2xl border border-white/10 outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all placeholder-gray-600 shadow-inner text-sm"
                        />
                    </div>
                </div>

                <div className="max-h-[290px] overflow-y-auto pr-2">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredProblems.length > 0 ? (filteredProblems.map((problem) => (
                            <button
                                key={problem.problem_id}
                                onClick={() => setSelectedProblemId(problem.problem_id)}
                                className={`group relative flex flex-col p-4 rounded-2xl border transition-all duration-300 text-left overflow-hidden h-full ${
                                    selectedProblemId === problem.problem_id
                                        ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/20'
                                        : 'bg-[#0f131a]/40 border-white/5 hover:border-white/20 hover:bg-[#1a202c]/40'
                                }`}
                            >
                                <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center transition-all duration-300 ${
                                    selectedProblemId === problem.problem_id ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white/5 text-gray-500'
                                }`}>
                                    <ReadOutlined size={20} />
                                </div>
                                <span className={`text-sm font-bold tracking-tight line-clamp-1 ${selectedProblemId === problem.problem_id ? 'text-emerald-400' : 'text-gray-300'}`}>
                    {problem.title}
                  </span>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] text-white font-bold uppercase">{problem.difficulty}</span>
                                </div>
                            </button>
                        ))) : (
                            <td className="px-8 py-8 text-center">
                                <div className="flex flex-col items-center gap-3 opacity-20">
                                    <UnorderedListOutlined size={40} className="text-gray-400" />
                                    <p className="text-sm font-bold text-gray-300">Không có dữ liệu</p>
                                </div>
                            </td>
                        )}
                    </div>
                </div>
            </div>

            {/* Test Case Table */}
            <div className="space-y-4">
                <div className="flex sm:flex-row justify-between items-end sm:items-center gap-4 px-2">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-6 bg-emerald-500 rounded-full" />
                        <h4 className="text-lg font-bold text-white tracking-tight">Danh sách test case</h4>
                        <span className="text-xs text-gray-500 font-medium ml-2">({filteredTestCases.length} kết quả)</span>
                    </div>

                    {/* Neat Compact Search Bar */}
                    <div className="relative group w-2/3 sm:w-80">
                        <SearchOutlined size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                        <input
                            type="text"
                            value={searchQueryTestCase}
                            onChange={(e) => setSearchQueryTestCase(e.target.value)}
                            placeholder="Tìm kiếm test case"
                            className="w-full pl-11 pr-4 py-2.5 bg-[#0f131a]/60 text-gray-200 rounded-2xl border border-white/10 outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all placeholder-gray-600 shadow-inner text-sm"
                        />
                    </div>
                </div>

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
                                    <tr key={tc.test_case_id} className="group hover:bg-white/2 transition-colors">
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
                                                    onClick={() => handleDelete(tc.test_case_id, tc.test_case_id.toString())}
                                                    disabled={isDeleting}
                                                >
                                                    <DeleteOutlined size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-8 py-24 text-center">
                                        <div className="flex flex-col items-center gap-3 opacity-20">
                                            <UnorderedListOutlined size={40} className="text-gray-400" />
                                            <p className="text-sm font-bold text-gray-300">Không có dữ liệu</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TestCaseTable