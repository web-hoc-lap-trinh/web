import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input, Button, Typography, Alert, ConfigProvider, theme, message } from "antd";
import { LockOutlined, EyeTwoTone, EyeInvisibleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useResetPasswordMutation } from "../../../services/auth/auth.service";

const THEME_COLOR = "#34D399";
const BG_INPUT = "rgba(255, 255, 255, 0.05)";

const ResetPasswordPage = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email as string | undefined;
    const otp = location.state?.otp as string | undefined;
    const [resetMutation, resetState] = useResetPasswordMutation();

    const onResetPassword = async () => {
        if (!email || !otp) {
            message.error("Thiếu thông tin xác thực.");
            navigate("/forgot-password", { replace: true });
            return;
        }
        if (newPassword !== confirmPassword) {
            setConfirmPassword("");
            message.warning("Mật khẩu xác nhận không trùng khớp!");
            return;
        }
        try {
            await resetMutation({ email, otp, newPassword }).unwrap();
            message.success("Đặt lại mật khẩu thành công! Hãy đăng nhập.");
            navigate("/signin");
        } catch (e) {}
    };

    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
                token: { colorPrimary: THEME_COLOR, colorBgContainer: BG_INPUT, colorBorder: "transparent" },
                components: { Input: { activeBorderColor: THEME_COLOR, hoverBorderColor: THEME_COLOR } }
            }}
        >
            <main className="min-h-screen w-full bg-[#051311] flex items-center justify-center px-4 relative overflow-hidden pt-20">
                <div className="absolute top-[10%] right-[10%] w-[300px] h-[300px] bg-emerald-700/20 rounded-full blur-[80px]" />

                <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 sm:p-10 relative z-10">
                    <div className="text-center space-y-2 mb-8">
                                <Typography.Title level={3} className="m-0! text-white! font-bold!">
                            Đặt lại mật khẩu
                        </Typography.Title>
                        <p className="text-gray-400 text-sm">Hãy nhập mật khẩu mới cho tài khoản của bạn.</p>
                    </div>

                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Mật khẩu mới</label>
                            <Input.Password
                                placeholder="••••••••"
                                value={newPassword}
                                prefix={<LockOutlined className="text-gray-500 px-1"/>}
                                disabled={resetState.isLoading}
                                onChange={(e) => setNewPassword(e.target.value)}
                                size="large"
                                className="bg-white/5! border-white/10! text-white!"
                                iconRender={(visible) => (visible ? <EyeTwoTone twoToneColor={THEME_COLOR} /> : <EyeInvisibleOutlined className="text-gray-500" />)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Xác nhận mật khẩu</label>
                            <Input.Password
                                placeholder="••••••••"
                                value={confirmPassword}
                                prefix={<CheckCircleOutlined className="text-gray-500 px-1"/>}
                                disabled={resetState.isLoading}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                size="large"
                                className="bg-white/5! border-white/10! text-white!"
                                iconRender={(visible) => (visible ? <EyeTwoTone twoToneColor={THEME_COLOR} /> : <EyeInvisibleOutlined className="text-gray-500" />)}
                            />
                        </div>

                        {resetState.error && (
                            <Alert 
                                type="error" 
                                message="Lỗi hệ thống" 
                                description="Không thể đặt lại mật khẩu. Vui lòng thử lại sau."
                                showIcon 
                                className="bg-red-500/10! border-red-500/20! text-red-200!"
                            />
                        )}

                        <Button
                            className="w-full h-12 font-semibold bg-linear-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 border-0 shadow-lg mt-2"
                            type="primary"
                            loading={resetState.isLoading}
                            onClick={onResetPassword}
                        >
                            Xác nhận thay đổi
                        </Button>
                    </div>
                </div>
            </main>
        </ConfigProvider>
    );
};

export default ResetPasswordPage;