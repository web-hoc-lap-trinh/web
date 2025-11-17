import {useState} from "react";
import {useNavigate} from "react-router-dom";

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const onForgotPassword = () => {
        if (email === "") {
            alert("Vui lòng nhập đúng email");
            return;
        }
        navigate("/input-otp", { state: { from: 'forgot' } });
    }

    return(
        <main className="min-h-screen flex items-center justify-center">
            <div className="w-96 p-8 bg-secondary-700 rounded-xl flex flex-col space-y-4">
                <h1 className="text-xl text-primary-200 text-center font-bold mb-4">
                    Quên mật khẩu
                </h1>

                <input
                    className="w-full px-4 py-3 bg-primary-400 rounded-lg text-white placeholder-gray-300 focus:outline-none"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <button
                    className="w-full py-2 bg-primary-200 rounded-lg text-secondary-700 font-semibold hover:bg-primary-100 transition"
                    type="submit"
                    onClick={onForgotPassword}
                >
                    Gửi OTP
                </button>
            </div>
        </main>
    )
}

const ForgotPasswordPage = () => {
    return(
        <main>
            <ForgotPasswordForm />
        </main>
    )
}

export default ForgotPasswordPage;