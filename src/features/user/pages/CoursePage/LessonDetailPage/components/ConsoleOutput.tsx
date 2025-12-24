import { CodeOutlined, ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Spin } from "antd";

interface ConsoleOutputProps {
  output: string;
  error: string | null;
  status: string | null;
  executionTime: number;
  isLoading: boolean;
}

const ConsoleOutput = ({ output, error, status, executionTime, isLoading }: ConsoleOutputProps) => {
  return (
    <div className="flex flex-col h-full bg-[#0d1117] border border-white/10 rounded-xl overflow-hidden font-mono text-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
        <span className="flex items-center gap-2 text-gray-400">
          <CodeOutlined /> Console
        </span>
        {executionTime > 0 && !isLoading && (
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <ClockCircleOutlined /> {executionTime}ms
          </span>
        )}
      </div>

      <div className="flex-1 p-4 overflow-auto text-gray-300 relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <Spin size="large" tip="Compiling..." />
          </div>
        ) : (
          <>
            {/* Status Indicator */}
            {status && (
              <div className={`mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${
                error ? "text-red-500" : "text-emerald-500"
              }`}>
                {error ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
                {status}
              </div>
            )}

            {/* Output Content */}
            {output && (
              <pre className="whitespace-pre-wrap font-mono text-gray-300 leading-relaxed">
                {output}
              </pre>
            )}

            {/* Error Content */}
            {error && (
              <pre className="mt-2 whitespace-pre-wrap font-mono text-red-400 bg-red-500/10 p-2 rounded border border-red-500/20">
                {error}
              </pre>
            )}

            {!output && !error && !status && (
              <div className="text-gray-600 italic">
                Nhấn "Thực thi" để xem kết quả...
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ConsoleOutput;