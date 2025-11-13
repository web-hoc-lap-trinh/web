import {useState} from "react";
import {useNavigate} from "react-router-dom";

const CompResetPwd = () => {
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const navigate = useNavigate()

    const onResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            setConfirmPassword("")
            alert("Mật khẩu xác nhận không trùng khớp")
            return;
        }
        alert("Đặt lại mật khẩu thành công")
        navigate("/signin")
    }

    return(
        <main className="min-h-screen flex items-center justify-center">
            <div className="w-96 p-8 bg-secondary-700 rounded-xl flex flex-col space-y-4">
                <h1 className="text-xl text-primary-200 text-center font-bold mb-4">
                    Đặt lại mật khẩu
                </h1>

                <input
                    className="w-full px-4 py-3 bg-primary-400 rounded-lg text-white placeholder-gray-300 focus:outline-none"
                    placeholder="Mật khẩu mới"
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                />

                <input
                    className="w-full px-4 py-3 bg-primary-400 rounded-lg text-white placeholder-gray-300 focus:outline-none"
                    placeholder="Xác nhận mật khẩu mới"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                />

                <button
                    className="w-full py-2 bg-primary-200 rounded-lg text-secondary-700 font-semibold hover:bg-primary-100 transition"
                    type="submit"
                    onClick={onResetPassword}
                >
                    Đặt lại
                </button>
            </div>
        </main>
    )
}

export default CompResetPwd;