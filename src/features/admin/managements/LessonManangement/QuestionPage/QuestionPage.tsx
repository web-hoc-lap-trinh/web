import HeaderBar from "../../../../../components/common/HeaderBar.tsx";
import {useGetAdminLessonsQuery} from "../../../../../services/lesson/lesson.service.ts";
import {useState} from "react";
import QuestionTable from "./components/QuestionTable.tsx";
import type {IExerciseAdminDetail} from "../../../../../types/exercise.types.ts";
import AddQuestionModal from "./components/AddQuestionModal.tsx";
import EditQuestionModal from "./components/EditQuestionModal.tsx";

const QuestionPage = () => {
    const [selectedExerciseId, setSelectedExerciseId] = useState<number>(0);
    const [isExerciseAddOpen, setIsExerciseAddOpen] = useState<boolean>(false);
    const [isExerciseEditOpen, setIsExerciseEditOpen] = useState<boolean>(false);
    const {data: lessons = [], isLoading} = useGetAdminLessonsQuery()

    const handleEditExercise = (exercise: IExerciseAdminDetail) => {
        setSelectedExerciseId(exercise.exercise_id);
        setIsExerciseEditOpen(true);
    };

    return (
        <div className="flex-1 overflow-auto px-10 pb-10 z-10">
            <HeaderBar title={"Quản lý câu hỏi"} buttonText={"Thêm câu hỏi"} setOpen={() => setIsExerciseAddOpen(true)} />
            <QuestionTable onEdit={handleEditExercise} lessons={lessons} loading={isLoading} />

            <AddQuestionModal isOpen={isExerciseAddOpen} onClose={() => setIsExerciseAddOpen(false)} />
            <EditQuestionModal
                isOpen={isExerciseEditOpen}
                onClose={() => {
                    setIsExerciseEditOpen(false);
                    setSelectedExerciseId(0);
                }}
                exerciseId={selectedExerciseId}
            />
        </div>
    )
}

export default QuestionPage;