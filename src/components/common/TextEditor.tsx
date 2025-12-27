import MDEditor from "@uiw/react-md-editor";

interface TextEditorProps {
    value: string;
    onChange: (val: string) => void;
}

const TextEditor = ({value, onChange}: TextEditorProps) => {
    return (
        <div className="space-y-2 flex flex-col h-full min-h-[400px]">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">Nội dung chi tiết</label>
            <div data-color-mode="dark" className="mt-2 flex-1 rounded-xl overflow-hidden border border-white/10">
                <MDEditor
                    value={value}
                    aria-placeholder={"**Bắt đầu viết nội dung tại đây...**"}
                    onChange={(val) => onChange(val || "")}
                    height={400}
                    preview="live"
                    className="!bg-[#0f131a] !border-none"
                />
            </div>
        </div>
    )
}

export default TextEditor;