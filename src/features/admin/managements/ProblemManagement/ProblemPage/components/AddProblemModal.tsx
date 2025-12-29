import React, {useState} from "react";
import type {Difficulty, IProblemSample} from "../../../../../../types/problem.types.ts";
import {
    CheckCircleOutlined,
    CloseOutlined, CodeOutlined, CodeSandboxOutlined, DeleteOutlined, DownOutlined, EyeInvisibleOutlined, EyeOutlined,
    FieldTimeOutlined, FileTextOutlined, InfoCircleOutlined, PlusOutlined,
    TagsOutlined, ThunderboltOutlined, TrophyOutlined
} from "@ant-design/icons";
import {useCreateProblemMutation} from "../../../../../../services/problem/problem.service.ts";
import {message} from "antd";
import MDEditor from "@uiw/react-md-editor";
import type {ITag} from "../../../../../../types/tag.types.ts";
import { createPortal } from "react-dom";

interface AddProblemModalProps {
    isOpen: boolean;
    onClose: () => void;
    tags: ITag[];
}

const AddProblemModal = ({isOpen, onClose, tags}: AddProblemModalProps) => {
    const [createProblem] = useCreateProblemMutation();
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        difficulty: 'EASY' as Difficulty,
        points: 10,
        is_published: false,
        input_format: '',
        output_format: '',
        constraints: '',
        time_limit: 1.0,
        memory_limit: 256,
    });

    const [samples, setSamples] = useState<IProblemSample[]>([
        { input: '', output: '', explanation: '' }
    ]);

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'number' ? parseFloat(value) : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleLabelToggle = (labelId: number) => {
        setSelectedTagIds(prev =>
            prev.includes(labelId) ? prev.filter(id => id !== labelId) : [...prev, labelId]
        );
    };

    const handleDescriptionChange = (value?: string) => {
        setFormData(prev => ({ ...prev, description: value || "" }));
    };

    const handleSampleChange = (index: number, field: keyof IProblemSample, value: string) => {
        const updatedSamples = [...samples];
        updatedSamples[index] = { ...updatedSamples[index], [field]: value };
        setSamples(updatedSamples);
    };

    const addSample = () => {
        setSamples([...samples, { input: '', output: '', explanation: '' }]);
    };

    const removeSample = (index: number) => {
        if (samples.length > 1) {
            setSamples(samples.filter((_, i) => i !== index));
        }
    };

    const handleClose = () => {
        setFormData({
            title: '',
            description: '',
            difficulty: 'EASY',
            points: 10,
            is_published: true,
            input_format: '',
            output_format: '',
            constraints: '',
            time_limit: 1.0,
            memory_limit: 256,
        });
        setSelectedTagIds([]);
        setSamples([{ input: '', output: '', explanation: '' }]);
        onClose();
    }

    const handleSubmit = async () => {
        const finalData = {
            ...formData,
            tag_ids: selectedTagIds,
            samples: samples,
        };
        try {
            console.log("Payload gửi đi:", finalData);
            await createProblem(finalData).unwrap();
            message.success("Tạo bài tập thành công")
            handleClose();
        } catch (error: any) {
            message.error(error?.data?.message || "Lỗi khi tạo bài tập");
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
            <div className="relative w-full max-w-4xl sm:w-[90vw] lg:max-w-4xl bg-[#111827] rounded-3xl shadow-2xl border border-white/10 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">

                {/* Header */}
                <div className="px-5 py-4 sm:px-8 sm:py-6 border-b border-white/5 flex justify-between items-center bg-white/2 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <CodeOutlined className="text-emerald-400" size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white tracking-wide">Thêm bài tập thực hành</h3>
                            <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-semibold opacity-70">Cấu hình bài tập lập trình chi tiết</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all">
                        <CloseOutlined size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 sm:p-8 space-y-6 sm:space-y-10 flex-1 overflow-y-auto scrollbar-hide">

                    {/* Section 1: Thông tin cơ bản */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <FileTextOutlined size={18} className="text-emerald-400" />
                            <h4 className="text-sm font-bold text-gray-200 uppercase tracking-widest">Thông tin cơ bản</h4>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Tên bài tập</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Ví dụ: Tính tổng hai số nguyên"
                                    className="w-full px-4 py-3 bg-[#0f131a]/50 text-gray-200 rounded-xl border border-white/10 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all shadow-inner text-sm"
                                />
                            </div>

                            <div className="space-y-3 md:col-span-2 bg-black/20 p-5 rounded-2xl border border-white/5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <TagsOutlined size={14} className="text-emerald-400" /> Gắn nhãn bài tập (Chọn nhiều)
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {(tags ?? []).filter(t => t.is_active).map((tag) => {
                                        const isSelected = selectedTagIds.includes(tag.tag_id);
                                        return (
                                            <button
                                                key={tag.tag_id}
                                                type="button"
                                                onClick={() => handleLabelToggle(tag.tag_id)}
                                                style={{
                                                    backgroundColor: isSelected && tag.color ? `${tag.color}25` : 'transparent',
                                                    color: isSelected ? (tag.color ?? '#6b7280') : '#6b7280',
                                                    borderColor: isSelected ? (tag.color ?? '#374151') : '#374151'
                                                }}
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all hover:scale-105 active:scale-95`}
                                            >
                                                {isSelected && <CheckCircleOutlined size={14} />}
                                                {tag.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="space-y-2 md:col-span-2 flex flex-col">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                                    Mô tả bài tập (Markdown)
                                </label>
                                <div data-color-mode="dark" className="mt-1">
                                    <MDEditor
                                        value={formData.description}
                                        onChange={handleDescriptionChange}
                                        height={window.innerWidth < 640 ? 200 : 300}
                                        preview="live"
                                        className="bg-[#0f131a]/50! border-white/10! rounded-xl! overflow-hidden"
                                    />
                                </div>
                                <p className="text-[10px] text-gray-500 mt-1 italic">* Hỗ trợ định dạng Markdown, bảng và chèn code.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Độ khó</label>
                                <div className="relative">
                                    <select
                                        name="difficulty"
                                        value={formData.difficulty}
                                        onChange={handleInputChange}
                                        className="w-full pl-4 pr-10 py-3.5 bg-[#0f131a]/50 text-gray-200 rounded-xl border border-white/10 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all appearance-none cursor-pointer text-sm"
                                    >
                                        <option value="EASY">Dễ</option>
                                        <option value="MEDIUM">Trung bình</option>
                                        <option value="HARD">Khó</option>
                                    </select>
                                    <DownOutlined size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Điểm thưởng</label>
                                <div className="relative">
                                    <TrophyOutlined size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" />
                                    <input
                                        type="number"
                                        name="points"
                                        value={formData.points}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-4 py-3.5 bg-[#0f131a]/50 text-gray-200 rounded-xl border border-white/10 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Định dạng dữ liệu & Ràng buộc */}
                    <section className="space-y-6 pt-6 border-t border-white/5">
                        <div className="flex items-center gap-2 mb-2">
                            <CodeSandboxOutlined size={18} className="text-blue-400" />
                            <h4 className="text-sm font-bold text-gray-200 uppercase tracking-widest">Định dạng & Ràng buộc</h4>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Định dạng đầu vào (Input Format)</label>
                                <textarea
                                    name="input_format"
                                    value={formData.input_format}
                                    onChange={handleInputChange}
                                    rows={3}
                                    placeholder="Ví dụ: Dòng đầu tiên chứa số nguyên n..."
                                    className="w-full px-4 py-3 bg-[#0f131a]/50 text-gray-200 rounded-xl border border-white/10 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all shadow-inner text-sm resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Định dạng đầu ra (Output Format)</label>
                                <textarea
                                    name="output_format"
                                    value={formData.output_format}
                                    onChange={handleInputChange}
                                    rows={3}
                                    placeholder="Ví dụ: In ra một số nguyên duy nhất là tổng của..."
                                    className="w-full px-4 py-3 bg-[#0f131a]/50 text-gray-200 rounded-xl border border-white/10 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all shadow-inner text-sm resize-none"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Ràng buộc (Constraints)</label>
                                <textarea
                                    name="constraints"
                                    value={formData.constraints}
                                    onChange={handleInputChange}
                                    rows={2}
                                    placeholder="Ví dụ: 1 <= n <= 100, 0 <= a[i] <= 10^9..."
                                    className="w-full px-4 py-3 bg-[#0f131a]/50 text-gray-200 rounded-xl border border-white/10 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all shadow-inner text-sm resize-none"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Giới hạn hệ thống */}
                    <section className="space-y-6 pt-6 border-t border-white/5">
                        <div className="flex items-center gap-2 mb-2">
                            <FieldTimeOutlined size={18} className="text-amber-400" />
                            <h4 className="text-sm font-bold text-gray-200 uppercase tracking-widest">Giới hạn kỹ thuật</h4>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Giới hạn thời gian (Time Limit)</label>
                                <div className="relative">
                                    <FieldTimeOutlined size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input
                                        type="number"
                                        step="0.1"
                                        name="time_limit"
                                        value={formData.time_limit}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-12 py-3.5 bg-[#0f131a]/50 text-gray-200 rounded-xl border border-white/10 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-600">GIÂY</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Giới hạn bộ nhớ (Memory Limit)</label>
                                <div className="relative">
                                    <ThunderboltOutlined size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input
                                        type="number"
                                        name="memory_limit"
                                        value={formData.memory_limit}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-12 py-3.5 bg-[#0f131a]/50 text-gray-200 rounded-xl border border-white/10 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-600">MB</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 4: Samples (Mẫu) */}
                    <section className="space-y-6 pt-6 border-t border-white/5">
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                                <InfoCircleOutlined size={18} className="text-purple-400" />
                                <h4 className="text-sm font-bold text-gray-200 uppercase tracking-widest">Ví dụ (Samples)</h4>
                            </div>
                            <button
                                type="button"
                                onClick={addSample}
                                className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs font-bold hover:bg-emerald-500/20 transition-all border border-emerald-500/20"
                            >
                                <PlusOutlined size={14} /> Thêm mẫu
                            </button>
                        </div>

                        <div className="space-y-6">
                            {samples.map((sample, idx) => (
                                <div key={idx} className="relative p-6 bg-[#0f131a]/30 border border-white/5 rounded-2xl group/sample">
                                    <div className="absolute top-4 right-4 opacity-0 group-hover/sample:opacity-100 transition-opacity">
                                        <button
                                            type="button"
                                            onClick={() => removeSample(idx)}
                                            className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                                        >
                                            <DeleteOutlined size={16} />
                                        </button>
                                    </div>
                                    <div className="text-[10px] font-bold text-gray-600 mb-4 uppercase tracking-widest">Mẫu #{idx + 1}</div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Input mẫu</label>
                                            <textarea
                                                value={sample.input}
                                                onChange={(e) => handleSampleChange(idx, 'input', e.target.value)}
                                                className="w-full px-4 py-3 bg-black/40 text-emerald-400 font-mono text-xs rounded-xl border border-white/5 focus:border-emerald-500/30 outline-none resize-none"
                                                rows={3}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Output mẫu</label>
                                            <textarea
                                                value={sample.output}
                                                onChange={(e) => handleSampleChange(idx, 'output', e.target.value)}
                                                className="w-full px-4 py-3 bg-black/40 text-amber-400 font-mono text-xs rounded-xl border border-white/5 focus:border-amber-500/30 outline-none resize-none"
                                                rows={3}
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Giải thích (Tùy chọn)</label>
                                            <textarea
                                                value={sample.explanation}
                                                onChange={(e) => handleSampleChange(idx, 'explanation', e.target.value)}
                                                className="w-full px-4 py-3 bg-black/20 text-gray-300 text-xs rounded-xl border border-white/5 focus:border-emerald-500/30 outline-none resize-none"
                                                rows={2}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Section 5: Trạng thái */}
                    <section className="pt-6 border-t border-white/5">
                        <div className="flex items-center justify-between p-4 bg-[#0f131a]/50 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${formData.is_published ? 'bg-emerald-500/10' : 'bg-gray-500/10'}`}>
                                    {formData.is_published ? <EyeOutlined size={20} className="text-emerald-400" /> : <EyeInvisibleOutlined size={20} className="text-gray-500" />}
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white">{formData.is_published ? 'Đang được công khai' : 'Đang ở trạng thái bản nháp'}</div>
                                    <div className="text-[10px] text-gray-500 uppercase tracking-widest">Học viên có thể nhìn thấy và thực hành</div>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, is_published: !prev.is_published }))}
                                className={`relative w-12 h-6 rounded-full transition-colors ${formData.is_published ? 'bg-emerald-500' : 'bg-gray-700'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.is_published ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="px-5 py-4 sm:px-8 border-t border-white/5 bg-black/20 flex justify-end gap-3 shrink-0">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:bg-white/5 transition-all"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-10 py-2.5 rounded-xl text-sm font-semibold text-white bg-linear-to-r from-emerald-600 to-teal-600 shadow-lg shadow-emerald-900/40 hover:-translate-y-0.5 transition-all"
                    >
                        Tạo bài tập
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default AddProblemModal