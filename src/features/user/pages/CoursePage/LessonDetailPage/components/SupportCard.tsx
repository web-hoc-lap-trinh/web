import { Button } from "antd";

const SupportCard = () => {
  return (
    <div className="bg-linear-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden shadow-lg">
      <div className="relative z-10">
        <h3 className="text-white font-semibold text-lg mb-2">Cần hỗ trợ?</h3>
        <p className="text-emerald-100/70 text-sm mb-4 leading-relaxed">
          Tham gia cộng đồng để được giải đáp thắc mắc và chia sẻ kinh nghiệm
        </p>
        <Button 
          size="middle"
          className="w-full bg-emerald-500/20 hover:bg-emerald-500/30! border-emerald-500/40 text-emerald-300 hover:text-emerald-200! font-semibold h-10 shadow-sm"
        >
          Tham gia cộng đồng
        </Button>
      </div>
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl"></div>
      <div className="absolute -top-10 -left-10 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl"></div>
    </div>
  );
};

export default SupportCard;
