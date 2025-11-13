import { Outlet } from "react-router-dom";
/*import backgroundImage from "./assets/images/background.png";
import backgroundImage2 from "./assets/images/background2.jpg";
const HEADER_HEIGHT = 68;*/

const Layout = () => {
    return (
        <div className="bg-primary-300">
            <Outlet/>
        </div>
    );
};

export default Layout;
export { Layout };