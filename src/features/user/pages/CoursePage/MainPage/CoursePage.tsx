import { useGetCategoriesQuery } from "../../../../../services/category/category.service";
import HeroSection from "./components/HeroSection";
import CourseList from "./components/CourseList";

const CoursePage = () => {
	const { data: categories = [], isLoading } = useGetCategoriesQuery();

	return (
		<div className="min-h-screen bg-[#051311] pt-24 pb-12 px-4">
			<div className="container mx-auto max-w-7xl">
				<HeroSection />
				<CourseList categories={categories} loading={isLoading} />
			</div>
		</div>
	);
};

export default CoursePage;

