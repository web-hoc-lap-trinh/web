import type {ICategory} from "../../../../../../types/category.types.ts";
import {
    AppstoreOutlined, ClockCircleOutlined, EditOutlined, EyeInvisibleOutlined, EyeOutlined, FileImageOutlined
} from "@ant-design/icons";
import {Input, Skeleton} from "antd";
import {useState} from "react";

interface CategoryTableProps {
    onEdit: (category: ICategory) => void;
    categories: ICategory[];
    loading: boolean;
}

const CategoryTable = ({ onEdit, categories, loading }: CategoryTableProps) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatDateTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
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
                        <h3 className="text-xl font-bold text-white tracking-tight">Danh sách chủ đề</h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Phân loại nội dung theo công nghệ</p>
                    </div>
                </div>

                <Input.Search
                    size={"large"}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm câu hỏi..."
                    style={{ width: '20%' }}
                />
            </div>

            {/* Modern Table Container */}
            <div className="bg-[#1a202c]/60 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-[11px] text-gray-500 uppercase font-bold bg-black/20 tracking-wider">
                        <tr>
                            <th className="px-8 py-5 text-center">STT</th>
                            <th className="px-8 py-5">Chủ đề</th>
                            <th className="px-8 py-5 text-center">Trạng thái</th>
                            <th className="px-8 py-5 text-center">Ngày tạo</th>
                            <th className="px-8 py-5 text-center"></th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                        {filteredCategories.map((cat, index) => (
                            <tr key={cat.category_id} className="group hover:bg-white/3 transition-colors duration-300">
                                <td className="px-8 py-5 text-center font-mono text-[10px] text-gray-600 font-bold">
                                    {String(index + 1).padStart(2, '0')}
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-11 h-11 rounded-xl bg-[#0f131a] border border-white/10 flex items-center justify-center p-1 shadow-inner group-hover:border-emerald-500/30 transition-all duration-300">
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
                                    <div className="flex items-center justify-center">
                                        {cat.is_active ? (
                                            <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg border border-emerald-400/20">
                                                <EyeOutlined size={14} />
                                                <span className="text-[10px] font-bold uppercase">Active</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-gray-500 bg-gray-500/10 px-2 py-1 rounded-lg border border-gray-500/20">
                                                <EyeInvisibleOutlined size={14} />
                                                <span className="text-[10px] font-bold uppercase">Inactive</span>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-center">
                                    <div className="flex flex-col items-center">
                               <span className="text-gray-400 text-xs flex items-center gap-1">
                                 <ClockCircleOutlined size={12} />
                                   {formatDateTime(cat.created_at)}
                               </span>
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