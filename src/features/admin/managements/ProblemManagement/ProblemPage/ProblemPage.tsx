import HeaderBar from "../../../../../components/common/HeaderBar.tsx";
import {useState} from "react";
import ProblemTable from "./components/ProblemTable.tsx";
import type {IProblem} from "../../../../../types/problem.types.ts";
import AddProblemModal from "./components/AddProblemModal.tsx";
import EditProblemModal from "./components/EditProblemModal.tsx";
import {useGetTagsQuery} from "../../../../../services/tag/tag.service.ts";

const ProblemPage = () => {
    // const {data, isLoading} = useGetProblemsQuery()
    // const problems = data?.items || [];
    const {data, isLoading} = useGetTagsQuery();
    const tags = data?.items || [];
    const [isProblemAddOpen, setIsProblemAddOpen] = useState<boolean>(false)
    const [isProblemEditOpen, setIsProblemEditOpen] = useState<boolean>(false)
    const [selectedProblemId, setSelectedProblemId] = useState<number>(0)

    const handleEditProblem = (problem: IProblem) => {
        setSelectedProblemId(problem.problem_id)
        setIsProblemEditOpen(true)
    }

    return (
        <div className="flex-1 overflow-auto px-10 pb-10">
            <HeaderBar title={"Quản lý bài tập"} buttonText={"Thêm bài tập"} setOpen={() => setIsProblemAddOpen(true)} />
        <ProblemTable onEdit={handleEditProblem} tags={tags} loading={isLoading} />

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