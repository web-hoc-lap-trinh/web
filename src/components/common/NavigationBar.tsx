import {
    DashboardOutlined,
    FileAddOutlined,
    FolderAddOutlined,
    FileOutlined,
    FileDoneOutlined,
    CommentOutlined,
    WarningOutlined,
    FireOutlined,
    TrophyOutlined,
    UserOutlined,
    KeyOutlined,
    Loading3QuartersOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import {Menu} from 'antd';
import {useLocation, useNavigate} from "react-router-dom";

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    {
        key: 'dashboard',
        label: 'Báo cáo',
        icon: <DashboardOutlined />,
    },
    {
        key: 'Lesson',
        label: 'Quản lý bài học',
        type: 'group',
        children: [
            { key: 'lesson', label: 'Quản lý bài học', icon: <FileAddOutlined /> },
            { key: 'category', label: 'Quản lý chủ đề', icon: <FolderAddOutlined /> },
        ],
    },
    {
        key: 'Exercise',
        label: 'Quản lý bài tập & test case',
        type: 'group',
        children: [
            { key: 'exercise', label: 'Quản lý bài tập', icon: <FileOutlined/> },
            { key: 'testcase', label: 'Quản lý test case', icon: <FileDoneOutlined /> },
        ],
    },
    {
        key: 'Community',
        label: 'Quản lý cộng đồng',
        type: 'group',
        children: [
            { key: 'comment', label: 'Quản lý bình luận', icon: <CommentOutlined /> },
            { key: 'report', label: 'Báo cáo vi phạm', icon: <WarningOutlined /> },
        ],
    },
    {
        key: 'Gamification',
        label: 'Quản lý gamification',
        type: 'group',
        children: [
            { key: 'streak', label: 'Chuỗi & Huy hiệu', icon: <FireOutlined /> },
            { key: 'daily', label: 'Nhiệm vụ hằng ngày', icon: <TrophyOutlined /> },
        ],
    },
    {
        key: 'User',
        label: 'Quản lý người dùng',
        type: 'group',
        children: [
            { key: 'all-user', label: 'Danh sách người dùng', icon: <UserOutlined /> },
            { key: 'all-admin', label: 'Thông tin và phân quyền', icon: <KeyOutlined /> },
            { key: 'progress', label: 'Theo dõi tiến độ học tập', icon: <Loading3QuartersOutlined /> },
        ],
    },
];


const NavigationBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const pathSegments = location.pathname.split('/');
    const currentKey = pathSegments[pathSegments.length - 1] || 'dashboard';

    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e.key);
        navigate(`/admin/${e.key}`)
    };

    return (
        <Menu
            theme={'dark'}
            onClick={onClick}
            style={{
                width: 256,
                fontSize: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                borderRadius: 10,
                boxShadow: 'inherit'
            }}
            selectedKeys={[currentKey]}
            mode="inline"
            items={items}
        />
    );
}

export default NavigationBar;