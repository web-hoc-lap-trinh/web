import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import * as React from "react";
import { Input, Button, Typography, Alert } from "antd";

function SignInForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [localSubmitting, setLocalSubmitting] = useState(false);
    const navigate = useNavigate();
    const { login, loginLoading, loginError } = useAuth();

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!email || !password) {
            setEmail("");
            setPassword("");
            alert("Vui lòng nhập thông tin đăng nhập");
            return;
        }
        setLocalSubmitting(true);
        try {
            const res = await login({ email, password });
            const role = res.user.role || "user";
            navigate(`/${role}`);
        } finally {
            setLocalSubmitting(false);
        }
    };

    const submitting = localSubmitting || loginLoading;

    return (
        <main className="min-h-screen flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="w-96 p-8 bg-secondary-700 rounded-xl shadow-2xl flex flex-col space-y-4"
            >
                <Typography.Title level={4} className="!text-primary-200 !m-0 text-center">
                    Đăng nhập bằng tài khoản
                </Typography.Title>
                <Input
                    placeholder="Email"
                    value={email}
                    type="email"
                    disabled={submitting}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input.Password
                    placeholder="Mật khẩu"
                    value={password}
                    disabled={submitting}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className="w-full text-right">
                    <Link to="/forgot-password" className="text-sm text-primary-200 hover:text-primary-100 hover:underline">
                        Quên mật khẩu?
                    </Link>
                </div>
                {loginError && (
                    <Alert
                        type="error"
                        message="Đăng nhập thất bại"
                        description="Vui lòng kiểm tra lại email/mật khẩu hoặc thử lại sau."
                        showIcon
                    />
                )}
                <Button
                    htmlType="submit"
                    type="primary"
                    loading={submitting}
                    className="w-full"
                >
                    Đăng nhập
                </Button>
                <div className="w-full text-center">
                    <Link to="/signup" className="text-sm text-primary-200 hover:text-primary-100 hover:underline">
                        Chưa có tài khoản? Đăng ký
                    </Link>
                </div>
            </form>
        </main>
    );
}

function SignInPage() {
    return (
        <main>
            <SignInForm />
        </main>
    );
}

export default SignInPage