import { Skeleton } from "antd";

const CourseDetailSkeleton = () => {
    return (
        <div className="min-h-screen bg-[#051311] pt-28 px-4">
            <div className="container mx-auto max-w-5xl">
                <div className="mb-12">
                    <Skeleton.Button active size="small" className="mb-4 bg-white/5!" />
                    <Skeleton active paragraph={{ rows: 2 }} title={{ width: '60%' }} className="[&_.ant-skeleton-content_h3]:bg-white/10! [&_.ant-skeleton-paragraph_li]:bg-white/5!" />
                </div>
                <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white/5 rounded-xl p-4 md:p-5 flex gap-4 md:gap-5 items-center">
                            <Skeleton.Avatar active shape="circle" className="bg-white/5!" />
                            <div className="flex-1">
                                <Skeleton active title={{ width: '40%' }} paragraph={{ rows: 1, width: '20%' }} className="[&_.ant-skeleton-title]:bg-white/10! [&_.ant-skeleton-paragraph_li]:bg-white/5!" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CourseDetailSkeleton;