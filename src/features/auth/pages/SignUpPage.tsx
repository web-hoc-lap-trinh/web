import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as React from "react";
import { Button, Input, Typography, Alert, ConfigProvider, theme, message } from "antd";
import { 
    UserOutlined, 
    MailOutlined, 
    LockOutlined, 
    RocketTwoTone, 
    CheckCircleFilled, 
    EyeTwoTone, 
    EyeInvisibleOutlined 
} from "@ant-design/icons";
import { useRegisterMutation } from "../../../services/auth/auth.service";

const THEME_COLOR = "#34D399"; 
const BG_INPUT = "rgba(255, 255, 255, 0.05)";

function SignUpPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [registerMutation, registerState] = useRegisterMutation();

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        
        if (!fullName || !email || !password) {
            message.warning("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        try {
            await registerMutation({ full_name: fullName, email, password }).unwrap();
            message.success("Đăng ký thành công! Vui lòng kiểm tra email.");
            navigate("/input-otp", { state: { from: "signup", email } });
        } catch (err) {
        }
    };

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
                    }
                }
            }}
        >
            <main className="min-h-screen w-full bg-[#051311] relative overflow-hidden flex items-center justify-center px-4 py-10">
                <div className="absolute top-[-10%] right-[20%] w-[400px] h-[400px] bg-emerald-600/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[10%] w-[300px] h-[300px] bg-teal-900/30 rounded-full blur-[100px]" />

                <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
                    
                    <section className="hidden md:flex flex-col justify-center space-y-8 pr-4">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-white/5 rounded-lg border border-white/10 backdrop-blur-md">
                                    <RocketTwoTone twoToneColor={THEME_COLOR} style={{ fontSize: '24px' }} />
                                </div>
                                <span className="text-emerald-400 font-semibold tracking-wider uppercase text-sm">
                                    Bắt đầu ngay hôm nay
                                </span>
                            </div>

                            <Typography.Title level={1} className="!m-0 !text-white !font-bold !text-4xl lg:!text-5xl leading-tight">
                                Tạo tài khoản <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                                    mở khóa tương lai
                                </span>
                            </Typography.Title>
                            <p className="text-gray-400 text-lg max-w-md leading-relaxed">
                                Tham gia cộng đồng hàng ngàn học viên. Nâng cao kỹ năng và phát triển sự nghiệp của bạn ngay bây giờ.
                            </p>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-white/10">
                            {[
                                "Truy cập không giới hạn kho tài liệu.",
                                "Lộ trình học tập được cá nhân hóa.",
                                "Nhận chứng chỉ hoàn thành khóa học.",
                                "Hỗ trợ 24/7 từ chuyên gia."
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-3 text-gray-300 group">
                                    <CheckCircleFilled className="text-emerald-500 text-lg group-hover:text-emerald-400 transition-colors" />
                                    <span className="group-hover:text-white transition-colors text-base">{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 sm:p-10 w-full max-w-md mx-auto md:mr-0">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div className="text-center md:text-left">
                                <Typography.Title level={3} className="!m-0 !text-white !font-bold">
                                    Đăng ký thành viên
                                </Typography.Title>
                                <p className="text-gray-400 mt-2">Hoàn toàn miễn phí và chỉ mất 1 phút.</p>
                            </div>

                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Họ và tên</label>
                                    <Input
                                        placeholder="Nguyễn Văn A"
                                        prefix={<UserOutlined className="text-gray-400 px-1" />}
                                        value={fullName}
                                        disabled={registerState.isLoading}
                                        onChange={(e) => setFullName(e.target.value)}
                                        size="large"
                                        className="!bg-white/5 hover:!bg-white/10 focus:!bg-white/10 !border-white/10 !text-white"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Địa chỉ Email</label>
                                    <Input
                                        placeholder="name@example.com"
                                        type="email"
                                        prefix={<MailOutlined className="text-gray-400 px-1" />}
                                        value={email}
                                        disabled={registerState.isLoading}
                                        onChange={(e) => setEmail(e.target.value)}
                                        size="large"
                                        className="!bg-white/5 hover:!bg-white/10 focus:!bg-white/10 !border-white/10 !text-white"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Mật khẩu</label>
                                    <Input.Password
                                        placeholder="Tối thiểu 6 ký tự"
                                        prefix={<LockOutlined className="text-gray-400 px-1" />}
                                        value={password}
                                        disabled={registerState.isLoading}
                                        onChange={(e) => setPassword(e.target.value)}
                                        size="large"
                                        className="!bg-white/5 hover:!bg-white/10 focus:!bg-white/10 !border-white/10 !text-white"
                                        iconRender={(visible) => (visible ? <EyeTwoTone twoToneColor={THEME_COLOR} /> : <EyeInvisibleOutlined className="text-gray-400" />)}
                                    />
                                </div>
                            </div>

                            {registerState.error && (
                                <Alert
                                    type="error"
                                    message="Đăng ký thất bại"
                                    description="Email có thể đã tồn tại hoặc hệ thống đang gặp sự cố."
                                    showIcon
                                    className="!bg-red-500/10 !border-red-500/20 !text-red-200"
                                />
                            )}

                            <Button
                                htmlType="submit"
                                type="primary"
                                loading={registerState.isLoading}
                                size="large"
                                className="w-full h-12 text-base font-semibold tracking-wide border-0 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-lg shadow-emerald-900/20 mt-2"
                            >
                                Đăng ký ngay
                            </Button>

                            <div className="text-center mt-2 border-t border-white/10 pt-6">
                                <span className="text-gray-400 text-sm">
                                    Bạn đã có tài khoản?{" "}
                                    <Link to="/signin" className="text-emerald-400 font-medium hover:text-emerald-300 hover:underline transition-all">
                                        Đăng nhập tại đây
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

export default SignUpPage;