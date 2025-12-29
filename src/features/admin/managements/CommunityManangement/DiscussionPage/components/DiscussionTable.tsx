import type {DiscussionType, IDiscussion} from "../../../../../../types/discussion.types.ts";
import {
    AlertOutlined,
    CheckCircleOutlined, CheckOutlined, ClockCircleOutlined, DeleteOutlined,
    ExclamationCircleFilled, EyeOutlined, InfoCircleOutlined,
    MessageOutlined
} from "@ant-design/icons";
import {Input, message, Modal, Pagination, Select} from "antd";
import {
    useDeleteDiscussionMutation,
    useMarkSolutionMutation
} from "../../../../../../services/discussion/discussion.service.ts";

const {confirm} = Modal;

interface DiscussionTableProps {
    edit: (discussion: IDiscussion) => void;
    discussions: IDiscussion[];
    loading: boolean;
    total: number;
    currentPage: number;
    pageSize: number;
    onPageChange: (page: number, pageSize: number) => void;
    searchQuery: string;
    onSearchChange: (value: string) => void;
    sort: boolean | undefined;
    onSortChange: (value: boolean | undefined) => void;
}

const DiscussionTable = ({
    edit,
    discussions,
    loading,
    total,
    currentPage,
    pageSize,
    onPageChange,
    searchQuery,
    onSearchChange,
    sort,
    onSortChange
}: DiscussionTableProps) => {
    const [markSolution, { isLoading: isMarking }] = useMarkSolutionMutation();
    const [deleteDiscussion, { isLoading: isDeleting }] = useDeleteDiscussionMutation();

    const getTypeBadge = (type: DiscussionType) => {
        switch (type) {
            case 'QUESTION': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'SOLUTION': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'GENERAL': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'BUG_REPORT': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

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

    const handleMarkSolution = async (discussionId: number) => {
        try {
            await markSolution({ discussionId }).unwrap();
            message.success("Đã đánh dấu bài viết có lời giải!");
        } catch (error) {
            message.error(`Không thể đánh dấu lời giải. Vui lòng thử lại. [${error}]`);
        }
    };

    const handleDelete = (id: number, name: string) => {
        confirm({
            title: 'Xác nhận xóa bài đăng?',
            icon: <ExclamationCircleFilled />,
            content: `Bạn có chắc chắn muốn xóa "${name}"? Hành động này không thể hoàn tác.`,
            okText: 'Xóa ngay',
            okType: 'danger',
            cancelText: 'Hủy',
            centered: true,
            async onOk() {
                try {
                    await deleteDiscussion(id).unwrap();
                    message.success('Đã xóa bài đăng thành công');
                } catch (error: any) {
                    message.error(error?.data?.message || 'Không thể xóa bài đăng này');
                }
            },
        });
    };

    return (
        <div className="space-y-6">
            {/* Header Controls */}
            <div className="flex justify-between items-center bg-[#1a202c]/40 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-900/10">
                        <MessageOutlined size={20} className="text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white tracking-tight">Danh sách bài đăng</h3>
                        {/*<p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Phân loại nội dung theo công nghệ</p>*/}
                    </div>
                </div>

                <div className="flex items-center gap-3 w-2/3 md:w-auto">
                    {/* Neat Search */}
                    <Input.Search
                        size={"large"}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Tìm tiêu đề bài đăng..."
                        loading={loading}
                    />
                    <Select
                        size={"large"}
                        value={sort}
                        allowClear={true}
                        style={{ width: 170 }}
                        onChange={(e) => onSortChange(e)}
                        options={[
                            { value: true, label: 'Is solution' },
                            { value: false, label: 'Not solution' },
                        ]}
                    />
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-[#1a202c]/60 backdrop-blur-xl rounded-4xl border border-white/5 shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-[11px] text-gray-500 uppercase font-bold bg-black/20 tracking-wider">
                        <tr>
                            <th className="px-8 py-6">Tiêu đề bài viết</th>
                            <th className="px-8 py-6 text-center">Phân loại</th>
                            <th className="px-8 py-6 text-center">Giải pháp</th>
                            <th className="px-8 py-6 text-center">Lượt xem</th>
                            <th className="px-8 py-6 text-center">Phản hồi</th>
                            <th className="px-8 py-6 text-center">Cập nhật</th>
                            <th className="px-8 py-6 text-right">Thao tác</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                        {discussions.length > 0 ? (
                            discussions.map((post) => (
                                <tr key={post.discussion_id} className="group hover:bg-white/3 transition-colors duration-300">
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1 max-w-md">
                        <span className="font-bold text-gray-100 text-sm group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                          {post.title}
                        </span>
                                            <span className="text-[10px] text-gray-600 font-mono tracking-widest uppercase">{post.discussion_id}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="flex justify-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getTypeBadge(post.discussion_type)}`}>
                          {post.discussion_type}
                        </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="flex justify-center">
                                            {post.is_solution ? (
                                                <div className="p-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-emerald-400" title="Đã có lời giải">
                                                    <CheckCircleOutlined size={16} />
                                                </div>
                                            ) : (
                                                <div className="p-1.5 bg-gray-500/5 rounded-lg border border-white/5 text-gray-600" title="Chưa có lời giải">
                                                    <AlertOutlined size={16} />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="flex items-center gap-1.5 text-gray-300 font-bold">
                                                <EyeOutlined size={14} className="text-gray-500" />
                                                {post.view_count.toLocaleString()}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                                                <MessageOutlined size={14} className="opacity-70" />
                                                {post.reply_count}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col items-center">
                            <span className="text-gray-400 text-xs flex items-center gap-1">
                                <ClockCircleOutlined size={12} />
                                {formatDateTime(post.updated_at)}
                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <button
                                                onClick={() => handleMarkSolution(post.discussion_id)}
                                                disabled={isMarking || post.is_solution}
                                                className={`p-2 rounded-lg transition-all ${
                                                    post.is_solution
                                                        ? "text-emerald-500 bg-emerald-500/20 cursor-not-allowed"
                                                        : "text-gray-400 hover:text-emerald-400 hover:bg-emerald-400/10"
                                                }`}
                                                title={post.is_solution ? "Đã là giải pháp" : "Đánh dấu là giải pháp"}
                                            >
                                                <CheckOutlined size={16} className={isMarking ? "animate-pulse" : ""} />
                                            </button>
                                            <button
                                                className="p-2.5 text-gray-400 hover:bg-gray-400/10 rounded-xl border border-transparent transition-all"
                                                onClick={() => {edit(post)}}
                                                title="Xem bài viết"
                                            >
                                                <EyeOutlined size={18} />
                                            </button>
                                            <button
                                                className="p-2.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl border border-transparent hover:border-red-500/20 transition-all"
                                                onClick={() => handleDelete(post.discussion_id, post.title)}
                                                disabled={isDeleting}
                                                title="Xóa bài viết"
                                            >
                                                <DeleteOutlined size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-8 py-24 text-center">
                                    <div className="flex flex-col items-center gap-3 opacity-20">
                                        <InfoCircleOutlined size={40} className="text-gray-400" />
                                        <p className="text-sm font-bold text-gray-300">{loading ? "Đang tải dữ liệu" : "Không tìm thấy bài đăng nào"}</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="px-8 py-5 border-t border-white/5 bg-black/20 flex items-center justify-between">
                    <div className="text-xs text-gray-500 font-medium">
                        Hiển thị <span className="text-emerald-400">{discussions.length}</span> trên <span className="text-emerald-400">{total}</span> nhãn
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
    );
}

export default DiscussionTable;