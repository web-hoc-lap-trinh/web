import { useEffect, useRef, useState } from "react";
import { Button, Input, Skeleton, Tooltip, message } from "antd";
import { 
  SendOutlined, 
  DeleteOutlined, 
  RobotOutlined, 
  UserOutlined,
  InfoCircleOutlined,
  LoadingOutlined
} from "@ant-design/icons";
import { 
  useGetAiConversationQuery, 
  useChatWithAiMutation, 
  useDeleteAiConversationMutation 
} from "../../../../../../services/ai/ai.service";
import type { IAiMessage } from "../../../../../../types/ai.types";
import dayjs from "dayjs";
import MarkdownRenderer from "./MarkdownRenderer";

interface AiChatPanelProps {
  problemId: number;
}

const AiChatPanel = ({ problemId }: AiChatPanelProps) => {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data, isLoading: isLoadingHistory } = useGetAiConversationQuery(problemId);
  const [sendMessage, { isLoading: isSending }] = useChatWithAiMutation();
  const [deleteConversation, { isLoading: isDeleting }] = useDeleteAiConversationMutation();

  const messages = data?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    try {
      await sendMessage({
        problemId,
        data: {
          conversationId: data?.conversation?.id || 0, // 0 nếu chưa có
          message: inputValue.trim()
        }
      }).unwrap();
      
      setInputValue("");
    } catch (error) {
      message.error("Không thể gửi tin nhắn. Vui lòng thử lại.");
    }
  };

  const handleClearHistory = async () => {
    try {
      await deleteConversation(problemId).unwrap();
      message.success("Đã xóa lịch sử trò chuyện");
    } catch (error) {
      message.error("Lỗi khi xóa lịch sử");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isLoadingHistory) {
    return <div className="p-4 space-y-4"><Skeleton active avatar paragraph={{ rows: 2 }} /></div>;
  }

  return (
    <div className="flex flex-col h-full text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <RobotOutlined className="text-emerald-400 text-lg" />
          <span className="font-semibold text-gray-200">AI Assistant</span>
          <Tooltip title="AI có thể giải thích đề bài, gợi ý thuật toán hoặc giải thích lỗi sai.">
            <InfoCircleOutlined className="text-gray-500 cursor-help text-xs" />
          </Tooltip>
        </div>
        
        {messages.length > 0 && (
          <Tooltip title="Xóa lịch sử chat">
            <Button 
              type="text" 
              size="small" 
              icon={<DeleteOutlined />} 
              onClick={handleClearHistory}
              loading={isDeleting}
              className="text-gray-500 hover:text-red-400"
            />
          </Tooltip>
        )}
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
               <RobotOutlined className="text-3xl text-emerald-500/50" />
            </div>
            <p className="text-center max-w-[200px] text-sm">
              Xin chào! Mình có thể giúp gì cho bạn về bài tập này?
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
               {["Gợi ý thuật toán", "Giải thích Constraints", "Tìm lỗi trong code"].map(text => (
                 <button 
                    key={text}
                    onClick={() => setInputValue(text)}
                    className="text-xs border border-white/10 bg-white/5 px-3 py-1 rounded-full hover:bg-white/10 transition-colors"
                 >
                    {text}
                 </button>
               ))}
            </div>
          </div>
        ) : (
          messages.map((msg: IAiMessage) => {
            const isUser = msg.role === 'user';
            return (
              <div key={msg.id} className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-emerald-600' : 'bg-blue-600'}`}>
                  {isUser ? <UserOutlined /> : <RobotOutlined />}
                </div>

                {/* Bubble */}
                <div className={`flex flex-col max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
                  <div 
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      isUser 
                        ? 'bg-emerald-600/20 border border-emerald-500/20 text-emerald-50 rounded-tr-none' 
                        : 'bg-white/10 border border-white/5 text-gray-200 rounded-tl-none'
                    }`}
                  >
                    {isUser ? (
                        <div className="whitespace-pre-wrap">{msg.message}</div>
                    ) : (
                        <MarkdownRenderer content={msg.message} />
                    )}
                  </div>
                  <span className="text-[10px] text-gray-500 mt-1 px-1">
                    {dayjs(msg.created_at).format("HH:mm")}
                  </span>
                </div>
              </div>
            );
          })
        )}
        
        {/* Loading Indicator */}
        {isSending && (
          <div className="flex gap-3">
             <div className="shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <RobotOutlined />
             </div>
             <div className="bg-white/10 border border-white/5 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                <LoadingOutlined className="text-emerald-400" />
                <span className="text-xs text-gray-400">AI đang suy nghĩ...</span>
             </div>
          </div>
        )}
        
        {/* Invisible div to scroll to */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-end gap-2">
          <Input.TextArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Hỏi AI về bài tập..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            disabled={isSending}
            className="flex-1 bg-[#333]! border-none! text-white! rounded-xl! py-3! focus:ring-0!"
          />
          <Button
            type="text"
            icon={<SendOutlined />}
            onClick={handleSend}
            disabled={!inputValue.trim() || isSending}
            className={`${inputValue.trim() ? 'text-emerald-400 hover:text-emerald-300' : 'text-gray-500'}`}
          />
        </div>
        <div className="text-center mt-2">
           <span className="text-[10px] text-gray-600">AI có thể mắc lỗi. Hãy kiểm tra lại thông tin quan trọng.</span>
        </div>
      </div>
    </div>
  );
};

export default AiChatPanel;