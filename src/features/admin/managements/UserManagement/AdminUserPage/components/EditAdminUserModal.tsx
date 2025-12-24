import type {UserRole} from "../../../../../../types/user.types.ts";

interface EditAdminUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string | null;
}

const EditAdminUserModal = ({isOpen, onClose, userId} : EditAdminUserModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
            <div className="relative w-full max-w-md bg-[#1a202c] rounded-3xl shadow-2xl border border-white/10 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div>
                        <h3 className="text-xl font-bold text-white tracking-wide">Sửa người dùng</h3>
                        <p className="text-xs text-emerald-400 font-mono mt-1 opacity-70 uppercase tracking-wider">{user.id}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
                </div>

                {/* Body */}
                <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh] scrollbar-hide">
                    {/* Avatar Preview & Action */}
                    <div className="flex flex-col items-center gap-4 mb-2">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full border-4 border-emerald-500/20 overflow-hidden bg-[#0f131a] shadow-xl">
                                <img src={user.avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                            </div>
                            <button className="absolute bottom-0 right-0 p-2 bg-emerald-500 text-white rounded-full shadow-lg transform translate-x-1/4 translate-y-1/4 hover:bg-emerald-400 transition-all border-4 border-[#1a202c]">
                                <Camera size={14} />
                            </button>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-gray-400">Ảnh đại diện người dùng</p>
                            <p className="text-[10px] text-gray-600 mt-0.5">Hệ thống đồng bộ tự động</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Fullname Field */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest ml-1">Họ và tên</label>
                            <div className="relative group">
                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                <input
                                    type="text"
                                    value={fullname}
                                    onChange={(e) => setFullname(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-[#0f131a]/50 text-gray-200 rounded-xl border border-white/10 focus:ring-2 focus:ring-emerald-500/50 transition-all outline-none shadow-inner text-sm"
                                />
                            </div>
                        </div>

                        {/* Role Field */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest ml-1">Vai trò hệ thống</label>
                            <div className="relative group">
                                <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value as UserRole)}
                                    className="w-full pl-12 pr-10 py-3.5 bg-[#0f131a]/50 text-gray-200 rounded-xl border border-white/10 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all appearance-none cursor-pointer shadow-inner text-sm"
                                >
                                    <option value="Quản trị viên">Quản trị viên</option>
                                    <option value="Giảng viên">Giảng viên</option>
                                    <option value="Học viên">Học viên</option>
                                </select>
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                    <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-gray-500"></div>
                                </div>
                            </div>
                        </div>

                        {/* Email (Read Only in this UI) */}
                        <div className="space-y-2 opacity-60">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest ml-1">Email (Không thể sửa)</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                                <input
                                    type="email"
                                    disabled
                                    value={user.email}
                                    className="w-full pl-12 pr-4 py-3.5 bg-black/40 text-gray-500 rounded-xl border border-white/5 outline-none cursor-not-allowed text-sm"
                                />
                            </div>
                        </div>

                        {/* Status Field */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest ml-1">Trạng thái tài khoản</label>
                            <div className="relative group">
                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as any)}
                                    className="w-full pl-12 pr-10 py-3.5 bg-[#0f131a]/50 text-gray-200 rounded-xl border border-white/10 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all appearance-none cursor-pointer shadow-inner text-sm"
                                >
                                    <option value="Đang hoạt động">Đang hoạt động</option>
                                    <option value="Bị khóa">Khóa tài khoản</option>
                                </select>
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                    <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-gray-500"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-6 border-t border-white/5 bg-black/20 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:bg-white/5 transition-all"
                    >
                        Đóng
                    </button>
                    <button className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg shadow-emerald-900/40 hover:-translate-y-0.5 transition-all">
                        Lưu thay đổi
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditAdminUserModal