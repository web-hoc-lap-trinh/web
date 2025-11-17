import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Input, Button, Typography, Alert } from "antd";
import { useVerifyAccountMutation } from "../../../services/auth/auth.service";

const InputOtpForm = () => {
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
            alert("Thiếu email. Vui lòng đăng ký lại.");
            navigate("/signup", { replace: true });
            return;
        }
        if (otp.length !== 4) {
            alert("OTP phải gồm 4 chữ số");
            return;
        }
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
        <main className="min-h-screen flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="w-96 p-8 bg-secondary-700 rounded-xl flex flex-col space-y-4"
            >
                <Typography.Title level={4} className="!text-primary-200 !m-0 text-center">
                    Nhập OTP
                </Typography.Title>
                {!email && (
                    <Alert
                        type="error"
                        message="Không có email trong phiên"
                        description={<span>Vui lòng <Link to="/signup">đăng ký lại</Link>.</span>}
                        showIcon
                    />
                )}
                <Input
                    placeholder="Mã OTP 4 số"
                        value={otp}
                        maxLength={4}
                        inputMode="numeric"
                        disabled={verifyState.isLoading || !email}
                        onChange={handleChange}
                />
                {verifyState.error && (
                    <Alert
                        type="error"
                        message="Xác thực thất bại"
                        description="OTP không đúng hoặc đã hết hạn."
                        showIcon
                    />
                )}
                <Button
                    htmlType="submit"
                    type="primary"
                    loading={verifyState.isLoading}
                    disabled={!email}
                    className="w-full"
                >
                    Xác nhận
                </Button>
                <div className="text-center">
                    <Link to="/signup" className="text-sm text-primary-200 hover:underline">
                        Đăng ký lại
                    </Link>
                </div>
            </form>
        </main>
    );
};

const InputOtpPage = () => {
    return (
        <main>
            <InputOtpForm />
        </main>
    );
};

export default InputOtpPage;