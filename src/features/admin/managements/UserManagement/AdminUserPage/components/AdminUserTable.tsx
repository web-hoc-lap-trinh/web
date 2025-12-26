import type {IUser} from "../../../../../../types/user.types.ts";
import {Skeleton} from "antd";
import {
    AppstoreOutlined,
    DeleteOutlined,
    DownOutlined,
    EditOutlined,
    SearchOutlined,
    SortAscendingOutlined
} from "@ant-design/icons";
import {useMemo, useState} from "react";

interface AdminUserTableProps {
    onEdit: (user: IUser) => void;
    users: IUser[];
    loading: boolean;
}

const AdminUserTable = ({onEdit, users, loading} : AdminUserTableProps) => {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredUsers = useMemo(() => {
        if(!users) return [];
        return users.filter(res => {
            const searchLower = searchQuery.toLowerCase();
            return res.full_name.toLowerCase().includes(searchLower);
        })
    }, [users, searchQuery]);

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
        <div className="relative space-y-4">
            <div className="flex justify-between items-center bg-[#1a202c]/40 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-900/10">
                        <AppstoreOutlined size={20} className="text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white tracking-tight">Quản lý người dùng</h3>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-2/3 md:w-auto">
                    {/* Neat Search */}
                    <div className="relative group flex-1 md:w-72">
                        <SearchOutlined size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Tìm tên người dùng..."
                            className="w-full pl-11 pr-4 py-2.5 bg-[#0f131a]/60 text-gray-200 rounded-2xl border border-white/10 outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all text-sm shadow-inner"
                        />
                    </div>
                    <button className="p-2.5 text-gray-400 hover:text-white bg-white/5 rounded-xl border border-white/10 transition-all">
                        <DownOutlined size={18} />
                    </button>
                </div>
            </div>

            <div className="bg-[#1a202c]/60 backdrop-blur-xl rounded-[32px] border border-white/5 shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-400 uppercase bg-black/20">
                        <tr>
                            <th className="px-6 py-5 font-semibold">Người dùng</th>
                            <th className="px-6 py-5 font-semibold">User ID</th>
                            {/*<th className="px-6 py-5 font-semibold text-center">Vai trò</th>*/}
                            <th className="px-6 py-5 font-semibold text-center">Trạng thái</th>
                            <th className="px-6 py-5 font-semibold text-center">Hoạt động cuối</th>
                            <th className="px-6 py-5 font-semibold text-center">Ngày tạo</th>
                            <th className="px-6 py-5 font-semibold text-right">Tác vụ</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                        {filteredUsers.map((user) => (
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
                                {/*<td className="px-6 py-5 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </span>
                                </td>*/}
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
            </div>
        </div>
    );
}

export default AdminUserTable