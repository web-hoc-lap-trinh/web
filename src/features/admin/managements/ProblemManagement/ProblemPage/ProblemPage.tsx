import HeaderBar from "../../../../../components/common/HeaderBar.tsx";
import {useEffect, useMemo, useState} from "react";
import ProblemTable from "./components/ProblemTable.tsx";
import type {Difficulty, IProblem, Order, Sort} from "../../../../../types/problem.types.ts";
import AddProblemModal from "./components/AddProblemModal.tsx";
import EditProblemModal from "./components/EditProblemModal.tsx";
import {useGetTagsQuery} from "../../../../../services/tag/tag.service.ts";
import {useDebounce} from "../../../../../hooks/useDebounce.ts";
import {useGetProblemsQuery} from "../../../../../services/problem/problem.service.ts";

const ProblemPage = () => {
    // const {data, isLoading} = useGetProblemsQuery()
    // const problems = data?.items || [];
    const {data} = useGetTagsQuery();
    const tags = useMemo(() => data?.items || [], [data?.items]);
    const [isProblemAddOpen, setIsProblemAddOpen] = useState<boolean>(false)
    const [isProblemEditOpen, setIsProblemEditOpen] = useState<boolean>(false)
    const [selectedTagId, setSelectedTagId] = useState<number>(0);
    const [selectedProblemId, setSelectedProblemId] = useState<number>(0)
    const [params, setParams] = useState({ page: 1, limit: 10 });
    const [searchProblemQuery, setSearchProblemQuery] = useState('');
    const [sortValue, setSortValue] = useState<string | undefined>(undefined)
    const [difficultySortValue, setDifficultySortValue] = useState<string | undefined>(undefined)
    const [orderValue, setOrderValue] = useState<string | undefined>(undefined)
    const debouncedSearch = useDebounce(searchProblemQuery, 500);

    /*useEffect(() => {
        if (tags.length > 0 && !selectedTagId) {
            setSelectedTagId(tags[0].tag_id);
        }
    }, [selectedTagId, tags]);*/

    useEffect(() => {
        setParams(prev => ({ ...prev, page: 1 }));
    }, [debouncedSearch]);

    const handlePageChange = (page: number, pageSize: number) => {
        setParams(prev => ({ ...prev, page, limit: pageSize }));
    };

    const handleEditProblem = (problem: IProblem) => {
        setSelectedProblemId(problem.problem_id)
        setIsProblemEditOpen(true)
    }

    const { data: problems, isLoading, isFetching } = useGetProblemsQuery({
        page: params.page,
        limit: params.limit,
        search: debouncedSearch || undefined,
        tag_id: selectedTagId,
        sort: sortValue as Sort,
        difficulty: difficultySortValue as Difficulty,
        order: orderValue as Order
    });

    return (
        <div className="flex-1 overflow-auto px-10 pb-10">
            <HeaderBar title={"Quản lý bài tập"} buttonText={"Thêm bài tập"} setOpen={() => setIsProblemAddOpen(true)} />
            <ProblemTable
                onEdit={handleEditProblem}
                tags={tags}
                problems={problems?.items || []}
                loading={isLoading || isFetching}
                total={problems?.total || 0}
                currentPage={params.page}
                pageSize={params.limit}
                onPageChange={handlePageChange}
                selectedTagId={selectedTagId}
                setSelectedTagId={setSelectedTagId}
                searchProblemValue={searchProblemQuery}
                onSearchProblemChange={setSearchProblemQuery}
                sortValue={sortValue}
                onSortValue={setSortValue}
                difficultySortValue={difficultySortValue}
                onDifficultySortChange={setDifficultySortValue}
                orderValue={orderValue}
                onOrderValue={setOrderValue}
            />

            <AddProblemModal tags={tags} isOpen={isProblemAddOpen} onClose={() => setIsProblemAddOpen(false)} />
            <EditProblemModal
                isOpen={isProblemEditOpen}
                onClose={() => {
                    setIsProblemEditOpen(false)
                    setSelectedProblemId(0)
                }}
                tags={tags}
                problemId={selectedProblemId} />
        </div>
    )
}

export default ProblemPage