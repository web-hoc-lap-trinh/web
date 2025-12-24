import { useEffect } from "react";
import { Table, Tag, Skeleton, Empty, ConfigProvider } from "antd";
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  ClockCircleOutlined, 
  SyncOutlined,
  ExclamationCircleOutlined 
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useGetMySubmissionsQuery, useGetSubmissionStatusQuery } from "../../../../services/submission/submission.service";
import { SubmissionStatus, type ISubmissionListItem } from "../../../../types/submission.types";

dayjs.extend(relativeTime);

const SubmissionStatusBadge = ({ 
  submission, 
  onFinished 
}: { 
  submission: ISubmissionListItem; 
  onFinished: () => void;
}) => {
  const isPending = submission.status === SubmissionStatus.PENDING || submission.status === SubmissionStatus.RUNNING;
  
  const { data: statusData } = useGetSubmissionStatusQuery(submission.submission_id, {
    pollingInterval: isPending ? 2000 : 0, 
    skip: !isPending, 
  });

  useEffect(() => {
    if (statusData && statusData.status !== SubmissionStatus.PENDING && statusData.status !== SubmissionStatus.RUNNING) {
      if (isPending) {
        onFinished(); 
      }
    }
  }, [statusData, isPending, onFinished]);

  const displayStatus = statusData?.status || submission.status;

  let color = "default";
  let icon = <ClockCircleOutlined />;
  let label = "Pending";

  switch (displayStatus) {
    case SubmissionStatus.ACCEPTED:
      color = "#10b981"; // Emerald
      icon = <CheckCircleOutlined />;
      label = "Accepted";
      break;
    case SubmissionStatus.WRONG_ANSWER:
      color = "#ef4444"; // Red
      icon = <CloseCircleOutlined />;
      label = "Wrong Answer";
      break;
    case SubmissionStatus.TIME_LIMIT:
      color = "#eab308"; // Yellow
      icon = <ClockCircleOutlined />;
      label = "Time Limit Exceeded";
      break;
    case SubmissionStatus.MEMORY_LIMIT:
        color = "#eab308";
        icon = <ExclamationCircleOutlined />;
        label = "Memory Limit Exceeded";
        break;
    case SubmissionStatus.COMPILE_ERROR:
    case SubmissionStatus.RUNTIME_ERROR:
      color = "#f97316"; // Orange
      icon = <ExclamationCircleOutlined />;
      label = "Runtime Error";
      break;
    case SubmissionStatus.PENDING:
    case SubmissionStatus.RUNNING:
      color = "processing";
      icon = <SyncOutlined spin />;
      label = "Judging...";
      break;
  }

  return (
    <Tag 
        icon={icon} 
        style={{ 
            color: displayStatus === 'PENDING' || displayStatus === 'RUNNING' ? undefined : color, 
            borderColor: displayStatus === 'PENDING' || displayStatus === 'RUNNING' ? undefined : `${color}40`,
            backgroundColor: displayStatus === 'PENDING' || displayStatus === 'RUNNING' ? undefined : `${color}10`,
        }}
        className={`border-0 px-2 py-1 flex w-fit items-center gap-1 font-semibold ${displayStatus === 'PENDING' || displayStatus === 'RUNNING' ? 'text-blue-400 bg-blue-500/10' : ''}`}
    >
      {label}
    </Tag>
  );
};

const SubmissionHistory = ({ problemId }: { problemId: number }) => {
  const { data, isLoading, refetch } = useGetMySubmissionsQuery({ 
    problem_id: problemId, 
    limit: 20 
  });

  if (isLoading) return <div className="p-4"><Skeleton active paragraph={{ rows: 5 }} /></div>;

  if (!data || data.submissions.length === 0) {
    return (
        <div className="h-full flex flex-col items-center justify-center text-gray-500 p-8">
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có bài nộp nào" />
        </div>
    );
  }

  const columns = [
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_: any, record: ISubmissionListItem) => (
        <SubmissionStatusBadge 
            submission={record} 
            onFinished={() => refetch()}
        />
      ),
    },
    {
      title: 'Ngôn ngữ',
      dataIndex: 'language',
      key: 'language',
      render: (text: string) => <span className="text-gray-300 font-mono text-xs bg-white/5 px-2 py-1 rounded">{text}</span>,
    },
    {
      title: 'Thời gian',
      key: 'runtime',
      render: (_: any, record: ISubmissionListItem) => (
        <span className="text-gray-400 text-xs">
            {record.execution_time > 0 ? `${record.execution_time} ms` : '-'}
        </span>
      ),
    },
    {
      title: 'Nộp lúc',
      dataIndex: 'submitted_at',
      key: 'submitted_at',
      render: (date: string) => (
        <span className="text-gray-500 text-xs" title={new Date(date).toLocaleString()}>
            {dayjs(date).fromNow()}
        </span>
      ),
    },
  ];

  return (
    <ConfigProvider
        theme={{
            components: {
                Table: {
                    headerBg: '#1f1f1f',
                    headerColor: '#a3a3a3',
                    rowHoverBg: '#2a2a2a',
                    borderColor: '#303030',
                    colorText: '#e5e5e5'
                }
            }
        }}
    >
        <div className="h-full overflow-auto">
            <Table
                dataSource={data.submissions}
                columns={columns}
                rowKey="submission_id"
                pagination={false}
                size="small"
                className="bg-transparent [&_.ant-table]:bg-transparent [&_.ant-table-cell]:border-b-[#303030]!"
            />
        </div>
    </ConfigProvider>
  );
};

export default SubmissionHistory;