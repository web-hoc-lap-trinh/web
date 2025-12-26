import {
    useCreateProblemTestCaseMutation,
    useGetProblemTestCaseQuery, useUpdateTestCaseMutation
} from "../../../../../../services/problem/problem.service.ts";
import React, {useEffect, useRef, useState} from "react";
import {
    CheckCircleOutlined,
    CloseOutlined,
    CodeOutlined,
    CodeSandboxOutlined,
    DownOutlined,
    InfoCircleOutlined, StarFilled
} from "@ant-design/icons";
import type {IProblem} from "../../../../../../types/problem.types.ts";

interface EditTestCaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    problems: IProblem[];
    testCaseId: number;
}

const EditTestCaseModal = ({isOpen, onClose, problems, testCaseId}: EditTestCaseModalProps) => {
    const {data: testCase} = useGetProblemTestCaseQuery(testCaseId);
    const [updateTestCase] = useUpdateTestCaseMutation()

    const [formData, setFormData] = useState({
        problemId: problems[0]?.problem_id || 0,
        input_data: '',
        expected_output: '',
        explanation: '',
        is_sample: false,
        score: 10
    });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        if(testCase && isOpen) {
            setFormData({
                problemId: testCase.problem_id,
                input_data: testCase.input_data,
                expected_output: testCase.expected_output,
                explanation: testCase.explanation,
                score: testCase.score,
                is_sample: testCase.is_sample
            })
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [testCase, isOpen]);

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as any;
        const val = type === 'checkbox' ? (e.target as any).checked : type === 'number' ? parseInt(value) : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleSubmit = async () => {
        try {
            await updateTestCase({
                id: testCaseId,
                data: {
                    input_data: formData.input_data,
                    expected_output: formData.expected_output,
                    explanation: formData.explanation,
                    is_sample: formData.is_sample,
                    is_hidden: formData.is_sample,
                    score: formData.score,
                }
            });
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    const selectedExTitle = problems.find(e => e.problem_id === formData.problemId)?.title || 'Chọn bài tập';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in" onClick={onClose} />
            <div className="relative w-full max-w-xl bg-[#111827] rounded-[32px] shadow-2xl border border-white/10 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">

                {/* Header */}
                <div className="px-8 py-7 border-b border-white/5 flex justify-between items-center bg-white/[0.02] shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <CodeOutlined className="text-emerald-400" size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white tracking-wide">Chỉnh sửa Test Case</h3>
                            <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-semibold opacity-70">Cấu hình bộ dữ liệu kiểm thử hệ thống</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all">
                        <CloseOutlined size={22} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 space-y-7 overflow-y-auto scrollbar-hide">

                    {/* Custom Exercise Selector */}
                    {/*<div className="space-y-2 relative" ref={dropdownRef}>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Thuộc bài tập thực hành</label>
                        <div
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className={`flex items-center gap-3 px-4 py-4 bg-[#0f131a]/60 text-gray-200 rounded-2xl border transition-all cursor-pointer hover:border-emerald-500/30 group ${isDropdownOpen ? 'border-emerald-500/50 ring-2 ring-emerald-500/20' : 'border-white/10 shadow-inner'}`}
                        >
                            <CodeOutlined size={18} className={`${isDropdownOpen ? 'text-emerald-400' : 'text-gray-500'} transition-colors`} />
                            <span className="flex-1 text-sm font-bold truncate">
                {selectedExTitle}
              </span>
                            <DownOutlined size={18} className={`text-gray-500 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-emerald-400' : ''}`} />
                        </div>

                         Dropdown Menu
                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 w-full mt-2 bg-[#1a202c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="max-h-56 overflow-y-auto py-2 scrollbar-hide">
                                    {problems.map(ex => (
                                        <div
                                            key={ex.problem_id}
                                            onClick={() => { setFormData(prev => ({...prev, problemId: ex.problem_id})); setIsDropdownOpen(false); }}
                                            className={`px-4 py-3.5 flex items-center justify-between cursor-pointer transition-all hover:bg-emerald-500/10 ${formData.problemId === ex.problem_id ? 'text-emerald-400 bg-emerald-500/5' : 'text-gray-400'}`}
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold truncate max-w-[400px]">{ex.title}</span>
                                            </div>
                                            {formData.problemId === ex.problem_id && <CheckCircleOutlined size={18} />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>*/}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                                <CodeSandboxOutlined size={12} className="text-emerald-400" />
                                Dữ liệu đầu vào (Input)
                            </label>
                            <textarea
                                name="input_data"
                                value={formData.input_data}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-5 py-4 bg-black/40 text-emerald-400 font-mono text-xs rounded-2xl border border-white/5 focus:ring-2 focus:ring-emerald-500/50 outline-none resize-none shadow-inner"
                                placeholder="Ví dụ: 5 10"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                                <CheckCircleOutlined size={12} className="text-amber-400" />
                                Kết quả mong đợi (Output)
                            </label>
                            <textarea
                                name="expected_output"
                                value={formData.expected_output}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-5 py-4 bg-black/40 text-amber-400 font-mono text-xs rounded-2xl border border-white/5 focus:ring-2 focus:ring-amber-500/50 outline-none resize-none shadow-inner"
                                placeholder="Ví dụ: 15"
                            />
                        </div>
                    </div>

                    {/* Explanation Field */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                            <InfoCircleOutlined size={12} className="text-blue-400" />
                            Giải thích (Tùy chọn)
                        </label>
                        <textarea
                            name="explanation"
                            value={formData.explanation}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-5 py-4 bg-[#0f131a]/40 text-gray-300 text-xs rounded-2xl border border-white/5 focus:ring-2 focus:ring-blue-500/50 outline-none resize-none shadow-inner"
                            placeholder="Giải thích lý do cho bộ dữ liệu này hoặc các trường hợp biên được kiểm tra..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-7 pt-5 border-t border-white/5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Số điểm cho test case này</label>
                            <div className="relative group">
                                <StarFilled size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" />
                                <input
                                    type="number"
                                    name="score"
                                    value={formData.score}
                                    onChange={handleInputChange}
                                    className="w-full pl-12 pr-4 py-4 bg-[#0f131a]/60 text-gray-200 rounded-2xl border border-white/10 focus:ring-2 focus:ring-emerald-500/50 outline-none text-sm font-bold shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="flex items-end gap-3 pb-0.5">
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, is_sample: !prev.is_sample }))}
                                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl border text-xs font-bold transition-all shadow-sm ${
                                    formData.is_sample
                                        ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                                        : 'bg-[#0f131a]/60 border-white/10 text-gray-500 hover:text-gray-400'
                                }`}
                            >
                                <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${formData.is_sample ? 'bg-emerald-500 border-emerald-500 scale-110 shadow-lg shadow-emerald-500/30' : 'border-gray-600'}`}>
                                    {formData.is_sample && <CheckCircleOutlined size={14} className="text-white" />}
                                </div>
                                Sử dụng làm dữ liệu mẫu (Sample)
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-6 border-t border-white/5 bg-black/30 flex justify-end gap-3 shrink-0">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 rounded-2xl text-sm font-bold text-gray-500 hover:text-gray-200 hover:bg-white/5 transition-all"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-12 py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 shadow-xl shadow-emerald-900/40 hover:-translate-y-0.5 transition-all active:scale-95"
                    >
                        Lưu Test Case
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditTestCaseModal;