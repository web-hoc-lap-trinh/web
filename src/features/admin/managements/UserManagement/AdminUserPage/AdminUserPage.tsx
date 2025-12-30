import {useGetAdminUsersQuery} from "../../../../../services/admin/admin.service.ts";
import HeaderBar from "../../../../../components/common/HeaderBar.tsx";
import {useEffect, useState} from "react";
import AdminUserTable from "./components/AdminUserTable.tsx";
import {useDebounce} from "../../../../../hooks/useDebounce.ts";

const AdminUserPage = () => {
    const [params, setParams] = useState({ page: 1, limit: 10 });
    const [searchQuery, setSearchQuery] = useState('');
    const [sort, setSort] = useState("newest");
    const debouncedSearch = useDebounce(searchQuery, 500);

    useEffect(() => {
        setParams(prev => ({ ...prev, page: 1 }));
    }, [debouncedSearch]);

    const handlePageChange = (page: number, pageSize: number) => {
        setParams(prev => ({ ...prev, page, limit: pageSize }));
    };

    const {data, isLoading, isFetching} = useGetAdminUsersQuery({
        page: params.page,
        limit: params.limit,
        search: debouncedSearch || undefined,
        sort: sort
    });

    return (
        <div className="flex-1 overflow-auto px-10 pb-10 z-10">
            <HeaderBar title={"Quản lý người dùng"} buttonText={""} setOpen={() => {}}/>
            <AdminUserTable
                users={data?.items || []}
                loading={isLoading || isFetching}
                total={data?.total || 0}
                currentPage={params.page}
                pageSize={params.limit}
                onPageChange={handlePageChange}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sort={sort}
                onSortChange={setSort}
            />
        </div>
    )
}

export default AdminUserPage;