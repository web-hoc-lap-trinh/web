import { Typography, Table, Tag } from "antd";
import { HistoryOutlined, CheckCircleFilled, CloseCircleFilled, ClockCircleOutlined } from "@ant-design/icons";

type Submission = {
	key: string;
	problem: string;
	status: "Accepted" | "Wrong Answer" | "Time Limit Exceeded";
	lang: string;
	runtime: string;
	date: string;
};

export default function SubmissionHistoryTab({ submissions }: { submissions: Submission[] }) {
	const columns = [
		{
			title: "Bài tập",
			dataIndex: "problem",
			key: "problem",
			render: (text: string) => (
				<span className="text-white font-medium hover:text-emerald-400 cursor-pointer transition-colors">{text}</span>
			),
		},
		{
			title: "Trạng thái",
			dataIndex: "status",
			key: "status",
			render: (status: string) => {
				let color: "success" | "error" | "warning" | "default" = "default";
				let icon: React.ReactNode = <ClockCircleOutlined />;
				if (status === "Accepted") {
					color = "success";
					icon = <CheckCircleFilled />;
				} else if (status === "Wrong Answer") {
					color = "error";
					icon = <CloseCircleFilled />;
				} else {
					color = "warning";
				}
				return (
					<Tag color={color} className="py-1 px-2 rounded-md border-0 flex items-center gap-1 w-fit">
						{icon} <span className="font-semibold">{status}</span>
					</Tag>
				);
			},
		},
		{
			title: "Ngôn ngữ",
			dataIndex: "lang",
			key: "lang",
			render: (text: string) => (
				<span className="text-gray-400 font-mono text-xs bg-white/10 px-2 py-1 rounded">{text}</span>
			),
		},
		{
			title: "Thời gian chạy",
			dataIndex: "runtime",
			key: "runtime",
			render: (text: string) => <span className="text-gray-400">{text}</span>,
		},
		{
			title: "Ngày nộp",
			dataIndex: "date",
			key: "date",
			render: (text: string) => <span className="text-gray-500 text-sm">{text}</span>,
		},
	];

	return (
		<div className="bg-white/5 border border-white/10 rounded-2xl p-6 overflow-hidden animate-fade-in">
			<div className="flex justify-between items-center mb-6">
				<Typography.Title level={4} className="!text-white !m-0 flex items-center gap-2">
					<HistoryOutlined className="text-emerald-400" /> Lịch sử nộp bài
				</Typography.Title>
				<div className="text-gray-400 text-sm">
					Tổng số bài đã nộp: <span className="text-white font-bold">{submissions.length}</span>
				</div>
			</div>

			<Table
				columns={columns}
				dataSource={submissions}
				pagination={{ pageSize: 10, position: ["bottomCenter"] }}
				className="ant-table-custom"
			/>
		</div>
	);
}

