import { useParams, useNavigate } from "react-router-dom";
import { useGetProblemQuery } from "../../../../services/problem/problem.service";
import {  Button, Breadcrumb } from "antd";
import { 
  ArrowLeftOutlined, 
  HomeOutlined
} from "@ant-design/icons";
import { ConfigProvider, theme } from "antd";
import ProblemContent from "../PracticePage/components/ProblemContent";
import ProblemSidebar from "../PracticePage/components/ProblemSidebar";
import ProblemSkeleton from "../PracticePage/components/ProblemSkeleton";
import ProblemNotFound from "../PracticePage/components/ProblemNotFound";

const ProblemDetailPage = () => {
  const params = useParams();
  const idParam = (params as any).id ?? (params as any).problemId;
  const navigate = useNavigate();

  const {
    data: problem,
    isLoading,
    isError,
  } = useGetProblemQuery(Number(idParam));

  const handleBack = () => navigate("/problems");

  const getDifficultyColor = (diff?: string) => {
    switch (diff) {
      case "EASY":
        return { color: "#10b981", bg: "#064e3b" }; // Emerald
      case "MEDIUM":
        return { color: "#f59e0b", bg: "#451a03" }; // Amber
      case "HARD":
        return { color: "#f43f5e", bg: "#881337" }; // Rose
      default:
        return { color: "#9ca3af", bg: "#374151" };
    }
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#10b981", // Emerald-500
          colorBgContainer: "#0a1916",
        },
      }}
    >
      <div className="min-h-screen bg-[#030e0c] pt-20 pb-12 font-sans text-white">
        {isLoading ? (
          <ProblemSkeleton />
        ) : isError || !problem ? (
          <ProblemNotFound onBack={handleBack} />
        ) : (
          <div className="container mx-auto max-w-7xl px-4">
            {/* Navigation */}
            <div className="mb-6 flex items-center justify-between">
              <Breadcrumb
                items={[
                  {
                    href: "/",
                    title: <HomeOutlined className="text-gray-400" />,
                  },
                  {
                    title: (
                      <span
                        className="cursor-pointer text-gray-400 hover:text-white"
                        onClick={handleBack}
                      >
                        Luyện tập
                      </span>
                    ),
                  },
                  {
                    title: (
                      <span className="font-medium text-white">
                        {problem.title}
                      </span>
                    ),
                  },
                ]}
              />
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={handleBack}
                className="text-gray-400 hover:text-white"
              >
                Quay lại
              </Button>
            </div>

            {/* Main Grid */}
            <div className="grid gap-8 grid-cols-1 lg:grid-cols-12">
              <ProblemContent
                problem={problem}
                diffStyle={getDifficultyColor(problem.difficulty)}
              />
              <ProblemSidebar problem={problem} />
            </div>
          </div>
        )}
      </div>
    </ConfigProvider>
  );
};

export default ProblemDetailPage;