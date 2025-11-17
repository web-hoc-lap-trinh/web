import { Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useGetMeQuery } from "../../services/auth/auth.service";
import { Spin } from "antd";

const AuthLoader = () => {
  const { token } = useAuth();

  const { isLoading } = useGetMeQuery(undefined, {
    skip: !token,
  });

  if (isLoading) {
    return <Spin tip="Đang xác thực, vui lòng chờ..." />;
  }

  return <Outlet />;
};

export default AuthLoader;