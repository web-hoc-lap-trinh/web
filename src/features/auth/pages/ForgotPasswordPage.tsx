import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input, Button, Typography, Alert, ConfigProvider, theme } from "antd";
import { MailOutlined, ArrowLeftOutlined, KeyOutlined } from "@ant-design/icons";
import { useForgotPasswordMutation } from "../../../services/auth/auth.service";

const THEME_COLOR = "#34D399"; 
const BG_INPUT = "rgba(255, 255, 255, 0.05)";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const [forgotMutation, forgotState] = useForgotPasswordMutation();

    const onForgotPassword = async () => {
        if (!email) {
            return;
        }
        try {
            await forgotMutation({ email }).unwrap();
            navigate("/input-otp", { state: { from: "forgot", email } });
        } catch (e) {
        }
    };

    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
                token: { colorPrimary: THEME_COLOR, colorBgContainer: BG_INPUT, colorBorder: "transparent" },
                components: {
                    Input: { activeBorderColor: THEME_COLOR, hoverBorderColor: THEME_COLOR },
                }
            }}
        >
            <main className="min-h-screen w-full bg-[#051311] flex items-center justify-center px-4 relative overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[120px]" />
                
                <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 sm:p-10 relative z-10">
                    <div className="flex flex-col items-center text-center space-y-4 mb-8">
                        <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
                            <KeyOutlined className="text-3xl text-white" />
                        </div>
                        <div>
                            <Typography.Title level={3} className="!m-0 !text-white !font-bold">
                                Quên mật khẩu?
                            </Typography.Title>
                            <p className="text-gray-400 mt-2 text-sm">
                                Đừng lo, hãy nhập email của bạn. Chúng tôi sẽ gửi mã OTP để đặt lại mật khẩu.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                             <Input
                                placeholder="Nhập địa chỉ email của bạn"
                                prefix={<MailOutlined className="text-gray-400 px-2" />}
                                value={email}
                                disabled={forgotState.isLoading}
                                onChange={(e) => setEmail(e.target.value)}
                                size="large"
                                className="!bg-white/5 !border-white/10 !text-white h-12"
                            />
                        </div>

                        {forgotState.error && (
                            <Alert 
                                type="error" 
                                message="Gửi OTP thất bại" 
                                description="Vui lòng kiểm tra lại email."
                                showIcon 
                                className="!bg-red-500/10 !border-red-500/20 !text-red-200"
                            />
                        )}

                        <Button
                            className="w-full h-12 text-base font-semibold border-0 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-lg"
                            type="primary"
                            loading={forgotState.isLoading}
                            onClick={onForgotPassword}
                        >
                            Gửi mã xác thực
                        </Button>

                        <div className="text-center pt-2">
                            <Link to="/signin" className="inline-flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition-colors text-sm font-medium">
                                <ArrowLeftOutlined /> Quay lại đăng nhập
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </ConfigProvider>
    );
};

export default ForgotPasswordPage;