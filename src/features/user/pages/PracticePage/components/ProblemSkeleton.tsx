import { Skeleton } from "antd";

const ProblemSkeleton = () => (
  <div className="container mx-auto max-w-6xl pt-4">
    <Skeleton active avatar paragraph={{ rows: 2 }} className="mb-8" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
      <div>
        <Skeleton.Button active block style={{ height: 200 }} />
      </div>
    </div>
  </div>
);

export default ProblemSkeleton;