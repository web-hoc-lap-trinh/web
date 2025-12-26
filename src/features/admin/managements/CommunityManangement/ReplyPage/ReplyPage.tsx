import {
    useGetAdminDiscussionsQuery,
    useGetAdminRepliesQuery
} from "../../../../../services/discussion/discussion.service.ts";
import HeaderBar from "../../../../../components/common/HeaderBar.tsx";
import ReplyTable from "./components/ReplyTable.tsx";

const ReplyPage = () => {
    const {data: discussions = [], isLoading} = useGetAdminDiscussionsQuery()

    return (
        <div className="flex-1 overflow-auto px-10 pb-10 z-10">
            <HeaderBar title={"Quản lý bài đăng"} buttonText={""} setOpen={() => {}}/>
            <ReplyTable discussions={discussions} loading={isLoading}/>
        </div>
    )
}

export default ReplyPage;