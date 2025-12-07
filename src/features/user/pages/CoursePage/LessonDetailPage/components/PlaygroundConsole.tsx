import { CaretRightOutlined, CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { Spin } from "antd";
import type { RunCodeResponse } from "../../../../../../services/try-it-yourself/try-it-yourself.types";

interface PlaygroundConsoleProps {
  output: RunCodeResponse | null;
  isRunning: boolean;
  input: string;
  setInput: (val: string) => void;
}

const PlaygroundConsole = ({ output, isRunning, input, setInput }: PlaygroundConsoleProps) => {
  return (
    <div className="flex flex-col h-full border-t border-white/10 bg-[#0a1514]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/5">
        <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">Terminal</span>
        {output && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500">Thời gian: {output.execution_time}ms</span>
            {output.success ? (
              <span className="text-emerald-400 flex items-center gap-1"><CheckCircleFilled /> Success</span>
            ) : (
              <span className="text-red-400 flex items-center gap-1"><CloseCircleFilled /> Error</span>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 p-0 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
        <div className="flex flex-col">
          <div className="px-4 py-2 text-xs text-gray-500 font-mono bg-white/[0.02]">StdIn (Input)</div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập đầu vào cho chương trình (nếu có)..."
            className="flex-1 w-full bg-transparent text-gray-300 font-mono text-sm p-4 focus:outline-none resize-none placeholder:text-gray-700"
          />
        </div>

        <div className="flex flex-col relative min-h-[150px]">
           <div className="px-4 py-2 text-xs text-gray-500 font-mono bg-white/[0.02]">StdOut (Output)</div>
          {isRunning ? (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0a1514]/80 z-10">
              <Spin tip="Compiling..." size="large" />
            </div>
          ) : (
            <div className="flex-1 p-4 overflow-auto font-mono text-sm whitespace-pre-wrap">
              {!output ? (
                <span className="text-gray-600 italic">Nhấn "Chạy Code" để xem kết quả...</span>
              ) : (
                <>
                  {output.error && (
                    <div className="text-red-400 mb-2 p-2 bg-red-500/10 rounded border border-red-500/20">
                      {output.error}
                    </div>
                  )}
                  <div className="text-emerald-100">{output.output}</div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaygroundConsole;