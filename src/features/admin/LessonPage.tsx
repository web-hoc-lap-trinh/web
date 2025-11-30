import HeaderBar from "../../components/common/HeaderBar.tsx";
import SearchBar from "../../components/common/SearchBar.tsx";
import DataTable from "../../components/common/TableInfo.tsx";

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
            <DataTable/>
        </main>
    )
};

export default LessonPage;