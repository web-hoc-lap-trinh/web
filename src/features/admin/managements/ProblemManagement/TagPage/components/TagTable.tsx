import type {ITag} from "../../../../../../types/tag.types.ts";
import {
    CheckCircleOutlined, ClockCircleOutlined,
    CloseCircleOutlined, DeleteOutlined,
    EditOutlined, ExclamationCircleOutlined,
    TagsOutlined, UnorderedListOutlined
} from "@ant-design/icons";
import {Modal, message, Pagination, Input, Select} from "antd";
import {useDeleteTagMutation} from "../../../../../../services/tag/tag.service.ts";

interface TagTableProps {
    onEdit: (tag: ITag) => void;
    tags: ITag[];
    loading: boolean;
    total: number;
    currentPage: number;
    pageSize: number;
    onPageChange: (page: number, pageSize: number) => void;
    searchQuery: string | null;
    onSearchChange: (value: string | null) => void;
    sort: boolean | undefined;
    onSortChange: (value: boolean | undefined) => void;
}

const TagTable = ({
    onEdit,
    tags,
    loading,
    total,
    currentPage,
    pageSize,
    onPageChange,
    searchQuery,
    onSearchChange,
    sort,
    onSortChange,
}: TagTableProps) => {
    const [deleteTag, { isLoading: isDeleting }] = useDeleteTagMutation();

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

    const handleDeleteTag = (id: number, name: string) => {
        Modal.confirm({
            title: <span className="text-white">Xác nhận xóa nhãn</span>,
            icon: <ExclamationCircleOutlined className="text-red-500" />,
            content: (
                <div className="text-gray-400">
                    Bạn có chắc chắn muốn xóa nhãn <span className="text-emerald-400 font-bold">{name}</span>?
                    Hành động này không thể hoàn tác.
                </div>
            ),
            okText: 'Xóa ngay',
            okType: 'danger',
            cancelText: 'Hủy',
            centered: true,
            // Custom style để khớp với Dark Theme của bạn
            className: "dark-confirm-modal",
            async onOk() {
                try {
                    await deleteTag(id).unwrap();
                    message.success('Đã xóa nhãn thành công');
                } catch (error) {
                    message.error('Không thể xóa nhãn này');
                    console.log(error)
                }
            },
        });
    };

    return (
        <div className="space-y-4">
            {/* Header Controls */}
            <div className="flex justify-between items-center bg-[#1a202c]/40 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-lg">
                        <TagsOutlined size={24} className="text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white tracking-tight">Danh sách nhãn bài tập</h3>
                        <p className="text-xs text-gray-500 font-medium">Phân loại và tổ chức kho bài tập thực hành</p>
                    </div>
                </div>

                <div className="relative group w-96 flex flex-row gap-1">
                    <Select
                        size={"large"}
                        value={sort}
                        allowClear={true}
                        style={{ width: 150 }}
                        onChange={(e) => onSortChange(e)}
                        options={[
                            { value: true, label: 'Active' },
                            { value: false, label: 'Inactive' },
                        ]}
                    />
                    <Input.Search
                        size={"large"}
                        type="text"
                        value={searchQuery ? searchQuery : ""}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Tìm tên nhãn..."
                        loading={loading}
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
                        {tags.length > 0 ? (tags.map((tag) => (
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
                                <td className="px-8 py-6">
                                    <div className="flex flex-col items-center">
                            <span className="text-gray-400 text-xs flex items-center gap-1">
                                <ClockCircleOutlined size={12} />
                                {formatDateTime(tag.updated_at)}
                            </span>
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
                                            onClick={() => handleDeleteTag(tag.tag_id, tag.name)}
                                            disabled={isDeleting}
                                            title="Xóa nhãn"
                                        >
                                            <DeleteOutlined size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))) : (
                            <tr>
                                <td colSpan={5} className="px-8 py-24 text-center">
                                    <div className="flex flex-col items-center gap-3 opacity-20">
                                        <UnorderedListOutlined size={40} className="text-gray-400" />
                                        <p className="text-sm font-bold text-gray-300">{loading ? "Đang tải dữ liệu" : "Không có dữ liệu"}</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="px-8 py-5 border-t border-white/5 bg-black/20 flex items-center justify-between">
                    <div className="text-xs text-gray-500 font-medium">
                        Hiển thị <span className="text-emerald-400">{tags.length}</span> trên <span className="text-emerald-400">{total}</span> nhãn
                    </div>
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={total}
                        onChange={onPageChange}
                        showSizeChanger={false} // Tắt nếu bạn muốn fix cứng limit
                        className="dark-pagination" // CSS custom bên dưới
                    />
                </div>
            </div>
        </div>
    )
}

export default TagTable;