import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";

function CompSignUp() {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const onSignUp = () => {
        alert("Đăng ký thành công")
        navigate("/login");
    }

    return (
        <main className="min-h-screen flex items-center justify-end mr-50">
            <div className="w-96 p-8 bg-secondary-700 rounded-xl shadow-2xl flex flex-col space-y-4">
                <h1 className="text-xl text-primary-200 text-center font-bold mb-4">
                    Đăng ký tài khoản mới
                </h1>

                <input
                    className="w-full px-4 py-3 bg-primary-400 rounded-lg text-white placeholder-gray-300 focus:outline-none"
                    placeholder="Tên tài khoản"
                    onChange={(e) => setUserName(e.target.value)}
                />

                <input
                    className="w-full px-4 py-3 bg-primary-400 rounded-lg text-white placeholder-gray-300 focus:outline-none"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    className="w-full px-4 py-3 bg-primary-400 rounded-lg text-white placeholder-gray-300 focus:outline-none"
                    placeholder="Mật khẩu"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    className="w-full py-2 bg-primary-200 rounded-lg text-secondary-700 font-semibold hover:bg-primary-100 transition"
                    type="submit"
                    onClick={onSignUp}
                >
                    Đăng ký
                </button>

                <Link to="signin" className="w-full">
                    <span className="text-sm text-primary-200 hover:text-primary-100 hover:underline transition">
                        Đã có tài khoản? Đăng nhập
                    </span>
                </Link>
            </div>
        </main>
    );
}

export default CompSignUp;