import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import * as React from "react";
import { Input, Button, Typography, Alert, message, Checkbox, ConfigProvider, theme } from "antd";
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone, CheckCircleFilled } from "@ant-design/icons";

const THEME_COLOR = "#34D399";
const BG_INPUT = "rgba(255, 255, 255, 0.05)";

function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(true);
    const [localSubmitting, setLocalSubmitting] = useState(false);
    const [inputError, setInputError] = useState("");
    const navigate = useNavigate();
    const { login, loginLoading, loginError } = useAuth();

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setInputError("");

        if (!email || !password) {
            setInputError("Vui lòng nhập đầy đủ email/tài khoản và mật khẩu.");
            message.error("Vui lòng nhập đầy đủ thông tin đăng nhập.");
            return;
        }

        setLocalSubmitting(true);
        try {
            const res = await login({ email, password });
            const role = res?.user?.role || "user";
            navigate(`/${role}`);
        } finally {
            setLocalSubmitting(false);
        }
    };

    const submitting = localSubmitting || loginLoading;

    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                    colorPrimary: THEME_COLOR,
                    colorBgContainer: BG_INPUT,
                    colorBorder: "transparent",
                    colorTextPlaceholder: "#6B7280",
                    controlHeightLG: 50,
                    borderRadiusLG: 12,
                },
                components: {
                    Input: {
                        activeBorderColor: THEME_COLOR,
                        hoverBorderColor: THEME_COLOR,
                        activeShadow: "0 0 0 2px rgba(52, 211, 153, 0.1)",
                    },
                    Button: {
                        primaryShadow: "0 4px 14px 0 rgba(16, 185, 129, 0.39)",
                    },
                    Checkbox: {
                        borderRadiusSM: 4,
                    }
                }
            }}
        >
            <main className="min-h-screen w-full bg-[#051311] relative overflow-hidden flex items-center justify-center px-4 py-10">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-900/20 rounded-full blur-[120px]" />

                <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
                    
                    <section className="hidden md:flex flex-col justify-center space-y-8 pr-4">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                    <span className="font-bold text-white text-lg">C</span>
                                </div>
                                <span className="text-xl font-bold text-white tracking-wide">Codery</span>
                            </div>

                            <Typography.Title level={1} className="!m-0 !text-white !font-bold !text-4xl lg:!text-5xl leading-tight">
                                Chào mừng <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                                    trở lại với chúng tôi
                                </span>
                            </Typography.Title>
                            <p className="text-gray-400 text-lg max-w-md leading-relaxed">
                                Đăng nhập để tiếp tục hành trình chinh phục tri thức, theo dõi tiến độ và mở khóa tiềm năng của bạn.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {[
                                "Giao diện tối ưu cho trải nghiệm học tập.",
                                "Đồng bộ hóa dữ liệu trên mọi thiết bị.",
                                "Cộng đồng học tập năng động và hỗ trợ."
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-3 text-gray-300 group">
                                    <CheckCircleFilled className="text-emerald-500 text-xl group-hover:text-emerald-400 transition-colors" />
                                    <span className="group-hover:text-white transition-colors">{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 sm:p-10 w-full max-w-md mx-auto md:mr-0">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div className="text-center md:text-left">
                                <Typography.Title level={3} className="!m-0 !text-white !font-bold">
                                    Đăng nhập
                                </Typography.Title>
                                <p className="text-gray-400 mt-2">Nhập thông tin xác thực để truy cập.</p>
                            </div>

                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Email</label>
                                    <Input
                                        placeholder="name@example.com"
                                        prefix={<UserOutlined className="text-gray-400 px-1" />}
                                        value={email}
                                        disabled={submitting}
                                        onChange={(e) => setEmail(e.target.value)}
                                        size="large"
                                        className="!bg-white/5 hover:!bg-white/10 focus:!bg-white/10 !border-white/10 !text-white placeholder:!text-gray-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-medium text-gray-300">Mật khẩu</label>
                                    </div>
                                    <Input.Password
                                        placeholder="••••••••"
                                        prefix={<LockOutlined className="text-gray-400 px-1" />}
                                        value={password}
                                        disabled={submitting}
                                        onChange={(e) => setPassword(e.target.value)}
                                        size="large"
                                        className="!bg-white/5 hover:!bg-white/10 focus:!bg-white/10 !border-white/10 !text-white placeholder:!text-gray-500"
                                        iconRender={(visible) => (visible ? <EyeTwoTone twoToneColor={THEME_COLOR} /> : <EyeInvisibleOutlined className="text-gray-400" />)}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <Checkbox 
                                        checked={remember} 
                                        onChange={(e) => setRemember(e.target.checked)}
                                        className="text-gray-400 hover:text-emerald-400"
                                    >
                                        Ghi nhớ tôi
                                    </Checkbox>
                                    <Link to="/forgot-password" className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
                                        Quên mật khẩu?
                                    </Link>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {inputError && (
                                    <Alert
                                        message={inputError}
                                        type="warning"
                                        showIcon
                                        closable
                                        onClose={() => setInputError("")}
                                        className="!bg-yellow-500/10 !border-yellow-500/20 !text-yellow-200"
                                    />
                                )}
                                {loginError && (
                                    <Alert
                                        message="Đăng nhập thất bại"
                                        description="Email hoặc mật khẩu không chính xác."
                                        type="error"
                                        showIcon
                                        className="!bg-red-500/10 !border-red-500/20 !text-red-200"
                                    />
                                )}
                            </div>

                            <Button
                                htmlType="submit"
                                type="primary"
                                loading={submitting}
                                size="large"
                                className="w-full h-12 text-base font-semibold tracking-wide border-0 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-lg shadow-emerald-900/20"
                            >
                                Đăng nhập
                            </Button>

                            <div className="text-center mt-2">
                                <span className="text-gray-400 text-sm">
                                    Chưa có tài khoản?{" "}
                                    <Link to="/signup" className="text-emerald-400 font-medium hover:text-emerald-300 hover:underline transition-all">
                                        Tạo tài khoản mới
                                    </Link>
                                </span>
                            </div>
                        </form>
                    </section>
                </div>
            </main>
        </ConfigProvider>
    );
}

export default SignInPage;