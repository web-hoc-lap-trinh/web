import { useEffect, useState } from "react";
import { Button, Select, Skeleton, message, Tooltip } from "antd";
import { PlayCircleFilled, ReloadOutlined, InfoCircleOutlined } from "@ant-design/icons";
import Editor from "@monaco-editor/react";
import {
    useGetLessonTryItYourselfQuery,
    useRunPlaygroundCodeMutation,
    useGetPlaygroundLanguagesQuery
} from "../../../../../../services/try-it-yourself/try-it-yourself.service";
import ConsoleOutput from "./ConsoleOutput";

interface TryItYourselfRunnerProps {
    lessonId: string;
}

const getMonacoLanguageId = (apiLangCode: string) => {
    const map: Record<string, string> = {
        'c++': 'cpp',
        'c#': 'csharp',
        'python': 'python',
        'javascript': 'javascript',
        'java': 'java',
        'go': 'go',
        'rust': 'rust'
    };
    return map[apiLangCode.toLowerCase()] || apiLangCode.toLowerCase();
};

const DEFAULT_CODE_SNIPPETS: Record<string, string> = {
    javascript: `console.log("Hello from Codery!");`,
    python: `print("Hello from Codery!")`,
    java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Codery!");\n    }\n}`,
    "c++": `#include <iostream>\n\nint main() {\n    std::cout << "Hello from Codery!";\n    return 0;\n}`
};

const TryItYourselfRunner = ({ lessonId }: TryItYourselfRunnerProps) => {
    const [code, setCode] = useState<string>("");
    const [selectedLangCode, setSelectedLangCode] = useState<string>("javascript");
    const [outputState, setOutputState] = useState({
        output: "",
        error: null as string | null,
        status: null as string | null,
        executionTime: 0
    });

    const { data: lessonConfig, isLoading: isConfigLoading } = useGetLessonTryItYourselfQuery(lessonId);
    const { data: allLanguages, isLoading: isLanguagesLoading } = useGetPlaygroundLanguagesQuery();
    const [runCode, { isLoading: isRunning }] = useRunPlaygroundCodeMutation();

    useEffect(() => {
        if (lessonConfig) {
            setSelectedLangCode(lessonConfig.language.code);
            setCode(lessonConfig.example_code || "");
        } else if (allLanguages && allLanguages.length > 0 && !code) {
            setCode(DEFAULT_CODE_SNIPPETS['javascript'] || "");
        }
    }, [lessonConfig, allLanguages]);

    const handleLanguageChange = (value: string) => {
        setSelectedLangCode(value);
        const snippet = DEFAULT_CODE_SNIPPETS[getMonacoLanguageId(value)] || "// Start coding...";
        setCode(snippet);
    };

    const handleRunCode = async () => {
        try {
            const res = await runCode({
                language_code: selectedLangCode,
                source_code: code,
                input: ""
            }).unwrap();

            setOutputState({
                output: res.output,
                error: res.error,
                status: res.status,
                executionTime: res.execution_time
            });
        } catch (err) {
            console.error(err);
            message.error("Lỗi kết nối đến server biên dịch");
        }
    };

    const handleReset = () => {
        if (lessonConfig) {
            setCode(lessonConfig.example_code);
        } else {
            const snippet = DEFAULT_CODE_SNIPPETS[getMonacoLanguageId(selectedLangCode)] || "";
            setCode(snippet);
        }
        setOutputState({ output: "", error: null, status: null, executionTime: 0 });
    };

    if (isConfigLoading || isLanguagesLoading) {
        return <div className="p-4"><Skeleton active paragraph={{ rows: 10 }} /></div>;
    }

    const languageOptions = allLanguages?.map(lang => ({
        value: lang.code,
        label: lang.name
    })) || [];

    return (
        <div className="flex flex-col gap-4 h-[600px] lg:h-[750px]">
            <div className="flex justify-between items-center bg-[#0a1514]! p-3 rounded-xl border border-white/10! shrink-0">
                <div className="flex items-center gap-3">
                    {lessonConfig ? (
                        <Tooltip title="Bài học này yêu cầu ngôn ngữ cụ thể">
                            <div className="px-3 py-1 rounded bg-emerald-500/10! text-emerald-400! text-sm font-bold border border-emerald-500/20! uppercase font-mono cursor-default">
                                {lessonConfig.language.name}
                            </div>
                        </Tooltip>
                    ) : (
                        <Select
                            value={selectedLangCode}
                            onChange={handleLanguageChange}
                            options={languageOptions}
                            className="w-40 [&_.ant-select-selection-item]:text-white! [&_.ant-select-arrow]:text-gray-400!"
                            variant="borderless"
                            popupClassName="bg-[#1f1f1f] [&_.ant-select-item]:text-white! [&_.ant-select-item-option-active]:bg-white/10! [&_.ant-select-item-option-selected]:bg-emerald-500/20!"

                            style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}
                            dropdownStyle={{ backgroundColor: '#1f1f1f', border: '1px solid #303030' }}
                        />
                    )}

                    {!lessonConfig && (
                        <Tooltip title="Chế độ tự do (Free Playground)">
                            <InfoCircleOutlined className="text-gray-500!" />
                        </Tooltip>
                    )}
                </div>

                <div className="flex gap-2">
                    <Button
                        ghost
                        icon={<ReloadOutlined />}
                        onClick={handleReset}
                        disabled={isRunning}
                        className="text-gray-400! border-gray-600! hover:text-white! hover:border-white!"
                    >
                        Reset
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlayCircleFilled />}
                        loading={isRunning}
                        onClick={handleRunCode}
                        className="bg-emerald-500! hover:bg-emerald-400! border-none font-semibold shadow-lg shadow-emerald-900/40!"
                    >
                        Thực thi
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex flex-col gap-4 min-h-0">
                <div className="flex-1 rounded-xl overflow-hidden border border-white/10! bg-[#1e1e1e]!">
                    <Editor
                        height="100%"
                        language={getMonacoLanguageId(selectedLangCode)}
                        value={code}
                        onChange={(value) => setCode(value || "")}
                        theme="vs-dark"
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            fontFamily: "'Fira Code', monospace",
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            padding: { top: 16 },
                            cursorBlinking: "smooth",
                            smoothScrolling: true,
                        }}
                    />
                </div>

                <div className="h-[200px] shrink-0">
                    <ConsoleOutput
                        output={outputState.output}
                        error={outputState.error}
                        status={outputState.status}
                        executionTime={outputState.executionTime}
                        isLoading={isRunning}
                    />
                </div>
            </div>
        </div>
    );
};

export default TryItYourselfRunner;