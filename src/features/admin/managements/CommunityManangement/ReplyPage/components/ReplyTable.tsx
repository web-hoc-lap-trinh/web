import type {IDiscussion} from "../../../../../../types/discussion.types.ts";
import {useEffect, useMemo, useState} from "react";
import {Skeleton} from "antd";
import {
    CalendarOutlined,
    DislikeOutlined,
    FileTextOutlined, 
    InfoCircleOutlined,
    LikeOutlined, 
    MessageOutlined,
    SearchOutlined, 
    UnorderedListOutlined,
    UserOutlined,
} from "@ant-design/icons";
import {useGetAdminRepliesQuery} from "../../../../../../services/discussion/discussion.service.ts";

interface ReplyTableProps {
    discussions: IDiscussion[];
    loading: boolean,
}

const ReplyTable = ({discussions, loading}: ReplyTableProps) => {
    const [selectedDiscussionId, setSelectedDiscussionId] = useState<number>(0);
    const [searchQueryDiscussion, setSearchQueryDiscussion] = useState('');
    const [searchQueryReply, setSearchQueryReply] = useState('');
    const {data: replies = []} = useGetAdminRepliesQuery(selectedDiscussionId, {
        skip: selectedDiscussionId === 0,
        refetchOnMountOrArgChange: true
    });

    useEffect(() => {
        if (discussions.length > 0 && !selectedDiscussionId) {
            setSelectedDiscussionId(discussions[0].discussion_id);
        }
    }, [discussions]);

    const filteredDiscussions = useMemo(() => {
        if (!discussions) return [];
        return discussions.filter(res => {
            const searchLower = searchQueryDiscussion.toLowerCase();
            return res.title.toLowerCase().includes(searchLower)
        });
    }, [searchQueryDiscussion, discussions]);

    const filteredReplies = useMemo(() => {
        if (!replies) return [];
        return replies.filter(res => {
            const searchLower = searchQueryReply.toLowerCase();
            return res.content.toLowerCase().includes(searchLower)
        });
    }, [searchQueryReply, replies]);

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
        <div className="space-y-8">
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                        <MessageOutlined size={18} className="text-emerald-400" />
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Chọn bài đăng</h3>
                    </div>
                    <div className="relative group w-2/3 sm:w-80">
                        <SearchOutlined size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                        <input
                            type="text"
                            value={searchQueryDiscussion}
                            onChange={(e) => setSearchQueryDiscussion(e.target.value)}
                            placeholder="Tìm kiếm bài đăng"
                            className="w-full pl-11 pr-4 py-2.5 bg-[#0f131a]/60 text-gray-200 rounded-2xl border border-white/10 outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all placeholder-gray-600 shadow-inner text-sm"
                        />
                    </div>
                </div>

                <div className="max-h-[290px] overflow-y-auto pr-2">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredDiscussions.length > 0 ? (filteredDiscussions.map((dis) => (
                            <button
                                key={dis.discussion_id}
                                onClick={() => setSelectedDiscussionId(dis.discussion_id)}
                                className={`group relative flex flex-col p-4 rounded-3xl border transition-all duration-300 text-left overflow-hidden h-full ${
                                    selectedDiscussionId === dis.discussion_id
                                        ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/20'
                                        : 'bg-[#0f131a]/40 border-white/5 hover:border-white/20 hover:bg-[#1a202c]/40'
                                }`}
                            >
                                <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center transition-all duration-300 ${
                                    selectedDiscussionId === dis.discussion_id ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white/5 text-gray-500'
                                }`}>
                                    <MessageOutlined size={20} />
                                </div>
                                <span className={`text-sm font-bold tracking-tight line-clamp-1 ${selectedDiscussionId === dis.discussion_id ? 'text-emerald-400' : 'text-gray-300'}`}>
                    {dis.title}
                  </span>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] text-white font-bold uppercase">{dis.discussion_type}</span>
                                </div>
                            </button>
                        ))) : (
                            <td className="px-8 py-8 text-center">
                                <div className="flex flex-col items-center gap-3 opacity-20">
                                    <UnorderedListOutlined size={40} className="text-gray-400" />
                                    <p className="text-sm font-bold text-gray-300">Không có dữ liệu</p>
                                </div>
                            </td>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="relative space-y-4">
                {/* Unified Header & Search */}
                <div className="flex sm:flex-row justify-between items-end sm:items-center gap-4 px-2">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-6 bg-emerald-500 rounded-full" />
                        <h4 className="text-lg font-bold text-white tracking-tight">Danh sách phản hồi</h4>
                        <span className="text-xs text-gray-500 font-medium ml-2">({filteredReplies.length} kết quả)</span>
                    </div>

                    {/* Neat Compact Search Bar */}
                    <div className="relative group w-2/3 sm:w-80">
                        <SearchOutlined size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                        <input
                            type="text"
                            value={searchQueryReply}
                            onChange={(e) => setSearchQueryReply(e.target.value)}
                            placeholder="Tìm kiếm câu hỏi"
                            className="w-full pl-11 pr-4 py-2.5 bg-[#0f131a]/60 text-gray-200 rounded-2xl border border-white/10 outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all placeholder-gray-600 shadow-inner text-sm"
                        />
                    </div>
                </div>

                    {/* Table Container */}
                <div className="bg-[#1a202c]/60 backdrop-blur-xl rounded-4xl border border-white/5 shadow-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-[11px] text-gray-500 uppercase font-bold bg-black/20 tracking-wider">
                            <tr>
                                <th className="px-8 py-6">Nội dung phản hồi</th>
                                <th className="px-8 py-6">Người gửi / Bài viết</th>
                                <th className="px-8 py-6 text-center">Tương tác</th>
                                <th className="px-8 py-6 text-center">Ngày tạo</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                            {filteredReplies.length > 0 ? (
                                filteredReplies.map((fb) => (
                                    <tr key={fb.reply_id} className="group hover:bg-white/3 transition-colors duration-300">
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1 max-w-lg">
                                                <div className="p-3 bg-black/20 rounded-xl border border-white/5 group-hover:border-cyan-500/20 transition-all">
                                                    <p className="text-gray-300 text-sm leading-relaxed line-clamp-2 italic">
                                                        "{fb.content}"
                                                    </p>
                                                </div>
                                                <span className="text-[9px] text-gray-600 font-mono tracking-widest uppercase ml-1">{fb.reply_id}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2 text-gray-200 font-bold">
                                                    <UserOutlined size={14} className="text-gray-500" />
                                                    {fb.user.full_name}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                                    <FileTextOutlined size={12} className="text-gray-600" />
                                                    <span className="line-clamp-1 truncate max-w-[200px]">{fb.discussion.title}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs" title="Lượt thích">
                                                        <LikeOutlined size={14} className="opacity-70" />
                                                        {fb.upvotes}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-red-400 font-bold text-xs" title="Lượt không thích">
                                                        <DislikeOutlined size={14} className="opacity-70" />
                                                        {fb.downvotes}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <div className="flex items-center gap-1.5 text-gray-300 font-semibold text-[11px]">
                                                    <CalendarOutlined size={12} className="text-gray-500" />
                                                    {new Date(fb.created_at).toLocaleDateString('vi-VN')}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-8 py-24 text-center">
                                        <div className="flex flex-col items-center gap-3 opacity-20">
                                            <InfoCircleOutlined size={40} className="text-gray-400" />
                                            <p className="text-sm font-bold text-gray-300">Không tìm thấy phản hồi nào</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReplyTable