import type {ICategory} from "../../../../../../types/category.types.ts";
import {
    AppstoreOutlined, DeleteOutlined,
    DownOutlined, EditOutlined, ExclamationCircleFilled, FileImageOutlined, SearchOutlined
} from "@ant-design/icons";
import {message, Modal, Skeleton} from "antd";
import {useDeleteCategoryMutation} from "../../../../../../services/category/category.service.ts";
import {useState} from "react";

interface CategoryTableProps {
    onEdit: (category: ICategory) => void;
    categories: ICategory[];
    loading: boolean;
}

const {confirm} = Modal;

const CategoryTable = ({ onEdit, categories, loading }: CategoryTableProps) => {
    const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = (id: number, name: string) => {
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
        <div className="relative space-y-4">
            {/* Unified Header & Search */}
            <div className="flex justify-between items-center bg-[#1a202c]/40 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-900/10">
                        <AppstoreOutlined size={20} className="text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white tracking-tight">Quản lý chủ đề</h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Phân loại nội dung theo công nghệ</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-2/3 md:w-auto">
                    {/* Neat Search */}
                    <div className="relative group flex-1 md:w-72">
                        <SearchOutlined size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Tìm tên chủ đề hoặc mã ID..."
                            className="w-full pl-11 pr-4 py-2.5 bg-[#0f131a]/60 text-gray-200 rounded-2xl border border-white/10 outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all text-sm shadow-inner"
                        />
                    </div>
                    <button className="p-2.5 text-gray-400 hover:text-white bg-white/5 rounded-xl border border-white/10 transition-all">
                        <DownOutlined size={18} />
                    </button>
                </div>
            </div>

            {/* Modern Table Container */}
            <div className="bg-[#1a202c]/60 backdrop-blur-xl rounded-[32px] border border-white/5 shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-[11px] text-gray-500 uppercase font-bold bg-black/20 tracking-wider">
                        <tr>
                            <th className="px-8 py-5 text-center">STT</th>
                            <th className="px-8 py-5">Chủ đề</th>
                            <th className="px-8 py-5 text-center"></th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                        {filteredCategories.map((cat, index) => (
                            <tr key={cat.category_id} className="group hover:bg-white/[0.03] transition-colors duration-300">
                                <td className="px-8 py-5 text-center font-mono text-[10px] text-gray-600 font-bold">
                                    {String(index + 1).padStart(2, '0')}
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-11 h-11 rounded-xl bg-[#0f131a] border border-white/10 flex items-center justify-center p-2.5 shadow-inner group-hover:border-emerald-500/30 transition-all duration-300">
                                            {cat.icon_url ? (
                                                <img src={cat.icon_url} alt={cat.name} className="w-full h-full object-contain filter drop-shadow-sm" />
                                            ) : (
                                                <FileImageOutlined size={18} className="text-gray-600" />
                                            )}
                                        </div>
                                        <div className="font-bold text-gray-200 group-hover:text-emerald-300 transition-colors text-base tracking-tight">
                                            {cat.name}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-center">
                                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <button
                                            onClick={() => onEdit(cat)}
                                            className="p-2.5 bg-emerald-400/5 text-gray-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-xl border border-transparent hover:border-emerald-500/20 transition-all"
                                        >
                                            <EditOutlined size={16} />
                                        </button>
                                        <button
                                            className="p-2.5 bg-red-400/5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl border border-transparent hover:border-red-500/20 transition-all"
                                            onClick={() => handleDelete(cat.category_id, cat.name)}
                                            disabled={isDeleting}
                                        >
                                            <DeleteOutlined size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default CategoryTable;