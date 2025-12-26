import {useState} from "react";
import {useGetCategoriesQuery} from "../../../../../services/category/category.service.ts";
import CategoryTable from "./components/CategoryTable.tsx";
import AddCategoryModal from "./components/AddCategoryModal.tsx";
import EditCategoryModal from "./components/EditCategoryModal.tsx";
import type {ICategory} from "../../../../../types/category.types.ts";
import HeaderBar from "../../../../../components/common/HeaderBar.tsx";

const CategoryPage = () => {
    const { data: categories = [], isLoading } = useGetCategoriesQuery();
    const [isCategoryAddOpen, setCategoryAddOpen] = useState(false);
    const [isCategoryEditOpen, setCategoryEditOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);

    const handleEditCategory = (category: ICategory) => {
        setSelectedCategoryId(category.category_id);
        setCategoryEditOpen(true);
    };

    return (
        <div className="flex-1 overflow-auto px-10 pb-10 z-10">
            <HeaderBar title={"Quản lý chủ đề"} buttonText={"Thêm chủ đề"} setOpen={() => setCategoryAddOpen(true)} />
            <CategoryTable onEdit={handleEditCategory} categories={categories} loading={isLoading}/>

            <AddCategoryModal isOpen={isCategoryAddOpen} onClose={() => setCategoryAddOpen(false)} />
            <EditCategoryModal
                isOpen={isCategoryEditOpen}
                onClose={() => {
                    setCategoryEditOpen(false)
                    setSelectedCategoryId(0)
                }}
                categoryId={selectedCategoryId} />
        </div>
    )
};

export default CategoryPage;