import { useEffect, useMemo, useState } from "react";
import { Empty, Pagination, Skeleton } from "antd";
import { useGetProblemsQuery } from "../../../../services/problem/problem.service";
import type { Difficulty, IProblem, ProblemListQuery } from "../../../../types/problem.types";
import ProblemFilters from "./components/ProblemFilters";
import ProblemCard from "./components/ProblemCard";
import { ConfigProvider, theme } from "antd";

const PAGE_SIZE = 10;

const PracticePage = () => {
    const [page, setPage] = useState(1);
    const [difficulty, setDifficulty] = useState<Difficulty | undefined>();
    const [sort, setSort] = useState<ProblemListQuery["sort"]>("created_at");
    const [order, setOrder] = useState<ProblemListQuery["order"]>("DESC");
    const [search, setSearch] = useState("");

    const queryParams = useMemo(
        () => ({
            page,
            limit: PAGE_SIZE,
            difficulty,
            sort,
            order,
            search: search.trim() || undefined,
        }),
        [page, difficulty, sort, order, search]
    );

    const { data, isLoading, isFetching } = useGetProblemsQuery(queryParams);

    useEffect(() => {
        setPage(1);
    }, [difficulty, sort, order, search]);

    const problems: IProblem[] = data?.items || [];
    const total = data?.total || 0;

    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                    colorPrimary: "#10b981",
                    colorBgContainer: "#0a1916",
                    colorBorder: "rgba(255, 255, 255, 0.1)",
                },
            }}
        >
            <div className="min-h-screen bg-[#030e0c] text-white pt-20 pb-16 font-sans">
                <div className="container mx-auto px-4 max-w-7xl">
                    <header className="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-[#064e3b] via-[#022c22] to-[#030e0c] p-8 shadow-2xl shadow-emerald-900/40 mb-8">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 mb-2">
                            Kho Luyện Tập
                        </p>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                            Thử thách thuật toán
                        </h1>
                        <p className="text-gray-300 max-w-xl text-lg leading-relaxed">
                            Hơn {total > 0 ? total : "..."} bài tập từ cơ bản đến nâng cao.
                            Chinh phục các thử thách để nâng cao tư duy lập trình của bạn ngay hôm nay.
                        </p>
                    </header>

                    <ProblemFilters
                        search={search}
                        onSearch={setSearch}
                        difficulty={difficulty}
                        onDifficultyChange={setDifficulty}
                        sort={sort}
                        order={order}
                        onSortChange={setSort}
                        onOrderChange={setOrder}
                    />

                    <div className="mt-6">
                        {isLoading ? (
                            <div className="grid gap-4">
                                {Array.from({ length: 5 }).map((_, idx) => (
                                    <Skeleton
                                        key={idx}
                                        active
                                        avatar={{ shape: "square" }}
                                        paragraph={{ rows: 2 }}
                                        className="p-4 rounded-2xl bg-white/5"
                                    />
                                ))}
                            </div>
                        ) : problems.length === 0 ? (
                            <div className="py-20 flex flex-col items-center justify-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description={<span className="text-gray-400 text-lg">Không tìm thấy bài tập phù hợp</span>}
                                />
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {problems.map((problem) => (
                                    <ProblemCard
                                        key={problem.problem_id}
                                        problem={problem}
                                        loading={isFetching}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {total > PAGE_SIZE && (
                        <div className="flex justify-center mt-8">
                            <Pagination
                                current={page}
                                pageSize={PAGE_SIZE}
                                total={total}
                                onChange={setPage}
                                showSizeChanger={false}
                                className="custom-pagination"
                            />
                        </div>
                    )}
                </div>
            </div>
        </ConfigProvider>
    );
};

export default PracticePage;
