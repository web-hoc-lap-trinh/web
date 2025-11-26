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
import {useNavigate} from "react-router-dom";

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    {
        key: 'Dashboard',
        label: 'Báo cáo',
        icon: <DashboardOutlined />,
    },
    {
        key: 'Lesson',
        label: 'Quản lý bài học',
        type: 'group',
        children: [
            { key: 'Lesson1', label: 'Quản lý bài học', icon: <FileAddOutlined /> },
            { key: 'Lesson2', label: 'Quản lý chủ đề', icon: <FolderAddOutlined /> },
        ],
    },
    {
        key: 'Exercise',
        label: 'Quản lý bài tập & test case',
        type: 'group',
        children: [
            { key: 'Exercise1', label: 'Quản lý bài tập', icon: <FileOutlined/> },
            { key: 'Exercise2', label: 'Quản lý test case', icon: <FileDoneOutlined /> },
        ],
    },
    {
        key: 'Community',
        label: 'Quản lý cộng đồng',
        type: 'group',
        children: [
            { key: 'Community1', label: 'Quản lý bình luận', icon: <CommentOutlined /> },
            { key: 'Community2', label: 'Báo cáo vi phạm', icon: <WarningOutlined /> },
        ],
    },
    {
        key: 'Gamification',
        label: 'Quản lý gamification',
        type: 'group',
        children: [
            { key: 'Gamification1', label: 'Chuỗi & Huy hiệu', icon: <FireOutlined /> },
            { key: 'Gamification2', label: 'Nhiệm vụ hằng ngày', icon: <TrophyOutlined /> },
        ],
    },
    {
        key: 'User',
        label: 'Quản lý người dùng',
        type: 'group',
        children: [
            { key: 'User1', label: 'Danh sách người dùng', icon: <UserOutlined /> },
            { key: 'User2', label: 'Thông tin và phân quyền', icon: <KeyOutlined /> },
            { key: 'User3', label: 'Theo dõi tiến độ học tập', icon: <Loading3QuartersOutlined /> },
        ],
    },
];


const NavigationBar = () => {
    const navigate = useNavigate();

    const onClick: MenuProps['onClick'] = (e) => {

        console.log('click ', e);
        switch (e.key) {
            case 'Dashboard':
                navigate('/admin');
                break;
            case 'Lesson1':
                navigate('/admin/lesson');
                break;
            default:
                break;
        }
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
            defaultSelectedKeys={['Dashboard']}
            mode="inline"
            items={items}
        />
    );
}

export default NavigationBar;