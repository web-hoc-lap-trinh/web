import type {ITag} from "../../../../../../types/tag.types.ts";
import {useState} from "react";
import {
    CalendarOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined, DeleteOutlined,
    EditOutlined,
    SearchOutlined,
    TagsOutlined
} from "@ant-design/icons";
import {Skeleton} from "antd";

interface TagTableProps {
    onEdit: (tag: ITag) => void;
    tags: ITag[];
    loading: boolean;
}

const TagTable = ({onEdit, tags, loading}: TagTableProps) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTags = tags.filter(tag =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

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
        <div className="space-y-4">
            {/* Header Controls */}
            <div className="flex justify-between items-center bg-[#1a202c]/40 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-lg">
                        <TagsOutlined size={24} className="text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white tracking-tight">Quản lý nhãn bài tập</h3>
                        <p className="text-xs text-gray-500 font-medium">Phân loại và tổ chức kho bài tập thực hành</p>
                    </div>
                </div>

                <div className="relative group w-96">
                    <SearchOutlined size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm kiếm nhãn theo tên hoặc mã..."
                        className="w-full pl-12 pr-4 py-3 bg-black/40 text-gray-200 rounded-xl border border-white/10 outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all text-sm shadow-inner"
                    />
                </div>
            </div>

            {/* Label Table Container */}
            <div className="bg-[#1a202c]/60 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-[11px] text-gray-500 uppercase font-bold bg-black/20 tracking-wider">
                        <tr>
                            <th className="px-8 py-6">Nhãn & Mã</th>
                            <th className="px-8 py-6">Mô tả chi tiết</th>
                            <th className="px-8 py-6 text-center">Màu sắc</th>
                            <th className="px-8 py-6 text-center">Trạng thái</th>
                            <th className="px-8 py-6 text-center">Bài tập áp dụng</th>
                            <th className="px-8 py-6 text-center">Ngày cập nhật</th>
                            <th className="px-8 py-6 text-right"></th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                        {filteredTags.map((tag) => (
                            <tr key={tag.tag_id} className="group hover:bg-white/3 transition-colors duration-300">
                                <td className="px-8 py-6">
                                    <div className="flex flex-col">
                      <span className="font-bold text-gray-100 text-base group-hover:text-emerald-400 transition-colors">
                        {tag.name}
                      </span>
                                        <span className="text-[10px] text-gray-600 font-mono tracking-widest uppercase">{tag.tag_id}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-xs text-gray-400 max-w-xs leading-relaxed italic">
                                        "{tag.description}"
                                    </p>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex flex-col items-center gap-1.5">
                                        <div
                                            className="w-10 bg-[${tag.color}] h-6 rounded-md shadow-lg border border-white/10 ring-2 ring-black/20"
                                            style={{ backgroundColor: tag.color ?? 'white' }}
                                        />
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-center">
                                    <div className="flex justify-center">
                                        {tag.is_active ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                          <CheckCircleOutlined size={12} />
                          Hoạt động
                        </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold uppercase tracking-widest">
                          <CloseCircleOutlined size={12} />
                          Đang ẩn
                        </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-center">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                        <span className="text-sm font-bold">{tag.problem_count}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-center">
                                    <div className="flex flex-col items-center gap-0.5">
                                        <div className="flex items-center gap-1.5 text-gray-300 font-semibold text-xs">
                                            <CalendarOutlined size={12} className="text-gray-500" />
                                            {formatDateTime(tag.updated_at)}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <button
                                            onClick={() => onEdit(tag)}
                                            className="p-2.5 bg-emerald-400/5 text-gray-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-xl border border-transparent hover:border-emerald-500/20 transition-all"
                                            title="Chỉnh sửa"
                                        >
                                            <EditOutlined size={18} />
                                        </button>
                                        <button
                                            className="p-2.5 bg-red-400/5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl border border-transparent hover:border-red-500/20 transition-all"
                                            title="Xóa nhãn"
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
            </div>
        </div>
    )
}

export default TagTable;