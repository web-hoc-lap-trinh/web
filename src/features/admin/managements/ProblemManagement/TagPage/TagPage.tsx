import {useGetTagsQuery} from "../../../../../services/tag/tag.service.ts";
import {useState} from "react";
import type {ITag} from "../../../../../types/tag.types.ts";
import HeaderBar from "../../../../../components/common/HeaderBar.tsx";
import TagTable from "./components/TagTable.tsx";

const TagPage = () => {
    const { data, isLoading} = useGetTagsQuery()
    const tags = data?.items || [];
    const [, setIsTagAddOpen] = useState<boolean>(false)
    const [, setIsTagEditOpen] = useState<boolean>(false)
    const [, setSelectedTagId] = useState<number>(0)

    const handleEditTag = (tag: ITag) => {
        setSelectedTagId(tag.tag_id)
        setIsTagEditOpen(true)
    }

    return (
        <div className="flex-1 overflow-auto px-10 pb-10 z-10">
            <HeaderBar title={"Quản lý nhãn"} buttonText={"Thêm nhãn"} setOpen={() => setIsTagAddOpen(true)} />
            <TagTable onEdit={handleEditTag} tags={tags} loading={isLoading}/>
        </div>
    )
}

export default TagPage;