import { Empty } from "antd";

const RelatedLessonsCard = () => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg">
      <h3 className="text-white font-semibold text-lg mb-5 flex items-center gap-2">
        <span className="w-1 h-6 bg-emerald-500 rounded-full inline-block"></span>
        Bài học liên quan
      </h3>
      
      <Empty 
        description={
          <div className="text-center">
            <p className="text-gray-400 text-sm">Đang cập nhật</p>
          </div>
        }
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        imageStyle={{ height: 50 }}
      />
    </div>
  );
};

export default RelatedLessonsCard;
