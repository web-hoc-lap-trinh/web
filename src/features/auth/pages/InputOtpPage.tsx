import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Input, Button, Typography, Alert, ConfigProvider, theme } from "antd";
import { SafetyCertificateOutlined, NumberOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useVerifyAccountMutation } from "../../../services/auth/auth.service";

const THEME_COLOR = "#34D399";
const BG_INPUT = "rgba(255, 255, 255, 0.05)";

const InputOtpPage = () => {
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const fromPath = location.state?.from as ('signup'|'forgot'|undefined);
    const email = location.state?.email as string | undefined;
    const [verifyMutation, verifyState] = useVerifyAccountMutation();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        const filtered = raw.replace(/\D/g, "").slice(0, 4);
        setOtp(filtered);
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!email) {
            navigate("/signup", { replace: true });
            return;
        }
        if (otp.length !== 4) return;

        try {
            if (fromPath === 'signup') {
                const data = await verifyMutation({ email, otp }).unwrap();
                const role = data.user.role || "user";
                navigate(`/${role}`);
            } else if (fromPath === 'forgot') {
                navigate('/reset-password', { state: { email, otp } });
            } else {
                navigate('/signin');
            }
        } catch (err) {}
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
                <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-teal-800/20 rounded-full blur-[100px]" />

                <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 sm:p-10 relative z-10">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="text-center space-y-4">
                            <div className="inline-block p-3 bg-emerald-500/10 rounded-full">
                                <SafetyCertificateOutlined className="text-4xl text-emerald-400" />
                            </div>
                            <div>
                                <Typography.Title level={3} className="m-0! text-white! font-bold!">
                                    Xác thực OTP
                                </Typography.Title>
                                {email && (
                                    <p className="text-gray-400 mt-2 text-sm">
                                        Mã xác thực 4 số đã được gửi tới <br/> 
                                        <span className="text-emerald-300 font-semibold">{email}</span>
                                    </p>
                                )}
                            </div>
                        </div>

                        {!email ? (
                            <Alert
                                type="error"
                                message="Lỗi phiên làm việc"
                                description={<span>Không tìm thấy email. Vui lòng <Link to="/signup" className="text-emerald-400! underline!">thử lại</Link>.</span>}
                                className="bg-red-500/10! border-red-500/20! text-red-200!"
                            />
                        ) : (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Input
                                        placeholder="0000"
                                        value={otp}
                                        maxLength={4}
                                        inputMode="numeric"
                                        prefix={<NumberOutlined className="text-gray-500 px-2"/>}
                                        disabled={verifyState.isLoading}
                                        onChange={handleChange}
                                        size="large"
                                        className="bg-white/5! border-white/10! text-white! text-center! text-2xl! tracking-[0.5em]! font-bold! h-14"
                                    />
                                </div>

                                {verifyState.error && (
                                    <Alert
                                        type="error"
                                        message="Mã OTP không đúng"
                                        showIcon
                                        className="bg-red-500/10! border-red-500/20! text-red-200!"
                                    />
                                )}

                                <Button
                                    htmlType="submit"
                                    type="primary"
                                    loading={verifyState.isLoading}
                                    disabled={otp.length !== 4}
                                    className="w-full h-12 font-semibold bg-linear-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 shadow-lg border-0"
                                >
                                    Xác nhận
                                </Button>
                            </div>
                        )}
                        
                        <div className="text-center">
                            <Link to="/signin" className="inline-flex items-center gap-2 text-sm text-gray-500! hover:text-gray-300! transition-colors">
                                <ArrowLeftOutlined /> Hủy bỏ
                            </Link>
                        </div>
                    </form>
                </div>
            </main>
        </ConfigProvider>
    );
};

export default InputOtpPage;