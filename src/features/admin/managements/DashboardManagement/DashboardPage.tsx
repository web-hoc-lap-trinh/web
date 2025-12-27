import HeaderBar from "../../../../components/common/HeaderBar.tsx";
import DashboardStats from "./components/DashboardStats.tsx";
import {useGetDashboardStatsQuery} from "../../../../services/admin/admin.service.ts";

const DashboardPage = () => {
    const {data: dashboard, isLoading} = useGetDashboardStatsQuery()

    return (
        <div className="flex-1 overflow-auto px-10 pb-10 z-10">
            <HeaderBar title={"Tổng quan"} buttonText={""} setOpen={() => {}} />
            <DashboardStats data={dashboard} loading={isLoading} />
        </div>
    )
};

export default DashboardPage;