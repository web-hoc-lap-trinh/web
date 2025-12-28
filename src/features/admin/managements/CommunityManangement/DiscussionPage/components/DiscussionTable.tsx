import type {DiscussionType, IDiscussion} from "../../../../../../types/discussion.types.ts";
import {useState} from "react";
import {
    AlertOutlined,
    CalendarOutlined,
    CheckCircleOutlined, CheckOutlined, DeleteOutlined,
    DownOutlined, ExclamationCircleFilled, EyeOutlined, InfoCircleOutlined,
    MessageOutlined,
    SearchOutlined
} from "@ant-design/icons";
import {message, Modal, Skeleton} from "antd";
import {
    useDeleteDiscussionMutation,
    useMarkSolutionMutation
} from "../../../../../../services/discussion/discussion.service.ts";

const {confirm} = Modal;

interface DiscussionTableProps {
    discussions: IDiscussion[];
    loading: boolean;
}

const DiscussionTable = ({discussions, loading}: DiscussionTableProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [markSolution, { isLoading: isMarking }] = useMarkSolutionMutation();
    const [deleteDiscussion, { isLoading: isDeleting }] = useDeleteDiscussionMutation();

    const filteredPosts = discussions.filter(cat =>
        cat.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
        <div className="space-y-6">
            {/* Header Controls */}
            <div className="flex justify-between items-center bg-[#1a202c]/40 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-900/10">
                        <MessageOutlined size={20} className="text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white tracking-tight">Quản lý bài đăng</h3>
                        {/*<p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Phân loại nội dung theo công nghệ</p>*/}
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
                            placeholder="Tìm tên bài đăng"
                            className="w-full pl-11 pr-4 py-2.5 bg-[#0f131a]/60 text-gray-200 rounded-2xl border border-white/10 outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all text-sm shadow-inner"
                        />
                    </div>
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
                        {filteredPosts.length > 0 ? (
                            filteredPosts.map((post) => (
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
                                    <td className="px-8 py-6 text-center">
                                        <div className="flex flex-col items-center gap-0.5">
                                            <div className="flex items-center gap-1.5 text-gray-300 font-semibold text-[11px]">
                                                <CalendarOutlined size={12} className="text-gray-500" />
                                                {formatDateTime(post.updated_at)}
                                            </div>
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
                                                className="p-2.5 bg-red-400/5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl border border-transparent hover:border-red-500/20 transition-all"
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
                                        <p className="text-sm font-bold text-gray-300">Không tìm thấy bài đăng nào</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default DiscussionTable;