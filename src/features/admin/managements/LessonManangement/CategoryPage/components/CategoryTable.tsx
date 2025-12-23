import type {ICategory} from "../../../../../../types/category.types.ts";
import {DeleteOutlined, EditOutlined, ExclamationCircleFilled, FileImageOutlined, SearchOutlined, SortAscendingOutlined} from "@ant-design/icons";
import {message, Modal, Skeleton} from "antd";
import {useDeleteCategoryMutation} from "../../../../../../services/category/category.service.ts";

interface CategoryTableProps {
    onEdit: (category: ICategory) => void;
    categories: ICategory[];
    loading: boolean;
}

const {confirm} = Modal;

const CategoryTable = ({ onEdit, categories, loading }: CategoryTableProps) => {
    const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

    const showDeleteConfirm = (id: string, name: string) => {
        confirm({
            title: 'Xác nhận xóa chủ đề?',
            icon: <ExclamationCircleFilled />,
            content: `Bạn có chắc chắn muốn xóa "${name}"? Hành động này không thể hoàn tác.`,
            okText: 'Xóa ngay',
            okType: 'danger',
            cancelText: 'Hủy',
            centered: true,
            async onOk() {
                try {
                    await deleteCategory(id).unwrap();
                    message.success('Đã xóa chủ đề thành công');
                } catch (error: any) {
                    message.error(error?.data?.message || 'Không thể xóa chủ đề này');
                }
            },
        });
    };

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

    return (
        <div className="relative">
            <div className="bg-[#1a202c]/60 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl overflow-hidden">

                {/* Header Controls */}
                <div className="p-6 border-b border-white/5 flex flex-row sm:flex-row gap-5 justify-between items-center bg-white/5">
                    <div className="relative flex-1 w-full sm:max-w-md group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <SearchOutlined className="text-gray-400 group-focus-within:text-emerald-400 transition-colors" size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Tìm kiếm chủ đề..."
                            className="w-full pl-11 pr-4 py-3 bg-[#0f131a]/50 text-gray-200 rounded-xl border border-white/5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-[#0f131a] transition-all placeholder-gray-500 shadow-inner"
                        />
                    </div>

                    {/*<div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                            <SortAscendingOutlined size={16} />
                            <span>Sắp xếp</span>
                        </button>
                    </div>*/}
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-400 uppercase bg-black/20">
                        <tr>
                            <th className="px-6 py-5 font-semibold text-center w-16">STT</th>
                            <th className="px-6 py-5 font-semibold w-24">Icon</th>
                            <th className="px-6 py-5 font-semibold">Tên chủ đề</th>
                            <th className="px-6 py-5 font-semibold">Mã ID</th>
                            {/*<th className="px-6 py-5 font-semibold text-center">Thứ tự</th>*/}
                            {/*<th className="px-6 py-5 font-semibold">Trạng thái</th>*/}
                            <th className="px-6 py-5 font-semibold text-right"></th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                        {categories.map((cat, index) => (
                            <tr key={cat.category_id} className="group hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-5 text-center text-gray-500 font-mono text-xs">{index + 1}</td>
                                <td className="px-6 py-5">
                                    <div className="w-12 h-12 rounded-xl bg-[#0f131a] border border-white/10 flex items-center justify-center p-2 shadow-inner group-hover:border-emerald-500/30 transition-colors">
                                        {cat.icon_url ? (
                                            <img src={cat.icon_url} alt={cat.name} className="w-full h-full object-contain" />
                                        ) : (
                                            <FileImageOutlined size={20} className="text-gray-600" />
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="font-semibold text-gray-200 group-hover:text-emerald-300 transition-colors text-base">{cat.name}</div>
                                    {/*<div className="text-[10px] text-gray-600 mt-1 uppercase tracking-tighter">Ngày tạo: {cat.created_at.toLocaleDateString('vi-VN')}</div>*/}
                                </td>
                                <td className="px-6 py-5">
                                    <span className="font-mono text-xs text-gray-400 bg-white/5 px-2 py-1 rounded border border-white/5">{cat.category_id}</span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="p-2.5 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => onEdit(cat)} className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-all transform hover:scale-110">
                                            <EditOutlined size={18} />
                                        </button>
                                        <button
                                            className="p-2.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all transform hover:scale-110"
                                            onClick={() => showDeleteConfirm(cat.category_id, cat.name)}
                                            disabled={isDeleting}
                                        >
                                            <DeleteOutlined size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="h-14 bg-black/10 border-t border-white/5 flex items-center justify-center">
                    <span className="text-[11px] text-gray-600 font-bold uppercase tracking-widest">Tổng cộng: {categories.length} chủ đề</span>
                </div>
            </div>
        </div>
    )
}

export default CategoryTable;