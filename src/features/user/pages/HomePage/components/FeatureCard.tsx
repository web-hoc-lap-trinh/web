import { Typography, Tag } from "antd";

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    tag?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, tag }) => {
    return (
        <div className="group relative p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
            <div className="absolute top-4 right-4">
                {tag && <Tag color="green" className="m-0 border-0 bg-emerald-500/20 text-emerald-400">{tag}</Tag>}
            </div>
            <div className="w-12 h-12 rounded-lg bg-emerald-900/30 flex items-center justify-center text-2xl text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <Typography.Title level={4} className="text-white! mb-2! group-hover:text-emerald-300! transition-colors">
                {title}
            </Typography.Title>
            <p className="text-gray-400 text-sm leading-relaxed">
                {description}
            </p>
        </div>
    );
};

export default FeatureCard;