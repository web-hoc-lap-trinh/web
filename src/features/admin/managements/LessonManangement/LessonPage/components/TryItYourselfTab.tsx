import {CodeOutlined, CodeSandboxOutlined, DownOutlined} from "@ant-design/icons";
import type {ISupportedLanguage} from "../../../../../../services/try-it-yourself/try-it-yourself.types.ts";

interface TryItYourselfTabProps {
    languages: ISupportedLanguage[];
    languageId: number;
    setLanguage: (lang: number) => void;
    code: string;
    setCode: (code: string) => void;
}

const TryItYourselfTab = ({languages, languageId, setLanguage, code, setCode}: TryItYourselfTabProps) => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex gap-4">
                <CodeSandboxOutlined size={20} className="text-emerald-400 shrink-0" />
                <div>
                    <h4 className="text-sm font-bold text-emerald-400">Chỉnh sửa Try It Yourself</h4>
                    <p className="text-xs text-gray-400 mt-1">Cập nhật môi trường thực hành cho học viên.</p>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Ngôn ngữ lập trình</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <CodeOutlined size={18} className="text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                    </div>
                    <select value={languageId} onChange={(e) => setLanguage(Number(e.target.value))}
                            className="w-full pl-11 pr-10 py-3 bg-[#0f131a]/50 text-gray-200 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/30 transition-all appearance-none cursor-pointer shadow-inner">
                        <option value="">Chọn chủ đề</option>
                        {languages.map(cat => (
                            <option key={cat.language_id} value={cat.language_id}>{cat.name}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <DownOutlined size={14} className="text-gray-500" />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Mã nguồn mẫu</label>
                </div>
                <div className="relative group rounded-xl overflow-hidden border border-white/10 focus-within:ring-2 focus-within:ring-emerald-500/50 transition-all">
                    <div className="h-8 bg-[#0f131a] border-b border-white/5 flex items-center px-4 gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
                    </div>
                    <textarea
                        value={code}
                        placeholder={"int main() {}"}
                        onChange={(e) => setCode(e.target.value)}
                        spellCheck={false}
                        className="w-full h-64 p-5 bg-[#0f131a]/80 text-emerald-300 font-mono text-xs leading-relaxed outline-none resize-none scrollbar-hide"
                    />
                </div>
            </div>
        </div>
    )
}

export default TryItYourselfTab;