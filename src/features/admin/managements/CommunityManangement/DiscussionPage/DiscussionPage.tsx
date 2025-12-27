import HeaderBar from "../../../../../components/common/HeaderBar.tsx";
import {useGetAdminDiscussionsQuery} from "../../../../../services/discussion/discussion.service.ts";
import DiscussionTable from "./components/DiscussionTable.tsx";

const DiscussionPage = () => {
    const {data: discussions = [], isLoading} = useGetAdminDiscussionsQuery()

    return (
        <div className="flex-1 overflow-auto px-10 pb-10 z-10">
            <HeaderBar title={"Quản lý bài đăng"} buttonText={""} setOpen={() => {}}/>
            <DiscussionTable discussions={discussions} loading={isLoading}/>
        </div>
    )
}

export default DiscussionPage;