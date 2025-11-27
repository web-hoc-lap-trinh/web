import {Typography, Button} from "antd";
import {PlusOutlined} from "@ant-design/icons";

const {Title} = Typography;

interface HeaderProps {
    title: string;
    buttonText: string;
}

const HeaderBar = ({title, buttonText}: HeaderProps) => {
    return (
        <header className={"min-w-full flex pb-8"}>
            <div className={"flex-1/2"}>
                <Title level={2} style={{color: 'white'}}>
                    {title}
                </Title>
            </div>
            <div className={"flex"}>
                <Button type={'primary'} shape={'default'} icon={<PlusOutlined/>} iconPosition={'end'}>
                    {buttonText}
                </Button>
            </div>
        </header>
    )
}

export default HeaderBar