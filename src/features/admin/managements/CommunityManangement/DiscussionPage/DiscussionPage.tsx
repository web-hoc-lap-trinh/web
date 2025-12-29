import HeaderBar from "../../../../../components/common/HeaderBar.tsx";
import {useGetAdminDiscussionsQuery} from "../../../../../services/discussion/discussion.service.ts";
import DiscussionTable from "./components/DiscussionTable.tsx";
import {useEffect, useState} from "react";
import {useDebounce} from "../../../../../hooks/useDebounce.ts";
import DiscussionDetail from "./components/DiscussionDetail.tsx";
import type {IDiscussion} from "../../../../../types/discussion.types.ts";

const DiscussionPage = () => {
    const [selectedDiscussionId, setSelectedDiscussionId] = useState<number | null>(null);
    const [discussionDetailOpen, setDiscussionDetailOpen] = useState(false);
    const [params, setParams] = useState({ page: 1, limit: 10 });
    const [searchQuery, setSearchQuery] = useState('');
    const [sort, setSort] = useState<boolean | undefined>(undefined);
    const debouncedSearch = useDebounce(searchQuery, 500);

    useEffect(() => {
        setParams(prev => ({ ...prev, page: 1 }));
    }, [debouncedSearch]);

    const handlePageChange = (page: number, pageSize: number) => {
        setParams(prev => ({ ...prev, page, limit: pageSize }));
    };

    const handleDiscussionDetailOpen = (discussion: IDiscussion) => {
        setSelectedDiscussionId(discussion.discussion_id)
        setDiscussionDetailOpen(true);
    }

    const { data, isLoading, isFetching } = useGetAdminDiscussionsQuery({
        page: params.page,
        limit: params.limit,
        search: debouncedSearch || undefined,
        is_solution: sort
    });

    return (
        <div className="flex-1 overflow-auto px-10 pb-10 z-10">
            <HeaderBar title={"Quản lý bài đăng"} buttonText={""} setOpen={() => {}}/>
            <DiscussionTable
                edit={handleDiscussionDetailOpen}
                discussions={data?.items || []}
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

            <DiscussionDetail discussionId={selectedDiscussionId} isOpen={discussionDetailOpen} onClose={() => setDiscussionDetailOpen(false)} />
        </div>
    )
}

export default DiscussionPage;