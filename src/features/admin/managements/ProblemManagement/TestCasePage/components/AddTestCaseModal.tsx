import React, {useState} from "react";
import {
    CheckCircleOutlined,
    CloseOutlined,
    CodeOutlined,
    CodeSandboxOutlined,
    InfoCircleOutlined, StarFilled
} from "@ant-design/icons";
import {useCreateProblemTestCaseMutation} from "../../../../../../services/problem/problem.service.ts";
import {createPortal} from "react-dom";
import {message} from "antd";

interface AddTestCaseModalProps {
    problemId: number
    isOpen: boolean;
    onClose: () => void;
}

const AddTestCaseModal = ({problemId, isOpen, onClose}: AddTestCaseModalProps) => {
    const [createTestCase] = useCreateProblemTestCaseMutation()

    const [formData, setFormData] = useState({
        input_data: '',
        expected_output: '',
        explanation: '',
        is_sample: false,
        is_hidden: false,
        score: 10
    });


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as any;
        const val = type === 'checkbox' ? (e.target as any).checked : type === 'number' ? parseInt(value) : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleSubmit = async () => {
        try {
            await createTestCase({
                problemId,
                data: {
                    input_data: formData.input_data,
                    expected_output: formData.expected_output,
                    explanation: formData.explanation,
                    is_sample: formData.is_sample,
                    is_hidden: formData.is_sample,
                    score: formData.score,
                }
            });
            message.success("Tạo test case thành công");
            onClose();
        } catch (error) {
            console.error(error);
            message.success("Tạo test case thất bại");
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in" onClick={onClose} />
            <div className="relative w-full max-w-xl bg-[#111827] rounded-3xl shadow-2xl border border-white/10 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">

                {/* Header */}
                <div className="px-8 py-7 border-b border-white/5 flex justify-between items-center bg-white/2 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <CodeOutlined className="text-emerald-400" size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white tracking-wide">Thêm Test Case mới</h3>
                            <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-semibold opacity-70">Cấu hình bộ dữ liệu kiểm thử hệ thống</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all">
                        <CloseOutlined size={22} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 space-y-7 overflow-y-auto scrollbar-hide">
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
                        className="px-12 py-3 rounded-2xl text-sm font-bold text-white bg-linear-to-r from-emerald-600 to-teal-600 shadow-xl shadow-emerald-900/40 hover:-translate-y-0.5 transition-all active:scale-95"
                    >
                        Lưu Test Case
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default AddTestCaseModal;