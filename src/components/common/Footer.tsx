import { Button } from "antd";
import { CodeOutlined, GithubOutlined, TwitterOutlined, LinkedinFilled } from "@ant-design/icons";

const Footer = () => {
    return (
        <footer className="bg-[#020c0a] border-t border-white/5 pt-16 pb-8">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center text-white"><CodeOutlined /></div>
                            <span className="text-lg font-bold text-white">Codery</span>
                        </div>
                        <p className="text-gray-500 text-sm">
                            Nền tảng học lập trình toàn diện. Từ dòng code đầu tiên đến kỹ sư phần mềm chuyên nghiệp.
                        </p>
                    </div>
                    
                    <div>
                        <h4 className="text-white! font-semibold mb-4">Học tập</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="text-gray-500! hover:text-emerald-400! transition">Lộ trình Frontend</a></li>
                            <li><a href="#" className="text-gray-500! hover:text-emerald-400! transition">Lộ trình Backend</a></li>
                            <li><a href="#" className="text-gray-500! hover:text-emerald-400! transition">Cấu trúc dữ liệu</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Cộng đồng</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="text-gray-500! hover:text-emerald-400! transition">Diễn đàn thảo luận</a></li>
                            <li><a href="#" className="text-gray-500! hover:text-emerald-400! transition">Bảng xếp hạng</a></li>
                            <li><a href="#" className="text-gray-500! hover:text-emerald-400! transition">Blog công nghệ</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Kết nối</h4>
                        <div className="flex gap-4">
                            <Button shape="circle" icon={<GithubOutlined />} className="bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-emerald-400" />
                            <Button shape="circle" icon={<TwitterOutlined />} className="bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-emerald-400" />
                            <Button shape="circle" icon={<LinkedinFilled />} className="bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-emerald-400" />
                        </div>
                    </div>
                </div>
                <div className="border-t border-white/5 pt-8 text-center text-gray-600 text-sm">
                    © 2025 Codery Inc. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
