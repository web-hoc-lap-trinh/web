import CourseCard from "./CourseCard";
import { Skeleton } from "antd";
import type { ICategory } from "../../../../../../types/category.types";

type CourseListProps = {
	categories: ICategory[];
	loading: boolean;
};

const CourseList = ({ categories, loading }: CourseListProps) => {
	if (loading) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
				{Array.from({ length: 6 }).map((_, idx) => (
					<Skeleton
						key={idx}
						active
						className="bg-white/5! rounded-2xl! p-5!"
						paragraph={{ rows: 3 }}
					/>
				))}
			</div>
		);
	}

	if (!categories.length) {
		return (
			<div className="bg-white/5 border border-dashed border-white/15 rounded-2xl p-10 text-center text-gray-400">
				Chưa có khóa học nào được mở. Hãy quay lại sau nhé!
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
			{categories.map((category) => (
				<CourseCard key={category.category_id} category={category} />
			))}
		</div>
	);
};

export default CourseList;