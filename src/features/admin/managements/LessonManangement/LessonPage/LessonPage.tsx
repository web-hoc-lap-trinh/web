import HeaderBar from "../../../../../components/common/HeaderBar.tsx";
import {useState} from "react";
import LessonTable from "./components/LessonTable.tsx";
import type {ILesson} from "../../../../../types/lesson.types.ts";
import AddLessonModal from "./components/AddLessonModal.tsx";
import EditLessonModal from "./components/EditLessonModal.tsx";
import {useGetAdminCategoriesQuery} from "../../../../../services/category/category.service.ts";
import {useGetAdminLessonsQuery} from "../../../../../services/lesson/lesson.service.ts";

const LessonPage = () => {
    const {data: categories = [], isLoading} = useGetAdminCategoriesQuery();
    const {data: lessons = []} = useGetAdminLessonsQuery();
    const [isLessonAddOpen, setIsLessonAddOpen] = useState(false);
    const [isLessonEditOpen, setIsLessonEditOpen] = useState(false);
    const [selectedLessonId, setSelectedLessonId] = useState<number>(0);

    const handleEditLesson = (lesson: ILesson) => {
        setSelectedLessonId(lesson.lesson_id);
        setIsLessonEditOpen(true);
    }

    return (
        <div className="flex-1 overflow-auto px-10 pb-10 z-10">
            <HeaderBar title={"Quản lý bài học"} buttonText={"Thêm bài học"} setOpen={() => setIsLessonAddOpen(true)} />
            <LessonTable onEdit={handleEditLesson} categories={categories} lessons={lessons} loading={isLoading} />

            <AddLessonModal isOpen={isLessonAddOpen} onClose={() => setIsLessonAddOpen(false)} />
            <EditLessonModal
                isOpen={isLessonEditOpen}
                onClose={() => {
                    setIsLessonEditOpen(false);
                    setSelectedLessonId(0);
                }}
                lessonId={selectedLessonId}
                />
        </div>
    )
};

export default LessonPage;