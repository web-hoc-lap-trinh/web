import { Button, Flex, Space, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const UserPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <Flex vertical align="center" justify="center" style={{ minHeight: "60vh" }}>
      <Space direction="vertical" align="center">
        <Typography.Title level={2}>Chào mừng 🎉</Typography.Title>
        <Typography.Text>
          Xin chào, {user?.full_name || user?.email || "bạn"}
        </Typography.Text>
        <Button type="primary" onClick={onLogout}>Đăng xuất</Button>
      </Space>
    </Flex>
  );
};

export default UserPage;