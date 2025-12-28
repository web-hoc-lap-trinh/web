import {useGetAdminUsersQuery} from "../../../../../services/admin/admin.service.ts";
import HeaderBar from "../../../../../components/common/HeaderBar.tsx";
import {useState} from "react";
import type {IUser} from "../../../../../types/user.types.ts";
import AdminUserTable from "./components/AdminUserTable.tsx";

const AdminUserPage = () => {
    const {data: users = [], isLoading} = useGetAdminUsersQuery();
    const [, setIsAdminUserEditOpen] = useState(false);
    const [, setSelectedUserId] = useState<string | null>(null);

    const handleEditAdminUser = (user: IUser) => {
        setSelectedUserId(String(user.user_id))
        setIsAdminUserEditOpen(true);
    }

    return (
        <div className="flex-1 overflow-auto px-10 pb-10 z-10">
            <HeaderBar title={"Quản lý người dùng"} buttonText={""} setOpen={() => {}}/>
            <AdminUserTable onEdit={handleEditAdminUser} users={users} loading={isLoading} />
        </div>
    )
}

export default AdminUserPage;