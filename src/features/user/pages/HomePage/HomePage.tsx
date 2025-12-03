import { Button, ConfigProvider, theme, Typography, Badge } from "antd";
import {
    CodeOutlined,
    RocketOutlined,
    TrophyOutlined,
    ReadOutlined,
    TeamOutlined,
    RightOutlined,
    FireFilled,
    CheckCircleFilled,
} from "@ant-design/icons";
import Header from "../../../../components/common/Header";
import FeatureCard from './components/FeatureCard'
import { useNavigate } from "react-router-dom";
import Footer from "../../../../components/common/Footer";

const THEME_COLOR = "#34D399"; 

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
                token: { colorPrimary: THEME_COLOR, fontFamily: "'Inter', sans-serif" },
            }}
        >
            <div className="min-h-screen bg-[#051311] text-white overflow-x-hidden font-sans">
                <Header />
                <section className="relative pt-32 pb-20 px-4">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
                    
                    <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                        <div className="space-y-6 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
                                <FireFilled /> Hơn 10,000 học viên đang online
                            </div>
                            <Typography.Title
                                level={1}
                                className="!text-5xl lg:!text-6xl !text-white leading-tight"
                                style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
                            >
                                Viết Code <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                                    Kiến Tạo Tương Lai
                                </span>
                            </Typography.Title>
                            <p className="text-gray-400 text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed">
                                Nền tảng học lập trình tương tác. Kết hợp lý thuyết chuyên sâu và thử thách thực chiến  .
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                                <Button type="primary" size="large" className="h-12 px-8 text-base bg-emerald-500 hover:!bg-emerald-400 border-0 shadow-lg shadow-emerald-500/25">
                                    Bắt đầu học ngay
                                </Button>
                                <Button size="large" className="h-12 px-8 text-base bg-white/5 border-white/10 text-white hover:!text-emerald-400 hover:!border-emerald-400 backdrop-blur-sm">
                                    Giải bài tập
                                </Button>
                            </div>
                            
                            <div className="pt-8 flex items-center justify-center lg:justify-start gap-6 text-gray-500 text-sm">
                                <span className="flex items-center gap-2"><CheckCircleFilled className="!text-emerald-500"/> Miễn phí trọn đời</span>
                                <span className="flex items-center gap-2"><CheckCircleFilled className="!text-emerald-500"/> Cấp chứng chỉ</span>
                            </div>
                        </div>

                        <div className="relative hidden lg:block">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-30"></div>
                            <div className="relative bg-[#0A1F1A] border border-white/10 rounded-2xl p-6 shadow-2xl">
                                <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-4">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                    <span className="ml-2 text-xs text-gray-500">solve_problem.js</span>
                                </div>
                                <pre className="font-mono text-sm text-gray-300">
                                    <code>
                                        <span className="text-purple-400">function</span> <span className="text-yellow-300">twoSum</span>(nums, target) {'{'}
                                        <br/>  <span className="text-purple-400">const</span> map = <span className="text-purple-400">new</span> <span className="text-emerald-300">Map</span>();
                                        <br/>  <span className="text-purple-400">for</span> (<span className="text-purple-400">let</span> i = 0; i &lt; nums.length; i++) {'{'}
                                        <br/>    <span className="text-purple-400">const</span> complement = target - nums[i];
                                        <br/>    <span className="text-gray-500">// Tìm kiếm mảnh ghép còn thiếu</span>
                                        <br/>    <span className="text-purple-400">if</span> (map.has(complement)) {'{'}
                                        <br/>       <span className="text-purple-400">return</span> [map.get(complement), i];
                                        <br/>    {'}'}
                                        <br/>    map.set(nums[i], i);
                                        <br/>  {'}'}
                                        <br/>{'}'}
                                    </code>
                                </pre>
                                <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                                    <span className="text-xs text-gray-500">Console Output</span>
                                    <Badge status="processing" text={<span className="text-emerald-400 text-xs">Biên dịch thành công</span>} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="border-y border-white/5 bg-white/[0.02]">
                    <div className="container mx-auto max-w-7xl px-4 py-12">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            {[
                                { num: "100+", label: "Khóa học chi tiết" },
                                { num: "2000+", label: "Bài tập Algorithmn" },
                                { num: "50K+", label: "Thành viên tích cực" },
                                { num: "1M+", label: "Dòng code đã chạy" },
                            ].map((stat, idx) => (
                                <div key={idx}>
                                    <div className="text-3xl font-bold text-white mb-1">{stat.num}</div>
                                    <div className="text-emerald-500/80 text-sm font-medium uppercase tracking-wider">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-24 px-4 relative">
                    <div className="container mx-auto max-w-7xl">
                        <div className="text-center mb-16 max-w-2xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Môi trường toàn diện cho <span className="text-emerald-400">Developer</span>
                            </h2>
                            <p className="text-gray-400">
                                Không chỉ là đọc tài liệu. Tại Codery, bạn được thực hành ngay lập tức với công cụ biên dịch mạnh mẽ và hệ thống chấm điểm tự động.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <FeatureCard 
                                icon={<ReadOutlined />}
                                title="Tài liệu chuyên sâu"
                                description="Hệ thống bài giảng từ cơ bản đến nâng cao cho HTML, CSS, JS, React, Python... tương tự W3Schools."
                                tag="Learn"
                            />
                            <FeatureCard 
                                icon={<CodeOutlined />}
                                title="Luyện tập thuật toán"
                                description="Hàng nghìn bài tập cấu trúc dữ liệu và giải thuật với Test case tự động như LeetCode."
                                tag="Practice"
                            />
                            <FeatureCard 
                                icon={<RocketOutlined />}
                                title="Trình biên dịch Online"
                                description="Viết code, chạy thử và debug ngay trên trình duyệt mà không cần cài đặt môi trường."
                            />
                            <FeatureCard 
                                icon={<TrophyOutlined />}
                                title="Thi đấu & Xếp hạng"
                                description="Tham gia các cuộc thi code hàng tuần (Weekly Contest) để leo rank và nhận quà."
                                tag="Compete"
                            />
                            <FeatureCard 
                                icon={<TeamOutlined />}
                                title="Cộng đồng hỗ trợ"
                                description="Thảo luận lời giải, chia sẻ kinh nghiệm phỏng vấn và tìm kiếm mentor."
                            />
                            <FeatureCard 
                                icon={<FireFilled />}
                                title="Giữ lửa (Streak)"
                                description="Hệ thống gamification giúp bạn duy trì thói quen học tập mỗi ngày."
                                tag="New"
                            />
                        </div>
                    </div>
                </section>

                <section className="py-20 bg-white/5 border-t border-white/5">
                    <div className="container mx-auto max-w-7xl px-4">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">Các ngôn ngữ phổ biến</h3>
                                <p className="text-gray-400">Bắt đầu hành trình với ngôn ngữ bạn yêu thích</p>
                            </div>
                            <Button type="link" className="!text-emerald-400 hover:!text-emerald-300 flex items-center gap-1 p-0">
                                Xem tất cả khóa học <RightOutlined />
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {['JavaScript', 'Python', 'Java', 'C++', 'React', 'SQL', 'Go', 'Rust', 'HTML/CSS', 'TypeScript', 'Node.js', 'Git'].map((lang) => (
                                <div key={lang} className="bg-[#0A1F1A] border border-white/5 hover:border-emerald-500/50 rounded-xl p-4 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all hover:-translate-y-1 group">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-emerald-400 font-bold text-lg group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                        {lang[0]}
                                    </div>
                                    <span className="font-medium text-gray-300 group-hover:text-white">{lang}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-24 px-4 text-center">
                    <div className="container mx-auto max-w-4xl bg-gradient-to-b from-[#0F2E26] to-[#051311] border border-emerald-500/20 rounded-3xl p-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />
                        
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">
                            Sẵn sàng trở thành <br/> Master Developer?
                        </h2>
                        <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto relative z-10">
                            Tham gia cùng cộng đồng lập trình viên năng động nhất. Bắt đầu miễn phí ngay hôm nay.
                        </p>
                        <Button 
                            type="primary" 
                            size="large" 
                            className="h-14 px-10 text-lg font-semibold bg-emerald-500 hover:!bg-emerald-400 shadow-xl shadow-emerald-500/20 relative z-10"
                            onClick={() => navigate('/signup')}
                        >
                            Tạo tài khoản miễn phí
                        </Button>
                    </div>
                </section>
                <Footer />
            </div>
        </ConfigProvider>
    );
};

export default HomePage;