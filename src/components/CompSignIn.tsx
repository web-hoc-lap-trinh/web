import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import {useCurrentApp} from "./context/app.context.tsx";
import {loginAPI} from "../services/api.ts";
import * as React from "react";

function CompSignIn() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setIsAuthenticated, setUser } = useCurrentApp();

    const onLogin = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            // Giả lập role dựa vào username
            let role: "admin" | "user" = "user";
            if (username === "admin") role = "admin";
            const user = await loginAPI(role, username);
            setUser(user);
            setIsAuthenticated(true);
            navigate(`/${user.role}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center">
            <div className="w-96 p-8 bg-secondary-700 rounded-xl shadow-2xl flex flex-col space-y-4">
                <h1 className="text-xl text-primary-200 text-center font-bold mb-4">
                    Đăng nhập bằng tài khoản
                </h1>

                <input
                    className="w-full px-4 py-3 bg-primary-400 rounded-lg text-white placeholder-gray-300 focus:outline-none"
                    placeholder="Tài khoản"
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    className="w-full px-4 py-3 bg-primary-400 rounded-lg text-white placeholder-gray-300 focus:outline-none"
                    placeholder="Mật khẩu"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Link to="/forgot-password" className="w-full text-right">
                    <span className="text-sm text-primary-200 hover:text-primary-100 hover:underline transition">
                        Quên mật khẩu?
                    </span>
                </Link>

                <button
                    className="w-full py-2 bg-primary-200 rounded-lg text-secondary-700 font-semibold hover:bg-primary-100 transition"
                    type="submit"
                    onClick={onLogin}
                >
                    Đăng nhập
                </button>

                <Link to="/signup" className="w-full">
                    <span className="text-sm text-primary-200 hover:text-primary-100 hover:underline transition">
                        Chưa có tài khoản? Đăng ký
                    </span>
                </Link>
            </div>
        </main>
    );
}

export default CompSignIn;