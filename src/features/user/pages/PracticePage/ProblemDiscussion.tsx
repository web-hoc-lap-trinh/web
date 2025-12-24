import { useState } from "react";
import { Button, Pagination, Empty, Skeleton, ConfigProvider, Tabs } from "antd";
import { PlusOutlined, QuestionCircleFilled, BulbFilled, BugFilled } from "@ant-design/icons";
import { useGetDiscussionsQuery } from "../../../../services/discussion/discussion.service";
import DiscussionListItem from "./components/DiscussionListItem";
import CreateDiscussionModal from "./components/CreateDiscussionModal";
import DiscussionDetailView from "./components/Discussion/DiscussionDetailView";
import type { DiscussionType } from "../../../../types/discussion.types";

const ProblemDiscussion = ({ problemId }: { problemId: number }) => {
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState<DiscussionType | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDiscussionId, setSelectedDiscussionId] = useState<number | null>(null);

  const { data, isLoading, refetch } = useGetDiscussionsQuery({
    problem_id: problemId,
    page,
    limit: 10,
    type: filterType
  });

  const handleBackToList = () => {
    setSelectedDiscussionId(null);
    refetch(); // Refresh list to update counts if changed
  };

  // Render Detail View
  if (selectedDiscussionId) {
    return (
        <DiscussionDetailView 
            discussionId={selectedDiscussionId} 
            onBack={handleBackToList} 
        />
    );
  }

  // Cấu hình Tabs giống LeetCode
  const tabItems = [
    { key: 'ALL', label: <span className="flex items-center gap-2">Tất cả</span> },
    { key: 'SOLUTION', label: <span className="flex items-center gap-2"><BulbFilled className="text-yellow-500"/> Solutions</span> },
    { key: 'QUESTION', label: <span className="flex items-center gap-2"><QuestionCircleFilled className="text-blue-400"/> Questions</span> },
    { key: 'BUG_REPORT', label: <span className="flex items-center gap-2"><BugFilled className="text-red-400"/> Bugs</span> },
  ];

  return (
    <div className="h-full flex flex-col">
        <div className="py-2 flex justify-end items-center sticky top-0 z-10">
           <Button 
                type="primary" 
                size="small"
                icon={<PlusOutlined />}
                className="bg-white/10 border-none hover:bg-white/20! text-gray-200 ml-2"
                onClick={() => setIsModalOpen(true)}
            >
                Đặt vấn đề
            </Button>
            
        </div>
        

        {/* --- List Content --- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
            {isLoading ? (
                <div className="p-4 space-y-4">
                    {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} active avatar paragraph={{ rows: 1 }} />)}
                </div>
            ) : !data || data.items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <Empty description="No discussions yet" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                </div>
            ) : (
                <div className="divide-y divide-white/5">
                    {data.items.map(item => (
                        <DiscussionListItem 
                            key={item.discussion_id} 
                            discussion={item} 
                            onClick={() => setSelectedDiscussionId(item.discussion_id)}
                        />
                    ))}
                </div>
            )}
        </div>

        {/* --- Pagination --- */}
        {data && data.total > 10 && (
            <div className="p-3 border-t border-white/10 flex justify-center bg-[#262626]">
                <ConfigProvider theme={{
                    token: { colorPrimary: '#10b981', colorText: '#a3a3a3', colorBgContainer: 'transparent', colorBorder: '#404040' }
                }}>
                    <Pagination 
                        simple 
                        current={page} 
                        total={data.total} 
                        pageSize={10}
                        onChange={setPage} 
                        size="small"
                    />
                </ConfigProvider>
            </div>
        )}

        {/* --- Create Modal --- */}
        <CreateDiscussionModal 
            visible={isModalOpen} 
            onCancel={() => setIsModalOpen(false)}
            context={{ type: 'problem', id: problemId }}
        />
    </div>
  );
};

export default ProblemDiscussion;