import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  return (
    <div className="markdown-body text-sm leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Tùy chỉnh Paragraph
          p: ({ node, ...props }) => (
            <p {...props} className="mb-2 last:mb-0 text-gray-200" />
          ),
          
          // Tùy chỉnh Heading
          h1: ({ node, ...props }) => <h1 {...props} className="text-lg font-bold text-white mt-4 mb-2" />,
          h2: ({ node, ...props }) => <h2 {...props} className="text-base font-bold text-white mt-3 mb-2" />,
          h3: ({ node, ...props }) => <h3 {...props} className="text-sm font-bold text-white mt-3 mb-1" />,
          
          // Tùy chỉnh List
          ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-5 mb-2 space-y-1 text-gray-300" />,
          ol: ({ node, ...props }) => <ol {...props} className="list-decimal pl-5 mb-2 space-y-1 text-gray-300" />,
          li: ({ node, ...props }) => <li {...props} className="pl-1" />,
          
          // Tùy chỉnh Bold
          strong: ({ node, ...props }) => <strong {...props} className="font-bold text-emerald-400" />,
          
          // Tùy chỉnh Code
          code: ({ node, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match && !className;

            if (isInline) {
              return (
                <code
                  {...props}
                  className="font-mono text-xs text-emerald-300 bg-white/10 px-1.5 py-0.5 rounded border border-white/5"
                >
                  {children}
                </code>
              );
            }

            return (
              <div className="relative my-3 group">
                <div className="absolute top-0 right-0 px-2 py-1 text-[10px] text-gray-500 bg-[#1e1e1e] rounded-bl-lg rounded-tr-lg border-b border-l border-white/5 font-mono">
                  {match ? match[1] : "code"}
                </div>
                <pre
                  {...props}
                  className="block font-mono text-xs bg-[#1e1e1e] p-3 rounded-lg border border-white/10 overflow-x-auto custom-scrollbar"
                >
                  <code className={`language-${match ? match[1] : ""}`}>
                    {children}
                  </code>
                </pre>
              </div>
            );
          },

          // Tùy chỉnh Blockquote
          blockquote: ({ node, ...props }) => (
            <blockquote
              {...props}
              className="border-l-2 border-emerald-500 pl-3 italic text-gray-400 my-2"
            />
          ),
          
          // Tùy chỉnh Link
          a: ({ node, ...props }) => (
            <a {...props} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;