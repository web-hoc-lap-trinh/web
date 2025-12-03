import { useState } from "react";
import { ConfigProvider, theme } from "antd";

// Import các components con
import NavigationBar from "./components/NavigationBar";
import ProfileTab from "./components/ProfileTab";
import SubmissionHistoryTab from "./components/SubmissionHistoryTab";

// --- THEME CONFIG (Emerald Dark) ---
const THEME_COLOR = "#34D399";
const BG_DARK = "#051311";
const BG_GLASS = "rgba(255, 255, 255, 0.05)";

// --- MOCK DATA ---
const submissionData = [
    { key: '1', problem: 'Two Sum', status: 'Accepted', lang: 'JavaScript', runtime: '52 ms', date: '2024-05-20 14:30' },
    { key: '2', problem: 'Add Two Numbers', status: 'Wrong Answer', lang: 'Python3', runtime: 'N/A', date: '2024-05-19 09:15' },
    { key: '3', problem: 'Longest Palindromic Substring', status: 'Accepted', lang: 'C++', runtime: '12 ms', date: '2024-05-18 20:00' },
    { key: '4', problem: 'Valid Parentheses', status: 'Accepted', lang: 'JavaScript', runtime: '60 ms', date: '2024-05-10 08:45' },
    { key: '5', problem: 'Median of Two Sorted Arrays', status: 'Time Limit Exceeded', lang: 'Java', runtime: 'N/A', date: '2024-05-15 11:22' },
] as const;

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState<"profile" | "submissions">("profile");

    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                    colorPrimary: THEME_COLOR,
                    colorBgContainer: BG_GLASS,
                    borderRadius: 12,
                    fontFamily: "'Inter', sans-serif",
                },
                components: {
                    Table: {
                        colorBgContainer: 'transparent', // Để table trong suốt hòa vào nền
                        headerBg: 'rgba(255, 255, 255, 0.05)',
                        headerColor: '#9CA3AF',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        rowHoverBg: 'rgba(52, 211, 153, 0.05)',
                    },
                    Input: {
                        colorBgContainer: 'rgba(255, 255, 255, 0.05)',
                        activeBorderColor: THEME_COLOR,
                    }
                }
            }}
        >
            <div className="min-h-screen pt-24 pb-12 px-4 font-sans text-white" style={{ backgroundColor: BG_DARK }}>
                <div className="container mx-auto max-w-7xl">
                    {/* --- LAYOUT CONTAINER (Grid) --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                        {/* --- LEFT COLUMN: NAVIGATION (1/4 Width) --- */}
                        <aside className="w-full lg:col-span-1 sticky top-24 z-10">
                            <NavigationBar 
                                activeTab={activeTab} 
                                setActiveTab={setActiveTab} 
                            />
                        </aside>

                        {/* --- RIGHT COLUMN: CONTENT (3/4 Width) --- */}
                        <main className="w-full lg:col-span-3">
                            {/* Render có điều kiện dựa trên tab đang chọn */}
                            {activeTab === "profile" ? (
                                <ProfileTab />
                            ) : (
                                <SubmissionHistoryTab submissions={[...submissionData]} />
                            )}
                        </main>

                    </div>
                </div>
            </div>
        </ConfigProvider>
    );
};

export default ProfilePage;