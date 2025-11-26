import { Button, Flex, Space, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface IntroCardProps {
    title: string;
    description: string;
    illustration: string;
}

const IntroCard = ({ title, description, illustration }: IntroCardProps) => {
    return (
        <div className="min-h-full w-1/2 p-10">
            <div className="min-h-full max-w-full bg-primary-100 rounded-4xl">
                <header className="font-bold text-3xl text-center py-4">
                    {title}
                </header>
                <div className={"flex items-center justify-center"}>
                    <div className="text-2xl w-1/2 ml-8">
                        {description}
                    </div>
                    <div className="max-w-1/2">
                        <img
                            src={illustration}
                            className={"w-1/2"}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

const UserPage = () => {
    return (
        <main className="min-h-screen bg-white">
            <div className="max-w-screen bg-primary-200 flex flex-col items-center justify-between">
                <header className="font-bold text-4xl p-24">
                    Codery - Sẵn sàng code
                </header>
                <div className="w-1/3 text-2xl text-center p-8">
                    Codery là nền tảng đáng tịn cậy hỗ trợ tự học ngôn ngữ lập trình,
                    cấu trúc dữ liệu và giải thuật bằng phương pháp hiện đại với tính
                    cộng đồng cao.
                </div>
            </div>

            <div className="h-96 max-w-screen my-5 flex flex-row">
                <IntroCard
                    title ={"Học liệu tương tác"}
                    description ={"Hỗ trợ việc tự học các ngôn ngữ lập trình, framework thông qua nguồn tài liệu phong phú, cung cấp đầy đủ kiến thức từ cơ bản đến nâng cao; tích hợp khả năng thực hành trực quan ngay trong bài học."}
                    illustration={"src/assets/images/freepik-document.png"}
                />
                <IntroCard
                    title={"Cấu trúc dữ liệu & giải thuật"}
                    description={"Cung cấp kho bài tập đồ sộ, trải rộng các mức độ từ dễ đến khó với đa dạng các ngôn ngữ được hỗ trợ."}
                    illustration={"src/assets/images/freepik-computer.png"}
                />
            </div>

            <div className="h-96 max-w-screen my-5 flex flex-row">
                <IntroCard
                    title={"Cộng đồng hỗ trợ"}
                    description={"Mỗi nội dung học, mỗi bài tập là 1 chủ đề để tất cả mọi người có thể trao đổi các câu hỏi, hỗ trợ lẫn nhau trong quá trình học."}
                    illustration={"src/assets/images/freepik-chat.png"}
                />
                <IntroCard
                    title={"Gamification"}
                    description={"Giúp việc học không còn nhàm chán với hệ thống nhiệm vụ hằng ngày, xếp hạng cá nhân nhằm tạo động lực hiệu quả."}
                    illustration={"src/assets/images/freepik-target.png"}
                />
            </div>
        </main>
    )
};

export default UserPage;