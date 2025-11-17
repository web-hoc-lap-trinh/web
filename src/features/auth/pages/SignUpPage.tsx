import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, Typography, Alert } from "antd";
import { useRegisterMutation } from "../../../services/auth/auth.service";

function SignUpForm() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [registerMutation, registerState] = useRegisterMutation();

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!fullName || !email || !password) {
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }
        try {
            await registerMutation({ full_name: fullName, email, password }).unwrap();
            navigate("/input-otp", { state: { from: "signup", email } });
        } catch (err) {
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="w-96 p-8 bg-secondary-700 rounded-xl shadow-2xl flex flex-col space-y-4"
            >
                <Typography.Title level={4} className="!text-primary-200 !m-0 text-center">
                    Đăng ký tài khoản mới
                </Typography.Title>
                <Input
                    placeholder="Tên tài khoản"
                    value={fullName}
                    disabled={registerState.isLoading}
                    onChange={(e) => setFullName(e.target.value)}
                />
                <Input
                    placeholder="Email"
                    type="email"
                    value={email}
                    disabled={registerState.isLoading}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input.Password
                    placeholder="Mật khẩu"
                    value={password}
                    disabled={registerState.isLoading}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {registerState.error && (
                    <Alert
                        type="error"
                        message="Đăng ký thất bại"
                        description="Email có thể đã tồn tại hoặc dữ liệu không hợp lệ."
                        showIcon
                    />
                )}
                <Button
                    htmlType="submit"
                    type="primary"
                    loading={registerState.isLoading}
                    className="w-full"
                >
                    Đăng ký
                </Button>
                <div className="w-full text-center">
                    <Link to="/signin" className="text-sm text-primary-200 hover:text-primary-100 hover:underline">
                        Đã có tài khoản? Đăng nhập
                    </Link>
                </div>
            </form>
        </main>
    );
}

function SignUpPage() {
    return (
        <main>
            <SignUpForm />
        </main>
    );
}

export default SignUpPage;