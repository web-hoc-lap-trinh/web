import { PlusOutlined, SearchOutlined, CommentOutlined } from "@ant-design/icons";
import { Button, Input, Select, Pagination, Tag, Empty } from "antd";
import { useState } from "react";
import { useGetDiscussionsQuery } from "../../../../../../services/discussion/discussion.service";
import DiscussionDetailView from "./DiscussionDetailView";
import CreateDiscussionModal from "./CreateDiscussionModal";

interface LessonDiscussionTabProps {
  lessonId: string;
}

const LessonDiscussionTab = ({ lessonId }: LessonDiscussionTabProps) => {
  const [view, setView] = useState<'LIST' | 'DETAIL'>('LIST');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [createVisible, setCreateVisible] = useState(false); 

  const { data, isLoading } = useGetDiscussionsQuery({ 
    lesson_id: lessonId, 
    page, 
    limit: 10 
  }, { skip: view === 'DETAIL' });

  const handleViewDetail = (id: number) => {
    setSelectedId(id);
    setView('DETAIL');
  };

  const handleBack = () => {
    setView('LIST');
    setSelectedId(null);
  };

  if (view === 'DETAIL' && selectedId) {
    return <DiscussionDetailView discussionId={selectedId} onBack={handleBack} />;
  }

  return (
    <div className="bg-[#051311] border border-white/10 rounded-2xl p-6 min-h-[600px]">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 border-b border-white/10 pb-6">
        <div>
            <h2 className="text-xl font-bold text-white mb-1">Thảo luận bài học</h2>
            <p className="text-gray-400 text-sm">Hỏi đáp, chia sẻ kiến thức về bài học này.</p>
        </div>
        <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            className="!bg-emerald-600 hover:!bg-emerald-500 border-none shadow-lg shadow-emerald-900/20"
            onClick={() => setCreateVisible(true)} 
        >
            Đặt câu hỏi
        </Button>
      </div>

      {/* Filters (Optional) */}
      <div className="flex gap-3 mb-6">
        <Input 
            prefix={<SearchOutlined className="text-gray-500" />} 
            placeholder="Tìm kiếm thảo luận..." 
            className="bg-white/5 border-white/10 text-gray-300 placeholder:text-gray-600 hover:border-emerald-500/50 focus:border-emerald-500"
        />
        <Select 
            defaultValue="newest" 
            className="w-40 [&_.ant-select-selector]:!bg-white/5 [&_.ant-select-selector]:!border-white/10 [&_.ant-select-selector]:!text-gray-300"
            popupClassName="!bg-[#1f1f1f]"
            options={[
                { value: 'newest', label: 'Mới nhất' },
                { value: 'popular', label: 'Phổ biến nhất' },
            ]}
        />
      </div>

      {/* List Items */}
      <div className="space-y-3">
        {isLoading ? (
            // Skeleton Loading
            [1,2,3].map(i => <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse"></div>)
        ) : data?.items.length === 0 ? (
             <Empty 
                image={Empty.PRESENTED_IMAGE_SIMPLE} 
                description={<span className="text-gray-500">Chưa có thảo luận nào</span>} 
            />
        ) : (
            data?.items.map((item) => (
                <div 
                    key={item.discussion_id}
                    onClick={() => handleViewDetail(item.discussion_id)}
                    className="group flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/30 hover:bg-white/[0.08] cursor-pointer transition-all"
                >
                    {/* Vote Summary Box */}
                    <div className="flex flex-col items-center justify-center min-w-[40px] gap-1 pt-1">
                        <span className="text-lg font-bold text-gray-300 group-hover:text-emerald-400 transition-colors">
                            {item.vote_count}
                        </span>
                        <span className="text-[10px] text-gray-500 uppercase">Votes</span>
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium text-base mb-1 truncate group-hover:text-emerald-300 transition-colors">
                            {item.title}
                        </h3>
                        <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                            {item.content}
                        </p>
                        
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                             <Tag color={item.discussion_type === 'QUESTION' ? 'orange' : 'blue'} className="m-0 border-none bg-white/10 text-[10px]">
                                {item.discussion_type}
                             </Tag>
                             <span className="flex items-center gap-1">
                                <CommentOutlined /> {item.total_replies} trả lời
                             </span>
                             <span>•</span>
                             <span>{item.user.full_name}</span>
                             <span>•</span>
                             <span>{new Date(item.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            ))
        )}
      </div>

      {/* Pagination */}
      {data && data.total > 10 && (
         <div className="flex justify-center mt-8">
            <Pagination 
                current={page} 
                total={data.total} 
                pageSize={10}
                onChange={setPage}
                className="[&_.ant-pagination-item]:bg-white/5 [&_.ant-pagination-item]:border-transparent [&_.ant-pagination-item-active]:!bg-emerald-600 [&_.ant-pagination-item-active]:!border-emerald-600 [&_.ant-pagination-item a]:text-gray-400 [&_.ant-pagination-item-active a]:!text-white"
            />
         </div>
      )}
      <CreateDiscussionModal 
        visible={createVisible} 
        onCancel={() => setCreateVisible(false)} 
        lessonId={lessonId} 
      />
    </div>
  );
};

export default LessonDiscussionTab;