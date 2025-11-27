import HeaderBar from "../../components/common/HeaderBar.tsx";
import SearchBar from "../../components/common/SearchBar.tsx";

const LessonPage = () => {
    return (
        <main className={"flex flex-col"}>
            <div className={"flex flex-col"}>
                <HeaderBar
                    title={"Danh sách các bài học"}
                    buttonText={"Thêm bài học"}
                />
                <SearchBar />
            </div>
            <div>Lesson</div>
        </main>
    )
};

export default LessonPage;