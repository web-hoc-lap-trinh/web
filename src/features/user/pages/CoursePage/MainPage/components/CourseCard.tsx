import { BookOutlined, FireOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import type { ICategory } from "../../../../../../types/category.types";

type CourseCardProps = {
	category: ICategory;
};

const CourseCard = ({ category }: CourseCardProps) => {
	return (
		<article className="group bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 flex flex-col gap-4 hover:border-emerald-400/60 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-200">
			<div className="flex items-center gap-3">
				<div className="w-12 h-12 rounded-xl bg-linear-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/30">
					<BookOutlined className="text-xl" />
				</div>
				<div className="flex-1 min-w-0">
					<h3 className="text-white font-semibold text-base md:text-lg truncate">
						{category.name}
					</h3>
					<p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
						<span className="inline-flex items-center gap-1 text-emerald-400">
							<FireOutlined />
							Mức độ: Cơ bản → Nâng cao
						</span>
					</p>
				</div>
			</div>

			<p className="text-gray-400 text-sm line-clamp-2">
				Lộ trình học {category.name.toLowerCase()} theo từng bước, kèm bài tập và dự án thực tế.
			</p>

			<div className="flex items-center justify-between pt-1">
				<div className="flex flex-wrap gap-2">
					{category.is_active ? (
						<Tag className="m-0! border-0! bg-emerald-500/10! text-emerald-300! text-[11px] font-medium">
							Đang mở đăng ký
						</Tag>
					) : (
						<Tag className="m-0! border-0! bg-gray-600/30! text-gray-300! text-[11px] font-medium">
							Tạm khóa 
						</Tag>
					)}
				</div>

				<button 
                    className="text-xs md:text-sm font-semibold text-emerald-400 group-hover:text-emerald-300 cursor-pointer transition-colors"
                    onClick={() => window.location.href = `/courses/${category.category_id}`}
                >
					Xem chi tiết →
				</button>
			</div>
		</article>
	);
};

export default CourseCard;