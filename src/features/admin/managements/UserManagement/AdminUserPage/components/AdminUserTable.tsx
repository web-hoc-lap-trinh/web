import type {IUser} from "../../../../../../types/user.types.ts";
import {Input, message, Modal, Select} from "antd";
import {
    CheckOutlined, ClockCircleOutlined,
    DeleteOutlined, ExclamationCircleOutlined,
    FireFilled,
    StopOutlined, UnorderedListOutlined, UserOutlined,
} from "@ant-design/icons";
import {useDeleteUserMutation, useUpdateUserStatusMutation} from "../../../../../../services/admin/admin.service.ts";

interface AdminUserTableProps {
    users: IUser[];
    loading: boolean;
    searchQuery: string;
    onSearchChange: (value: string) => void;
    sort: string;
    onSortChange: (value: string) => void;
}

interface UpdateProps {
    id: number;
    userStatus: string;
}

const AdminUserTable = ({users, loading, searchQuery, onSearchChange, sort, onSortChange} : AdminUserTableProps) => {
    const [updateStatus] = useUpdateUserStatusMutation();
    const [deleteUser, {isLoading: isDeleting}] = useDeleteUserMutation();

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

    const handleUpdate = async ({id, userStatus}: UpdateProps) => {
        try {
            await updateStatus({
                id,
                status: userStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE'
            });
            message.success("Đã thay đổi trạng thái!");
        } catch (error) {
            message.error(`Không thể thay đổi trạng thái. Vui lòng thử lại. [${error}]`);
        }
    };

    const handleDelete = (id: number, name: string) => {
        Modal.confirm({
            title: <span className="text-white">Xác nhận xóa nhãn</span>,
            icon: <ExclamationCircleOutlined className="text-red-500" />,
            content: (
                <div className="text-gray-400">
                    Bạn có chắc chắn muốn xóa nhãn <span className="text-emerald-400 font-bold">{name}</span>?
                    Hành động này không thể hoàn tác.
                </div>
            ),
            okText: 'Xóa ngay',
            okType: 'danger',
            cancelText: 'Hủy',
            centered: true,
            // Custom style để khớp với Dark Theme của bạn
            className: "dark-confirm-modal",
            async onOk() {
                try {
                    await deleteUser(id).unwrap();
                    message.success('Đã xóa nhãn thành công');
                } catch (error) {
                    message.error('Không thể xóa nhãn này');
                    console.log(error)
                }
            },
        });
    };

    return (
        <div className="relative space-y-4">
            <div className="flex justify-between items-center bg-[#1a202c]/40 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-900/10">
                        <UserOutlined size={20} className="text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white tracking-tight">Danh sách người dùng</h3>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-2/3 md:w-auto">
                    {/* Neat Search */}
                    <Input.Search
                        size={"large"}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Tìm tên người dùng..."
                        loading={loading}
                    />
                    <Select
                        size={"large"}
                        defaultValue={sort}
                        style={{ width: 120 }}
                        onChange={(e) => onSortChange(e)}
                        options={[
                            { value: 'newest', label: 'Newest' },
                            { value: 'oldest', label: 'Oldest' },
                        ]}
                    />
                </div>
            </div>

            <div className="bg-[#1a202c]/60 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-400 uppercase bg-black/20">
                        <tr>
                            <th className="px-6 py-5 font-semibold">Người dùng</th>
                            <th className="px-6 py-5 font-semibold">User ID</th>
                            {/*<th className="px-6 py-5 font-semibold text-center">Vai trò</th>*/}
                            <th className="px-6 py-5 font-semibold text-center">Trạng thái</th>
                            <th className="px-6 py-5 font-semibold text-center">Chuỗi</th>
                            <th className="px-6 py-5 font-semibold text-center">Hoạt động cuối</th>
                            <th className="px-6 py-5 font-semibold text-center">Ngày tạo</th>
                            <th className="px-6 py-5 font-semibold text-right">Tác vụ</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                        {users.length > 0 ? (users.map((user) => (
                            <tr key={user.user_id} className="group hover:bg-white/2 transition-colors">
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
                                <td className="px-6 py-5 text-center">
                                    <div className="flex items-center justify-center gap-1.5 text-orange-400 font-bold">
                                        <FireFilled size={14} />
                                        {user.current_streak}
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex flex-col items-center">
                            <span className="text-gray-400 text-xs flex items-center gap-1">
                                <ClockCircleOutlined size={12} />
                                {formatDateTime(user.last_active)}
                            </span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex flex-col items-center">
                            <span className="text-gray-400 text-xs flex items-center gap-1">
                                <ClockCircleOutlined size={12} />
                                {formatDateTime(user.created_at)}
                            </span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleUpdate({ id: user.user_id, userStatus: user.status })}
                                            className="p-2 text-gray-400 hover:text-gray-400 hover:bg-gray-400/10 rounded-lg transition-all transform hover:scale-110"
                                        >
                                            {
                                                user.status === 'ACTIVE' ?
                                                    <StopOutlined size={18} style={{ color: 'red' }} /> :
                                                    <CheckOutlined size={18} style={{ color: 'green' }} />
                                            }
                                        </button>
                                        <button
                                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all transform hover:scale-110"
                                            onClick={() => handleDelete(user.user_id, user.full_name)}
                                            disabled={isDeleting}
                                        >
                                            <DeleteOutlined size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))) :(
                            <tr>
                                <td colSpan={7} className="px-8 py-24 text-center">
                                    <div className="flex flex-col items-center gap-3 opacity-20">
                                        <UnorderedListOutlined size={40} className="text-gray-400" />
                                        <p className="text-sm font-bold text-gray-300">{loading ? "Đang tải dữ liệu" : "Không có dữ liệu"}</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminUserTable