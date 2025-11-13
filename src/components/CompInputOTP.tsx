import {useNavigate} from "react-router-dom";
import {useState} from "react";

const CompInputOTP = () => {
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();

    const onInputOTP = () => {
        if (otp === "") {
            alert("Vui lòng nhập mã OTP")
            return;
        }
        navigate("/reset-password");
    }

    return(
        <main className="min-h-screen flex items-center justify-center">
            <div className="w-96 p-8 bg-secondary-700 rounded-xl flex flex-col space-y-4">
                <h1 className="text-xl text-primary-200 text-center font-bold mb-4">
                    Nhập OTP
                </h1>

                <input
                    className="w-full px-4 py-3 bg-primary-400 rounded-lg text-white placeholder-gray-300 focus:outline-none"
                    placeholder="Mã OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />

                <button
                    className="w-full py-2 bg-primary-200 rounded-lg text-secondary-700 font-semibold hover:bg-primary-100 transition"
                    type="submit"
                    onClick={onInputOTP}
                >
                    Xác nhận
                </button>
            </div>
        </main>
    )
}

export default CompInputOTP;