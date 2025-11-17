import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input, Button, Typography, Alert } from "antd";
import { useResetPasswordMutation } from "../../../services/auth/auth.service";

const ResetPasswordForm = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email as string | undefined;
    const otp = location.state?.otp as string | undefined;
    const [resetMutation, resetState] = useResetPasswordMutation();

    const onResetPassword = async () => {
        if (!email || !otp) {
            alert("Thiếu email hoặc OTP. Vui lòng thực hiện lại bước xác thực.");
            navigate("/forgot-password", { replace: true });
            return;
        }
        if (newPassword !== confirmPassword) {
            setConfirmPassword("");
            alert("Mật khẩu xác nhận không trùng khớp");
            return;
        }
        try {
            await resetMutation({ email, otp, newPassword }).unwrap();
            navigate("/signin");
        } catch (e) {}
    };

    return (
        <main className="min-h-screen flex items-center justify-center">
            <div className="w-96 p-8 bg-secondary-700 rounded-xl flex flex-col space-y-4">
                <Typography.Title level={4} className="!text-primary-200 !m-0 text-center">
                    Đặt lại mật khẩu
                </Typography.Title>

                <Input.Password
                    placeholder="Mật khẩu mới"
                    value={newPassword}
                    disabled={resetState.isLoading}
                    onChange={(event) => setNewPassword(event.target.value)}
                />

                <Input.Password
                    placeholder="Xác nhận mật khẩu mới"
                    value={confirmPassword}
                    disabled={resetState.isLoading}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                />

                {resetState.error && (
                    <Alert type="error" message="Đặt lại mật khẩu thất bại" showIcon />
                )}

                <Button
                    className="w-full"
                    type="primary"
                    loading={resetState.isLoading}
                    onClick={onResetPassword}
                >
                    Đặt lại
                </Button>
            </div>
        </main>
    );
};

const ResetPasswordPage = () => {
    return(
        <main>
            <ResetPasswordForm />
        </main>
    )
}

export default ResetPasswordPage;