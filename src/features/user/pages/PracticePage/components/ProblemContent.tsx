import { Button, Divider, Tag, Tooltip } from "antd";
import {
    ClockCircleOutlined,
    CodeOutlined,
    CopyOutlined,
} from "@ant-design/icons";
import type { IProblem } from "../../../../../types/problem.types";

const ProblemContent = ({
    problem,
    diffStyle,
}: {
    problem: IProblem;
    diffStyle: { color: string; bg: string };
}) => {
    return (
        <div className="space-y-6 lg:col-span-8">
            {/* Header Section */}
            <div className="rounded-3xl border border-white/5 bg-[#0a1916] p-8 shadow-xl">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span
                        className="rounded-lg border border-white/5 px-3 py-1 text-xs font-bold tracking-wider"
                        style={{ color: diffStyle.color, backgroundColor: diffStyle.bg }}
                    >
                        {problem.difficulty}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <ClockCircleOutlined />
                        <span>
                            Cập nhật: {new Date(problem.updated_at).toLocaleDateString("vi-VN")}
                        </span>
                    </div>
                </div>

                <h1 className="mb-6 text-3xl font-extrabold leading-tight text-white md:text-4xl">
                    {problem.title}
                </h1>

                <div className="flex flex-wrap gap-2">
                    {problem.tags?.map((tag) => (
                        <Tag
                            key={tag.tag_id}
                            className="m-0 cursor-pointer border-0 px-3 py-1.5 text-sm transition-opacity hover:opacity-80"
                            style={{ color: tag.color, backgroundColor: `${tag.color}15` }}
                        >
                            #{tag.name}
                        </Tag>
                    ))}
                </div>
            </div>

            {/* Description Body */}
            <div className="rounded-3xl border border-white/5 bg-[#0a1916] p-8 shadow-xl">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-emerald-400">
                    <CodeOutlined /> Mô tả bài toán
                </h2>

                <div
                    className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300 prose-pre:border prose-pre:border-white/10 prose-pre:bg-black/30"
                    dangerouslySetInnerHTML={{ __html: problem.description || "" }}
                />

                <Divider className="my-8 border-white/10" />

                {/* Input/Output Format */}
                <div className="mb-8 grid gap-6 md:grid-cols-2">
                    <div>
                        <h3 className="mb-3 border-l-4 border-emerald-500 pl-3 font-bold text-white">
                            Input Format
                        </h3>
                        <div className="rounded-xl border border-white/5 bg-black/20 p-4 font-mono text-sm text-gray-300">
                            {problem.input_format}
                        </div>
                    </div>
                    <div>
                        <h3 className="mb-3 border-l-4 border-emerald-500 pl-3 font-bold text-white">
                            Output Format
                        </h3>
                        <div className="rounded-xl border border-white/5 bg-black/20 p-4 font-mono text-sm text-gray-300">
                            {problem.output_format}
                        </div>
                    </div>
                </div>

                {/* Constraints */}
                {problem.constraints && (
                    <div className="mb-8">
                        <h3 className="mb-3 border-l-4 border-yellow-500 pl-3 font-bold text-white">
                            Ràng buộc
                        </h3>
                        <div className="rounded-xl border border-yellow-500/10 bg-yellow-500/5 p-4 font-mono text-sm text-yellow-200/80">
                            {problem.constraints}
                        </div>
                    </div>
                )}

                {/* Samples */}
                <div>
                    <h3 className="mb-4 border-l-4 border-blue-500 pl-3 font-bold text-white">
                        Ví dụ mẫu
                    </h3>
                    <div className="space-y-4">
                        {problem.samples?.map((sample, idx) => (
                            <div
                                key={idx}
                                className="overflow-hidden rounded-xl border border-white/10 bg-black/20"
                            >
                                <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-4 py-2">
                                    <span className="text-xs font-bold text-gray-400">
                                        TEST CASE #{idx + 1}
                                    </span>
                                    <Tooltip title="Sao chép Input">
                                        <Button
                                            type="text"
                                            size="small"
                                            icon={<CopyOutlined />}
                                            className="text-gray-500 hover:text-white"
                                            onClick={() => navigator.clipboard.writeText(sample.input)}
                                        />
                                    </Tooltip>
                                </div>
                                <div className="grid divide-y divide-white/10 md:grid-cols-2 md:divide-x md:divide-y-0">
                                    <div className="p-4">
                                        <div className="mb-2 text-[10px] font-bold uppercase text-gray-500">
                                            Input
                                        </div>
                                        <pre className="whitespace-pre-wrap font-mono text-sm text-gray-300">
                                            {sample.input}
                                        </pre>
                                    </div>
                                    <div className="p-4">
                                        <div className="mb-2 text-[10px] font-bold uppercase text-gray-500">
                                            Output
                                        </div>
                                        <pre className="whitespace-pre-wrap font-mono text-sm text-emerald-400">
                                            {sample.output}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProblemContent;