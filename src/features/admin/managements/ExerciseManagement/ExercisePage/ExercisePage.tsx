import HeaderBar from "../../../../../components/common/HeaderBar.tsx";
import {useGetAdminLessonsQuery} from "../../../../../services/lesson/lesson.service.ts";
import {useState} from "react";
import ExerciseTable from "./components/ExerciseTable.tsx";
import type {IExerciseAdminDetail} from "../../../../../types/exercise.types.ts";
import AddExerciseModal from "./components/AddExerciseModal.tsx";
import EditExerciseModal from "./components/EditExerciseModal.tsx";

const ExercisePage = () => {
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
            <HeaderBar title={"Quản lý bài tập"} buttonText={"Thêm bài tập"} setOpen={() => setIsExerciseAddOpen(true)} />
            <ExerciseTable onEdit={handleEditExercise} lessons={lessons} loading={isLoading} />

            <AddExerciseModal isOpen={isExerciseAddOpen} onClose={() => setIsExerciseAddOpen(false)} />
            <EditExerciseModal
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

export default ExercisePage