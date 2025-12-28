import {Typography, Button} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {useLocation} from "react-router-dom";

const {Title} = Typography;

interface HeaderProps {
    title: string;
    buttonText?: string;
    setOpen?: () => void;
}

const HeaderBar = ({title, buttonText, setOpen}: HeaderProps) => {
    const location = useLocation();
    const hiddenRoutes = ["/admin/dashboard", "/admin/discussion", "/admin/reply", "/admin/user", "/admin/tag"];
    const shouldShowButton = !hiddenRoutes.includes(location.pathname);

    return (
        <header className="px-10 py-8 flex justify-between items-center z-10">
            <div className={"flex-1/2"}>
                <Title level={2} className="text-emerald-600! font-bold!">
                    {title}
                </Title>
            </div>
            <div className={"flex"}>
                {shouldShowButton && <Button type={'primary'}
                         shape={'default'}
                         icon={<PlusOutlined/>}
                         iconPosition={'end'}
                         onClick={setOpen}
                         className="bg-emerald-600! hover:bg-emerald-500! border-0 font-semibold shadow-lg shadow-emerald-900/40"
                >
                    {buttonText}
                </Button>}
            </div>
        </header>
    )
}

export default HeaderBar