import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, Typography, Alert } from "antd";
import { useForgotPasswordMutation } from "../../../services/auth/auth.service";

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const [forgotMutation, forgotState] = useForgotPasswordMutation();

    const onForgotPassword = async () => {
        if (!email) {
            alert("Vui lòng nhập đúng email");
            return;
        }
        try {
            await forgotMutation({ email }).unwrap();
            navigate("/input-otp", { state: { from: "forgot", email } });
        } catch (e) {
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center">
            <div className="w-96 p-8 bg-secondary-700 rounded-xl flex flex-col space-y-4">
                <Typography.Title level={4} className="!text-primary-200 !m-0 text-center">
                    Quên mật khẩu
                </Typography.Title>

                <Input
                    placeholder="Email"
                    value={email}
                    disabled={forgotState.isLoading}
                    onChange={(e) => setEmail(e.target.value)}
                />

                {forgotState.error && (
                    <Alert type="error" message="Gửi OTP thất bại" showIcon />
                )}

                <Button
                    className="w-full"
                    type="primary"
                    loading={forgotState.isLoading}
                    onClick={onForgotPassword}
                >
                    Gửi OTP
                </Button>
            </div>
        </main>
    );
};

const ForgotPasswordPage = () => {
    return(
        <main>
            <ForgotPasswordForm />
        </main>
    )
}

export default ForgotPasswordPage;