import { Outlet } from "react-router-dom";
import backgroundImage from "./assets/images/background.png";
const HEADER_HEIGHT = 68;

const Layout = () => {
  return (
    <>
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          paddingTop: HEADER_HEIGHT,
          top: 0,
          left: 0,
          right: 0,
        }}>
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
export { Layout };