import { PlayCircleFilled, ReloadOutlined, CodeFilled } from "@ant-design/icons";
import Editor from "@monaco-editor/react";
import { Button, Select, Skeleton, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { 
  useGetLessonTryItYourselfQuery, 
  useRunLessonCodeMutation 
} from "../../../../../../services/try-it-yourself/try-it-yourself.service";
import type { RunCodeResponse } from "../../../../../../services/try-it-yourself/try-it-yourself.types";
import PlaygroundConsole from "./PlaygroundConsole";

interface LessonPlaygroundProps {
  lessonId: string;
}

const LessonPlayground = ({ lessonId }: LessonPlaygroundProps) => {
  const { data: config, isLoading: isConfigLoading } = useGetLessonTryItYourselfQuery(lessonId);
  const [runCode, { isLoading: isRunning }] = useRunLessonCodeMutation();
  const [sourceCode, setSourceCode] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<RunCodeResponse | null>(null);

  useEffect(() => {
    if (config?.example_code) {
      setSourceCode(config.example_code);
    }
  }, [config]);

  const handleRunCode = async () => {
    try {
      const result = await runCode({
        lessonId,
        data: { source_code: sourceCode, input }
      }).unwrap();
      setOutput(result);
    } catch (error) {
      console.error("Run failed:", error);
    }
  };

  const handleReset = () => {
    if (config?.example_code) setSourceCode(config.example_code);
    setOutput(null);
    setInput("");
  };

  if (isConfigLoading) {
    return <Skeleton active className="p-6 bg-white/5 rounded-2xl" paragraph={{ rows: 10 }} />;
  }

  if (!config) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-gray-500 bg-white/5 rounded-2xl border border-white/10">
        <CodeFilled className="text-4xl mb-3 opacity-50" />
        <p>Bài học này chưa hỗ trợ Code trực tiếp.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#051311] border border-white/10 rounded-2xl shadow-xl shadow-black/40 overflow-hidden flex flex-col h-[700px]">
      <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium text-xs">
               <img 
                 src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${config.language.code}/${config.language.code}-original.svg`} 
                 onError={(e) => e.currentTarget.src = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg'}
                 className="w-4 h-4" 
                 alt="lang" 
               />
               {config.language.name} {config.language.version}
            </div>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip title="Khôi phục code gốc">
            <Button 
                icon={<ReloadOutlined />} 
                onClick={handleReset}
                type="text" 
                className="text-gray-400 hover:text-white"
            />
          </Tooltip>
          <Button
            type="primary"
            icon={<PlayCircleFilled />}
            loading={isRunning}
            onClick={handleRunCode}
            className="bg-emerald-600 hover:!bg-emerald-500 border-none shadow-lg shadow-emerald-900/40 font-semibold"
          >
            Chạy Code
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 relative">
        <Editor
          height="100%"
          theme="vs-dark"
          language={config.language.code === 'c++' ? 'cpp' : config.language.code} 
          value={sourceCode}
          onChange={(value) => setSourceCode(value || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
            renderLineHighlight: "all", 
            theme: "vs-dark"
          }}
          onMount={(editor, monaco) => {
             monaco.editor.defineTheme('custom-dark', {
                base: 'vs-dark',
                inherit: true,
                rules: [],
                colors: {
                   'editor.background': '#051311', 
                }
             });
             monaco.editor.setTheme('custom-dark');
          }}
        />
      </div>

      <div className="h-[35%] min-h-[150px]">
        <PlaygroundConsole 
            output={output} 
            isRunning={isRunning} 
            input={input}
            setInput={setInput}
        />
      </div>
    </div>
  );
};

export default LessonPlayground;