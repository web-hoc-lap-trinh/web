import type {IUser} from "../../../../../../types/user.types.ts";
import {Skeleton} from "antd";
import {DeleteOutlined, EditOutlined, SearchOutlined, SortAscendingOutlined} from "@ant-design/icons";

interface AdminUserTableProps {
    onEdit: (user: IUser) => void;
    users: IUser[];
    loading: boolean;
}

const AdminUserTable = ({onEdit, users, loading} : AdminUserTableProps) => {
    const formatDateTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getRoleBadge = (role: IUser['role']) => {
        switch (role) {
            case 'ADMIN':
                return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'STUDENT':
                return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            default:
                return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, idx) => (
                    <Skeleton
                        key={idx}
                        active
                        className="bg-white/5! rounded-2xl! p-5!"
                        paragraph={{ rows: 3 }}
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="relative">
            <div className="bg-[#1a202c]/60 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl overflow-hidden">

                {/* Header Controls */}
                <div className="p-6 border-b border-white/5 flex sm:flex-row gap-5 justify-between items-center bg-white/5">
                    <div className="relative flex-1 w-full sm:max-w-md group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <SearchOutlined className="text-gray-400 group-focus-within:text-emerald-400 transition-colors" size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên, email hoặc ID..."
                            className="w-full pl-11 pr-4 py-3 bg-[#0f131a]/50 text-gray-200 rounded-xl border border-white/5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-[#0f131a] transition-all placeholder-gray-500 shadow-inner"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                            <SortAscendingOutlined size={16} />
                            <span>Lọc trạng thái</span>
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-400 uppercase bg-black/20">
                        <tr>
                            <th className="px-6 py-5 font-semibold">Người dùng</th>
                            <th className="px-6 py-5 font-semibold">User ID</th>
                            <th className="px-6 py-5 font-semibold text-center">Vai trò</th>
                            <th className="px-6 py-5 font-semibold text-center">Trạng thái</th>
                            <th className="px-6 py-5 font-semibold text-center">Hoạt động cuối</th>
                            <th className="px-6 py-5 font-semibold text-center">Ngày tạo</th>
                            <th className="px-6 py-5 font-semibold text-right">Tác vụ</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                        {users.map((user) => (
                            <tr key={user.user_id} className="group hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-[#0f131a] shadow-lg">
                                            <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-200 group-hover:text-emerald-300 transition-colors">{user.full_name}</span>
                                            <span className="text-[11px] text-gray-500">{user.email}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                    <span className="font-mono text-xs text-gray-400 bg-white/5 px-2 py-1 rounded border border-white/5">
                      {user.user_id}
                    </span>
                                </td>
                                <td className="px-6 py-5 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </span>
                                </td>
                                <td className="px-6 py-5 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        user.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {user.status}
                    </span>
                                </td>
                                <td className="px-6 py-5 text-center text-gray-400 text-xs">
                                    {formatDateTime(user.last_active)}
                                </td>
                                <td className="px-6 py-5 text-center text-gray-400 text-xs">
                                    {formatDateTime(user.created_at)}
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => onEdit(user)}
                                            className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-all transform hover:scale-110"
                                        >
                                            <EditOutlined size={18} />
                                        </button>
                                        <button
                                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all transform hover:scale-110"
                                        >
                                            <DeleteOutlined size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="h-14 bg-black/10 border-t border-white/5 flex items-center justify-center">
                    <span className="text-[11px] text-gray-600 font-bold uppercase tracking-widest">Tổng cộng: {users.length} người dùng</span>
                </div>
            </div>
        </div>
    );
}

export default AdminUserTable