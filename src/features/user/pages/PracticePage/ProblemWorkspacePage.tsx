import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Layout, Spin, ConfigProvider, theme, Tabs, Tooltip, FloatButton } from "antd"; // 1. Import FloatButton
import { 
  MenuOutlined, 
  LeftOutlined, 
  RightOutlined,
  FileTextOutlined,
  HistoryOutlined,
  BulbOutlined,
  RobotOutlined,
  HomeOutlined,
  CodeOutlined // Import icon Code
} from "@ant-design/icons";
import { useGetProblemQuery } from "../../../../services/problem/problem.service";
import ProblemContent from "../PracticePage/components/ProblemContent";
import TryItYourselfRunner from "./components/CodeEditor";
import ProblemNotFound from "../PracticePage/components/ProblemNotFound";
import SubmissionHistory from "./SubmissionHistory";
import ProblemDiscussion from "./ProblemDiscussion";
import AiChatPanel from "./components/AI/AiChatPanel";

const { Header, Content } = Layout;

const ProblemWorkspacePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const problemId = Number(id);
  const isValidId = !isNaN(problemId) && problemId > 0;

  // State quản lý hiển thị Editor
  const [isEditorOpen, setIsEditorOpen] = useState(true);

  const { data: problem, isLoading, isError } = useGetProblemQuery(problemId, {
    skip: !isValidId,
  });

  const getDifficultyColor = (diff?: string) => {
    switch (diff) {
      case "EASY": return { color: "#10b981", bg: "#064e3b" };
      case "MEDIUM": return { color: "#f59e0b", bg: "#451a03" };
      case "HARD": return { color: "#f43f5e", bg: "#881337" };
      default: return { color: "#9ca3af", bg: "#374151" };
    }
  };

  const tabItems = problem ? [
    {
      key: 'description',
      label: <span className="flex items-center gap-2"><FileTextOutlined /> Mô tả</span>,
      children: (
        <div className="h-full overflow-y-auto custom-scrollbar p-5 pb-20">
           <ProblemContent 
              problem={problem} 
              diffStyle={getDifficultyColor(problem.difficulty)} 
           />
        </div>
      ),
    },
    {
      key: 'submissions',
      label: <span className="flex items-center gap-2"><HistoryOutlined /> Bài nộp</span>,
      children: <div className="p-0 h-full"><SubmissionHistory problemId={problem.problem_id} /></div>,
    },
    {
      key: 'discussion',
      label: <span className="flex items-center gap-2"><BulbOutlined /> Thảo luận</span>,
      children: <div className="p-0 h-full"><ProblemDiscussion problemId={problem.problem_id} /></div>,
    },
    {
      key: 'ai_chat',
      label: <span className="flex items-center gap-2 text-emerald-400"><RobotOutlined /> AI Assistant</span>,
      children: (
        <div className="h-full overflow-hidden">
            <AiChatPanel problemId={problem.problem_id} />
        </div>
      ),
    },
  ] : [];

  if (!isValidId || isError || (!isLoading && !problem)) {
     return <ProblemNotFound onBack={() => navigate('/practice')} />;
  }

  if (isLoading) return (
    <div className="h-screen bg-[#1a1a1a] flex items-center justify-center">
      <Spin size="large" tip="Loading Workspace..." />
    </div>
  );

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: { colorPrimary: "#10b981", colorBgContainer: "#262626" },
        components: {
            Tabs: {
                itemColor: "#a3a3a3",
                itemSelectedColor: "#ffffff",
                itemHoverColor: "#ffffff",
                inkBarColor: "#10b981",
                titleFontSize: 13,
            }
        }
      }}
    >
      <Layout className="h-screen overflow-hidden flex flex-col font-sans relative">
        {/* Header */}
        <Header className="flex items-center justify-between px-4 h-12 bg-linear-to-br from-emerald-900/20 to-[#0a1916] border-b border-white/10 shrink-0 z-20">
          <div className="flex items-center gap-4">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                 <img src="/logo-icon.png" alt="Logo" className="h-6 w-6 mr-2 opacity-80 hover:opacity-100 transition" onError={(e) => e.currentTarget.style.display='none'} /> 
                 <span className="font-bold text-white tracking-tight hidden md:block">Codery</span>
            </div>
            
            <div className="h-4 w-px bg-white/10 mx-2" />
            
            <div className="flex items-center gap-2">
                 <Button type="text" size="small" icon={<MenuOutlined />} className="text-gray-400 hover:text-white" />
                 <span className="text-white font-medium text-sm truncate max-w-[200px]">{problem.problem_id}. {problem.title}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
             {/* Cách 1: Nút Mở Editor trên Header (Luôn hiển thị hoặc chỉ hiện khi đóng) */}
             {!isEditorOpen && (
                <Tooltip title="Mở trình biên dịch (CMD + B)">
                    <Button 
                        icon={<CodeOutlined />} 
                        size="small" 
                        onClick={() => setIsEditorOpen(true)}
                        className="bg-emerald-600 border-none text-white hover:bg-emerald-500 animate-fade-in flex items-center gap-1"
                    >
                        Code
                    </Button>
                </Tooltip>
             )}

             <Button type="text" size="small" icon={<LeftOutlined />} className="text-gray-500 hover:text-white bg-white/5" />
             <Button type="text" size="small" icon={<RightOutlined />} className="text-gray-500 hover:text-white bg-white/5" />
          </div>
        </Header>

        <Content className="flex-1 overflow-hidden p-2 relative">
          <div className="flex h-full gap-2 transition-all duration-300">
            {/* Left Panel: Tabs */}
            {/* Nếu Editor đóng -> width 100%, Nếu mở -> width 45% */}
            <div className={`flex-1 h-full bg-linear-to-br! from-emerald-900/20! to-[#0a1916]! rounded-lg overflow-y-auto border border-white/5 flex flex-col transition-all duration-300 ${isEditorOpen ? 'lg:max-w-[45%]' : 'max-w-full'}`}>
               <Tabs 
                  defaultActiveKey="description" 
                  items={tabItems} 
                  className="h-full [&_.ant-tabs-nav]:mb-0 [&_.ant-tabs-nav]:px-4 [&_.ant-tabs-nav]:bg-[#333] [&_.ant-tabs-content-holder]:h-full [&_.ant-tabs-content]:h-full"
               />
            </div>

            {/* Right Panel: Editor */}
            <div className={`flex-1 h-full bg-[#262626] rounded-lg overflow-hidden border border-white/5 relative transition-all duration-300 ${!isEditorOpen ? 'hidden' : ''}`}>
               <TryItYourselfRunner 
                  lessonId={problem.problem_id.toString()} 
                  onClose={() => setIsEditorOpen(false)} // Truyền hàm đóng để ẩn Editor
               />
            </div>
          </div>

          {/* Cách 2: Nút Float Button (Nổi ở góc dưới) - Chỉ hiện khi Editor đóng */}
          {!isEditorOpen && (
            <FloatButton 
                icon={<CodeOutlined />} 
                type="primary" 
                onClick={() => setIsEditorOpen(true)}
                tooltip={<div>Mở trình biên dịch</div>}
                style={{ right: 24, bottom: 24 }}
                className="animate-bounce-in"
            />
          )}
        </Content>
      </Layout>
    </ConfigProvider>
  );
};

export default ProblemWorkspacePage;