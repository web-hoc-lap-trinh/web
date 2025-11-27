import HeaderBar from "../../components/common/HeaderBar.tsx";
import SearchBar from "../../components/common/SearchBar.tsx";

const CategoryPage = () => {
    return (
        <main className={"flex flex-col"}>
            <div className={"flex flex-col"}>
                <HeaderBar
                    title={"Danh sách các chủ đề"}
                    buttonText={"Thêm chủ đề"}
                />
                <SearchBar/>
            </div>
            <div>Category</div>
        </main>
    )
};

export default CategoryPage;