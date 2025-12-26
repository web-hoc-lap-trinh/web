import type {ExerciseType, IExerciseOption} from "../../../../../../types/exercise.types.ts";
import React, {useEffect, useState} from "react";
import {useGetAdminLessonsQuery} from "../../../../../../services/lesson/lesson.service.ts";
import {CheckCircleOutlined, CheckSquareOutlined, CloseOutlined, DownOutlined, InfoCircleOutlined} from "@ant-design/icons";
import {useCreateExerciseMutation} from "../../../../../../services/exercise/exercise.service.ts";
import {message} from "antd";
import {createPortal} from "react-dom";

interface AddExerciseModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddQuestionModal = ({isOpen, onClose} : AddExerciseModalProps) => {
    const {data: lessons = []} = useGetAdminLessonsQuery();
    const [createExercise] = useCreateExerciseMutation();

    const [type, setType] = useState<ExerciseType>("MULTIPLE_CHOICE");
    const [formData, setFormData] = useState({
        question: '',
        lesson_id: lessons[0]?.lesson_id || 0,
        explanation: '',
        options: ['', '', '', ''],
        correct_answer: ''
    });

    useEffect(() => {
        if (lessons.length > 0 && formData.lesson_id === 0) {
            setFormData(prev => ({
                ...prev,
                lesson_id: lessons[0].lesson_id
            }));
        }
    }, [lessons]);

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...formData.options];
        const oldOptionValue = newOptions[index];
        newOptions[index] = value;
        let newCorrectAnswer = formData.correct_answer;
        if (formData.correct_answer === oldOptionValue && oldOptionValue !== '') {
            newCorrectAnswer = value;
        }

        setFormData(prev => ({ ...prev, options: newOptions, correct_answer: newCorrectAnswer }));
    };

    const setCorrectAnswerByIdx = (idx: number) => {
        let value = '';
        if (type === 'MULTIPLE_CHOICE') {
            value = String.fromCharCode(65 + idx); // "A", "B", "C", "D"
        } else {
            // SỬA TẠI ĐÂY: Trả về "TRUE" hoặc "FALSE" theo yêu cầu của Server
            value = idx === 0 ? 'TRUE' : 'FALSE';
        }

        setFormData(prev => ({ ...prev, correct_answer: value }));
    };

    const handleSubmit = async () => {
        if (!formData.question || !formData.correct_answer) {
            message.warning("Vui lòng nhập câu hỏi và chọn đáp án đúng!");
            return;
        }

        const finalOptions: IExerciseOption[] = type === 'MULTIPLE_CHOICE'
            ? formData.options.map((text, idx) => ({
                id: String.fromCharCode(65 + idx),
                text: text
            }))
            : [
                { id: '1', text: 'Đúng' },
                { id: '0', text: 'Sai' }
            ];

        const finalData = {
            question: formData.question,
            correct_answer: formData.correct_answer,
            lesson_id: formData.lesson_id,
            explanation: formData.explanation,
            exercise_type: type,
            order_index: 1,
            options: finalOptions

        };
        try {
            await createExercise(finalData).unwrap();
            console.log('New Exercise Data:', finalData);
            onClose();
            resetForm();
        } catch (error: any) {
            message.error(error.message);
        }
    };

    const resetForm = () => {
        setFormData({
            question: '',
            lesson_id: lessons[0]?.lesson_id || 0,
            explanation: '',
            options: ['', '', '', ''],
            correct_answer: ''
        });
        setType('MULTIPLE_CHOICE');
    };

    const currentCorrectIdx = type === 'MULTIPLE_CHOICE'
        ? ['A', 'B', 'C', 'D'].indexOf(formData.correct_answer)
        : (formData.correct_answer === 'TRUE' ? 0 : formData.correct_answer === 'FALSE' ? 1 : -1);

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
            <div className="relative w-full max-w-2xl bg-[#1a202c] rounded-3xl shadow-2xl border border-white/10 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02] shrink-0">
                    <div>
                        <h3 className="text-xl font-bold text-white tracking-wide">Thêm bài tập mới</h3>
                        <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-semibold opacity-70">Cấu hình câu hỏi và đáp án chi tiết</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors">
                        <CloseOutlined size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 space-y-8 overflow-y-auto scrollbar-hide">
                    {/* Title Field */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nội dung câu hỏi</label>
                        <div className="relative group">
                            <textarea
                                name="question"
                                value={formData.question}
                                onChange={handleInputChange}
                                rows={2}
                                placeholder="Nhập nội dung câu hỏi bài tập..."
                                className="w-full pl-12 pr-4 py-3 bg-[#0f131a]/50 text-gray-200 rounded-xl border border-white/10 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all shadow-inner text-sm resize-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Lesson Selector */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Thuộc bài học</label>
                            <div className="relative group">
                                <select
                                    name="lesson_id"
                                    value={formData.lesson_id}
                                    onChange={handleInputChange}
                                    className="w-full pl-12 pr-10 py-3.5 bg-[#0f131a]/50 text-gray-200 rounded-xl border border-white/10 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all appearance-none cursor-pointer shadow-inner text-sm"
                                >
                                    {lessons.map(lesson => (
                                        <option key={lesson.lesson_id} value={lesson.lesson_id}>{lesson.title}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
                                    <DownOutlined size={14} />
                                </div>
                            </div>
                        </div>

                        {/* Type Selector */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Loại hình bài tập</label>
                            <div className="flex bg-[#0f131a]/50 p-1 rounded-xl border border-white/10">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setType('MULTIPLE_CHOICE')
                                        setFormData(prev => ({ ...prev, correct_answer: '' }));
                                    }}
                                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                                        type === 'MULTIPLE_CHOICE'
                                            ? 'bg-emerald-500 text-white shadow-lg'
                                            : 'text-gray-500 hover:text-gray-300'
                                    }`}
                                >
                                    <CheckSquareOutlined size={14} />
                                    Trắc nghiệm
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setType('TRUE_FALSE')
                                        setFormData(prev => ({ ...prev, correct_answer: 'TRUE' }));
                                    }}
                                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                                        type === 'TRUE_FALSE'
                                            ? 'bg-purple-500 text-white shadow-lg'
                                            : 'text-gray-500 hover:text-gray-300'
                                    }`}
                                >
                                    <CheckCircleOutlined size={14} />
                                    Đúng - Sai
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Answers Configuration */}
                    <div className="space-y-4 pt-4 border-t border-white/5">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Thiết lập đáp án</label>
                            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Chọn 1 đáp án đúng</span>
                        </div>

                        {type === 'MULTIPLE_CHOICE' ? (
                            <div className="grid grid-cols-1 gap-3">
                                {formData.options.map((opt, idx) => (
                                    <div key={idx} className={`relative group flex items-center gap-3 p-1 pr-4 rounded-2xl border transition-all ${currentCorrectIdx === idx ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-[#0f131a]/30 border-white/5 hover:border-white/10'}`}>
                                        <button
                                            type="button"
                                            onClick={() => setCorrectAnswerByIdx(idx)}
                                            className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition-all ${
                                                currentCorrectIdx === idx
                                                    ? 'bg-emerald-500 text-white shadow-lg rotate-0'
                                                    : 'bg-white/5 text-gray-600 hover:text-gray-400'
                                            }`}
                                        >
                                            {currentCorrectIdx === idx ? <CheckCircleOutlined size={20} /> : <span className="font-bold">{String.fromCharCode(65 + idx)}</span>}
                                        </button>
                                        <input
                                            type="text"
                                            placeholder={`Nhập đáp án ${String.fromCharCode(65 + idx)}...`}
                                            value={opt}
                                            onChange={(e) => handleOptionChange(idx, e.target.value)}
                                            className="flex-1 bg-transparent py-3 text-sm text-gray-200 outline-none placeholder-gray-700"
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                {['Đúng', 'Sai'].map((label, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setCorrectAnswerByIdx(idx)}
                                        className={`flex flex-col items-center justify-center py-6 rounded-2xl border transition-all gap-3 ${
                                            currentCorrectIdx === idx
                                                ? 'bg-purple-500/10 border-purple-500/50 text-purple-300 shadow-xl'
                                                : 'bg-[#0f131a]/30 border-white/5 text-gray-600 hover:border-white/10 hover:text-gray-400'
                                        }`}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                            currentCorrectIdx === idx ? 'bg-purple-500 text-white shadow-lg scale-110' : 'bg-white/5'
                                        }`}>
                                            {currentCorrectIdx === idx ? <CheckCircleOutlined size={20} /> : <div className="w-2 h-2 rounded-full bg-current" />}
                                        </div>
                                        <span className="text-sm font-bold uppercase tracking-widest">{label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Explanation Field */}
                    <div className="space-y-2 pt-4 border-t border-white/5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                            <InfoCircleOutlined size={12} className="text-blue-400" />
                            Giải thích đáp án
                        </label>
                        <div className="relative group">
              <textarea
                  name="explanation"
                  value={formData.explanation}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Nhập giải thích chi tiết giúp học viên hiểu tại sao đáp án này là đúng..."
                  className="w-full px-4 py-3 bg-[#0f131a]/50 text-gray-200 rounded-xl border border-white/10 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all shadow-inner text-sm resize-none placeholder-gray-700"
              />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-6 border-t border-white/5 bg-black/20 flex justify-end gap-3 shrink-0">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:bg-white/5 transition-all"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-8 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg shadow-emerald-900/40 hover:-translate-y-0.5 transition-all"
                    >
                        Lưu bài tập
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default AddQuestionModal