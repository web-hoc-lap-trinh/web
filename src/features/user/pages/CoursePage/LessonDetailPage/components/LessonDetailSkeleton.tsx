import { Skeleton } from "antd";

const LessonDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#051311] pt-24 px-4 pb-20">
      <div className="container mx-auto max-w-6xl">
        {/* Header Skeleton */}
        <div className="mb-10">
          <Skeleton.Button active size="small" className="mb-4 bg-white/5!" style={{ width: 200 }} />
          <Skeleton 
            active 
            paragraph={{ rows: 2 }} 
            title={{ width: '60%' }} 
            className="[&_.ant-skeleton-content_h3]:bg-white/10! [&_.ant-skeleton-paragraph_li]:bg-white/5! mb-6" 
          />
          <div className="flex gap-3">
            <Skeleton.Button active size="small" className="bg-white/5!" />
            <Skeleton.Button active size="small" className="bg-white/5!" />
            <Skeleton.Button active size="small" className="bg-white/5!" />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white/5 rounded-xl p-6 md:p-8">
              <Skeleton 
                active 
                paragraph={{ rows: 10 }} 
                className="[&_.ant-skeleton-title]:bg-white/10! [&_.ant-skeleton-paragraph_li]:bg-white/5!" 
              />
            </div>
          </div>
          
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/5 rounded-xl p-6">
              <Skeleton 
                active 
                paragraph={{ rows: 4 }} 
                className="[&_.ant-skeleton-title]:bg-white/10! [&_.ant-skeleton-paragraph_li]:bg-white/5!" 
              />
            </div>
            <div className="bg-white/5 rounded-xl p-6">
              <Skeleton 
                active 
                paragraph={{ rows: 2 }} 
                className="[&_.ant-skeleton-title]:bg-white/10! [&_.ant-skeleton-paragraph_li]:bg-white/5!" 
              />
            </div>
            <div className="bg-white/5 rounded-xl p-6">
              <Skeleton 
                active 
                paragraph={{ rows: 2 }} 
                className="[&_.ant-skeleton-title]:bg-white/10! [&_.ant-skeleton-paragraph_li]:bg-white/5!" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonDetailSkeleton;
