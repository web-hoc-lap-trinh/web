import { Button, Flex, Space, Typography, Layout, Card } from "antd";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;

const AdminPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <Layout style={{ minHeight: "60vh", background: "#f5f5f5" }}>
      <Content style={{ padding: 32, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Card style={{ width: 420 }} bordered>
          <Space direction="vertical" align="center" style={{ width: "100%" }} size="large">
            <Typography.Title level={3} style={{ marginBottom: 0 }}>
              Chào mừng Admin 🎉
            </Typography.Title>
            <Typography.Text type="secondary">
              Xin chào, {user?.full_name || user?.email || user?.role || "Admin"}
            </Typography.Text>
            <Button type="primary" danger onClick={handleLogout} style={{ width: "100%" }}>
              Đăng xuất
            </Button>
          </Space>
        </Card>
      </Content>
    </Layout>
  );
};

export default AdminPage;