import {useGetTagsQuery} from "../../../../../services/tag/tag.service.ts";
import {useEffect, useState} from "react";
import type {ITag} from "../../../../../types/tag.types.ts";
import HeaderBar from "../../../../../components/common/HeaderBar.tsx";
import TagTable from "./components/TagTable.tsx";
import AddTagModal from "./components/AddTagModal.tsx";
import EditTagModal from "./components/EditTagModal.tsx";
import {useDebounce} from "../../../../../hooks/useDebounce.ts";

const TagPage = () => {
    const [isTagAddOpen, setIsTagAddOpen] = useState<boolean>(false)
    const [isTagEditOpen, setIsTagEditOpen] = useState<boolean>(false)
    const [selectedTagId, setSelectedTagId] = useState<number>(0)
    const [params, setParams] = useState({ page: 1, limit: 10 });
    const [searchQuery, setSearchQuery] = useState<string | null>(null);
    const [sortTagValue, setSortTagValue] = useState<boolean | undefined>(undefined);
    const debouncedSearch = useDebounce(searchQuery, 500);

    useEffect(() => {
        setParams(prev => ({ ...prev, page: 1 }));
    }, [debouncedSearch]);

    const handlePageChange = (page: number, pageSize: number) => {
        setParams(prev => ({ ...prev, page, limit: pageSize }));
    };

    const handleEditTag = (tag: ITag) => {
        console.log("Trạng thái tag:", tag.is_active, typeof tag.is_active);
        setSelectedTagId(tag.tag_id)
        setIsTagEditOpen(true)
    }

    const { data, isLoading, isFetching } = useGetTagsQuery({
        page: params.page,
        limit: params.limit,
        search: debouncedSearch || undefined,
        is_active: sortTagValue,
    });

    return (
        <div className="flex-1 overflow-auto px-10 pb-10 z-10">
            <HeaderBar title={"Quản lý nhãn"} buttonText={"Thêm nhãn"} setOpen={() => setIsTagAddOpen(true)} />
            <TagTable
                onEdit={handleEditTag}
                tags={data?.items || []}
                loading={isLoading || isFetching}
                total={data?.total || 0}
                currentPage={params.page}
                pageSize={params.limit}
                onPageChange={handlePageChange}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sort={sortTagValue}
                onSortChange={setSortTagValue}
            />

            <AddTagModal isOpen={isTagAddOpen} onClose={() => setIsTagAddOpen(false)} />
            <EditTagModal isOpen={isTagEditOpen} onClose={() => setIsTagEditOpen(false)} tagId={selectedTagId}/>
        </div>
    )
}

export default TagPage;