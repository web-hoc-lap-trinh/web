import { useEffect, useState } from "react";
import { Button, Select, Skeleton, message, Tooltip, Tabs, Input } from "antd";
import {
  PlayCircleFilled,
  ReloadOutlined,
  InfoCircleOutlined,
  CodeOutlined,
  UpOutlined,
  DownOutlined,
  CloudUploadOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import Editor from "@monaco-editor/react";
import {
  useGetLessonTryItYourselfQuery,
  useGetPlaygroundLanguagesQuery,
  useRunPlaygroundCodeMutation,
} from "../../../../../services/try-it-yourself/try-it-yourself.service";
import { useSubmitCodeMutation } from "../../../../../services/submission/submission.service";
import ConsoleOutput from "../../CoursePage/LessonDetailPage/components/ConsoleOutput";

const { TextArea } = Input;

interface TryItYourselfRunnerProps {
  lessonId: string;
  onClose?: () => void;
}

const getMonacoLanguageId = (apiLangCode: string) => {
  const map: Record<string, string> = {
    "c++": "cpp",
    "c#": "csharp",
    python: "python",
    javascript: "javascript",
    java: "java",
    go: "go",
    rust: "rust",
  };
  return map[apiLangCode.toLowerCase()] || apiLangCode.toLowerCase();
};

const DEFAULT_CODE_SNIPPETS: Record<string, string> = {
  javascript: `// Write your code here\nconsole.log("Hello World!");`,
  python: `# Write your code here\nprint("Hello World!")`,
  java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World!");\n    }\n}`,
  "c++": `#include <iostream>\n\nint main() {\n    std::cout << "Hello World!";\n    return 0;\n}`,
};

const TryItYourselfRunner = ({
  lessonId,
  onClose,
}: TryItYourselfRunnerProps) => {
  const [code, setCode] = useState<string>("");
  const [inputData, setInputData] = useState<string>("");
  const [selectedLangCode, setSelectedLangCode] = useState<string>("javascript");
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [consoleTab, setConsoleTab] = useState<"input" | "output">("output");

  const [outputState, setOutputState] = useState({
    output: "",
    error: null as string | null,
    status: null as string | null,
    executionTime: 0,
  });

  // --- FIX 1: Convert lessonId to number for Service query ---
  const numericLessonId = Number(lessonId);
  const shouldFetchConfig = !isNaN(numericLessonId) && numericLessonId > 0;

  const { data: lessonConfig, isLoading: isConfigLoading } =
    useGetLessonTryItYourselfQuery(numericLessonId, {
      skip: !shouldFetchConfig,
    });
    
  const { data: allLanguages, isLoading: isLanguagesLoading } =
    useGetPlaygroundLanguagesQuery();

  const [runCode, { isLoading: isRunning }] = useRunPlaygroundCodeMutation();
  const [submitCode, { isLoading: isSubmitting }] = useSubmitCodeMutation();

  useEffect(() => {
    if (lessonConfig) {
      // --- FIX 2: Handle optional language object ---
      // Nếu API trả về language object thì dùng, nếu không thì fallback
      if (lessonConfig.language) {
         setSelectedLangCode(lessonConfig.language.code);
      }
      setCode(lessonConfig.example_code || "");
    } else if (allLanguages && allLanguages.length > 0 && !code) {
      setCode(DEFAULT_CODE_SNIPPETS["javascript"] || "");
    }
  }, [lessonConfig, allLanguages]);

  const handleLanguageChange = (value: string) => {
    setSelectedLangCode(value);
    const snippet =
      DEFAULT_CODE_SNIPPETS[getMonacoLanguageId(value)] || "// Start coding...";
    setCode(snippet);
  };

  const handleRunCode = async () => {
    if (!isConsoleOpen) setIsConsoleOpen(true);
    setConsoleTab("output");

    try {
      const res = await runCode({
        language_code: selectedLangCode,
        source_code: code,
        input: inputData,
      }).unwrap();

      setOutputState({
        output: res.output,
        error: res.error,
        status: res.status,
        executionTime: res.execution_time,
      });
    } catch (err) {
      message.error("Lỗi kết nối server");
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      message.warning("Vui lòng nhập code trước khi nộp!");
      return;
    }

    let submitLang = selectedLangCode;
    if (submitLang === "c++") submitLang = "cpp";

    try {
      await submitCode({
        problem_id: Number(lessonId),
        language: submitLang as any, // Cast as any nếu type bên submission service chưa khớp hoàn toàn
        code: code,
      }).unwrap();

      message.success("Nộp bài thành công! Đang chấm điểm...");
    } catch (error) {
      message.error("Nộp bài thất bại. Vui lòng thử lại.");
    }
  };

  const handleReset = () => {
    if (lessonConfig) {
        setCode(lessonConfig.example_code);
    } else {
        setCode(DEFAULT_CODE_SNIPPETS[getMonacoLanguageId(selectedLangCode)] || "");
    }
    setOutputState({ output: "", error: null, status: null, executionTime: 0 });
    setInputData("");
  };

  if (isConfigLoading || isLanguagesLoading)
    return (
      <div className="p-4">
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );

  const languageOptions =
    allLanguages?.map((lang) => ({ value: lang.code, label: lang.name })) || [];

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      {/* 1. EDITOR TOOLBAR */}
      <div className="flex justify-between items-center px-4 h-10 bg-[#262626] border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-bold ${
              !lessonConfig ? "text-emerald-500" : "text-gray-400"
            }`}
          >
            &lt;/&gt; Code
          </span>
          <div className="h-4 w-px bg-white/10 mx-2" />
          {lessonConfig && lessonConfig.language ? (
            <div className="text-xs font-mono text-gray-300 bg-white/5 px-2 py-1 rounded">
              {lessonConfig.language.name}
            </div>
          ) : (
            <Select
              value={selectedLangCode}
              onChange={handleLanguageChange}
              options={languageOptions}
              size="small"
              variant="borderless"
              className="w-32 [&_.ant-select-selection-item]:text-gray-300! [&_.ant-select-arrow]:text-gray-500! text-xs"
              popupClassName="bg-[#1f1f1f] [&_.ant-select-item]:!text-gray-300 [&_.ant-select-item-option-selected]:!bg-emerald-500/20"
            />
          )}
        </div>

        <div className="flex items-center gap-2">
          {!lessonConfig && (
            <Tooltip title="Reset Code">
              <Button
                type="text"
                size="small"
                icon={<ReloadOutlined />}
                onClick={handleReset}
                className="text-gray-500 hover:text-white"
              />
            </Tooltip>
          )}
          <Tooltip title="Editor Settings">
            <Button
              type="text"
              size="small"
              icon={<InfoCircleOutlined />}
              className="text-gray-500 hover:text-white"
            />
          </Tooltip>

          {onClose && (
            <>
              <div className="h-4 w-px bg-white/10 mx-1" />
              <Tooltip title="Thu gọn Editor">
                <Button
                  type="text"
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={onClose}
                  className="text-gray-500 hover:text-red-400"
                />
              </Tooltip>
            </>
          )}
        </div>
      </div>

      {/* 2. MAIN AREA */}
      <div className="flex-1 relative overflow-hidden flex flex-col">
        {/* Code Editor */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            isConsoleOpen ? "h-[60%]" : "h-[calc(100%-50px)]"
          }`}
        >
          <Editor
            height="100%"
            language={getMonacoLanguageId(selectedLangCode)}
            value={code}
            onChange={(value) => setCode(value || "")}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              lineHeight: 21,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 16 },
              cursorBlinking: "smooth",
              smoothScrolling: true,
            }}
          />
        </div>

        {/* Console Panel */}
        {isConsoleOpen && (
          <div className="h-[40%] border-t border-white/10 bg-[#1e1e1e] flex flex-col animate-slide-up">
            <div className="flex items-center justify-between bg-[#262626] border-b border-white/5 h-9 shrink-0 px-4">
              <Tabs
                activeKey={consoleTab}
                onChange={(key) => setConsoleTab(key as "input" | "output")}
                items={[
                  { key: "input", label: "Input" },
                  { key: "output", label: "Output" },
                ]}
                size="small"
                className="custom-console-tabs ml-2 [&_.ant-tabs-nav]:mb-0 [&_.ant-tabs-tab]:text-gray-500 [&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:!text-emerald-400 [&_.ant-tabs-ink-bar]:bg-emerald-500"
              />
              <Button
                type="text"
                size="small"
                icon={<DownOutlined />}
                onClick={() => setIsConsoleOpen(false)}
                className="text-gray-500 hover:text-white flex items-center"
              />
            </div>

            <div className="flex-1 overflow-hidden relative bg-[#0d1117]">
              {consoleTab === "input" ? (
                <TextArea
                  value={inputData}
                  onChange={(e) => setInputData(e.target.value)}
                  placeholder="Nhập input cho chương trình của bạn ở đây..."
                  className="w-full h-full bg-[#0d1117]! text-gray-300 border-none! resize-none p-4! font-mono focus:shadow-none! placeholder:text-gray-600 rounded-none!"
                  spellCheck={false}
                />
              ) : (
                <ConsoleOutput
                  output={outputState.output}
                  error={outputState.error}
                  status={outputState.status}
                  executionTime={outputState.executionTime}
                  isLoading={isRunning}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. BOTTOM ACTION BAR */}
      <div className="h-12 bg-[#262626] border-t border-white/10 px-4 flex justify-between items-center shrink-0 z-10">
        <Button
          type="text"
          className={`hover:text-white hover:bg-white/5 ${
            isConsoleOpen ? "text-emerald-400" : "text-gray-400"
          }`}
          icon={<CodeOutlined />}
          onClick={() => setIsConsoleOpen(!isConsoleOpen)}
        >
          Console{" "}
          {isConsoleOpen ? (
            <DownOutlined className="text-[10px] ml-1" />
          ) : (
            <UpOutlined className="text-[10px] ml-1" />
          )}
        </Button>

        <div className="flex gap-2">
          <Button
            className="bg-gray-700 border-none text-white hover:bg-gray-600! font-medium px-6"
            onClick={handleRunCode}
            loading={isRunning}
            disabled={isSubmitting}
            icon={!isRunning && <PlayCircleFilled />}
          >
            Thực thi
          </Button>
          <Button
            className="bg-emerald-600 border-none text-white hover:bg-emerald-500! font-medium px-6 shadow-lg shadow-emerald-900/20"
            icon={<CloudUploadOutlined />}
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={isRunning}
          >
            Nộp bài
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TryItYourselfRunner;