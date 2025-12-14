import { Button, Result } from "antd";

const ProblemNotFound = ({ onBack }: { onBack: () => void }) => (
  <div className="flex h-[60vh] items-center justify-center">
    <Result
      status="404"
      title={<span className="text-white">Không tìm thấy bài tập</span>}
      subTitle={
        <span className="text-gray-400">
          Bài tập này không tồn tại hoặc đã bị xóa.
        </span>
      }
      extra={
        <Button type="primary" onClick={onBack}>
          Quay lại danh sách
        </Button>
      }
    />
  </div>
);

export default ProblemNotFound;