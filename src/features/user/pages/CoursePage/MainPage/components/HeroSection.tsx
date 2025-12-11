import { FireOutlined } from "@ant-design/icons";

const HeroSection = () => {
    return (
        <section className="mb-10 md:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium mb-4">
                <FireOutlined />
                Lộ trình học lập trình từng bước
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
                Khám phá các khóa học phù hợp với bạn
            </h1>
            <p className="text-gray-400 max-w-2xl text-sm md:text-base">
                Chọn lộ trình theo ngôn ngữ hoặc chủ đề bạn quan tâm. Mỗi khóa học được thiết kế với bài giảng, bài tập coding và dự án nhỏ giúp bạn học tới đâu vững tới đó.
            </p>
        </section>
    );
};

export default HeroSection;