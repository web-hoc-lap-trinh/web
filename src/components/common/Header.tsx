import { Link, useNavigate } from "react-router-dom";
import { Button, Avatar } from "antd";
import { CodeOutlined, UserOutlined, FireOutlined } from "@ant-design/icons";
import { useAuth } from "../../hooks/useAuth";

const Header = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#051311]/80 backdrop-blur-md border-b border-white/5 h-16 flex items-center">
            <div className="container mx-auto px-4 max-w-7xl grid grid-cols-12 items-center">
                <div className="col-span-4 md:col-span-3 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}> 
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <CodeOutlined className="text-white font-bold text-lg" />
                    </div>
                    <span className="text-xl font-bold text-white tracking-wide">Codery</span>
                </div>
                <nav className="col-span-4 md:col-span-6 hidden md:flex items-center justify-center gap-8">
                    {['Khóa học', 'Luyện tập', 'Cuộc thi', 'Cộng đồng'].map((item) => (
                        <Link key={item} to="#" className="!text-gray-300 hover:text-emerald-400 font-medium transition-colors text-sm">
                            {item}
                        </Link>
                    ))}
                </nav>

                <div className="col-span-8 md:col-span-3 flex items-center justify-end gap-3">
                    {!isAuthenticated ? (
                        <>
                            <Button type="text" className="text-gray-300 hover:text-white hidden sm:block" onClick={() => navigate('/signin')}>
                                Đăng nhập
                            </Button>
                            <Button 
                                type="primary" 
                                className="bg-emerald-500 hover:!bg-emerald-400 border-0 font-semibold shadow-lg shadow-emerald-900/40"
                                onClick={() => navigate('/signup')}
                            >
                                Đăng ký miễn phí
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button 
                                type="text"
                                className="!text-emerald-400 hover:!text-emerald-300"
                                icon={<FireOutlined />}
                                onClick={() => navigate('/user')}
                                title="Streak"
                            />
                            <Button 
                                type="text"
                                className="!text-gray-200 hover:!text-white"
                                onClick={() => navigate(user?.role === 'ADMIN' ? '/admin' : '/user/profile')}
                                icon={<Avatar size={28} icon={<UserOutlined />} />}
                                title="Profile"
                            />
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;