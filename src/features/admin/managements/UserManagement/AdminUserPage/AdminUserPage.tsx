import {useGetAdminUsersQuery} from "../../../../../services/admin/admin.service.ts";
import HeaderBar from "../../../../../components/common/HeaderBar.tsx";
import {useState} from "react";
import AdminUserTable from "./components/AdminUserTable.tsx";
import {useDebounce} from "../../../../../hooks/useDebounce.ts";

const AdminUserPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sort, setSort] = useState("newest");
    const debouncedSearch = useDebounce(searchQuery, 500);

    const {data: users = [], isLoading, isFetching} = useGetAdminUsersQuery({
        search: debouncedSearch || undefined,
        sort: sort
    });

    return (
        <div className="flex-1 overflow-auto px-10 pb-10 z-10">
            <HeaderBar title={"Quản lý người dùng"} buttonText={""} setOpen={() => {}}/>
            <AdminUserTable
                users={users}
                loading={isLoading || isFetching}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sort={sort}
                onSortChange={setSort}
            />
        </div>
    )
}

export default AdminUserPage;