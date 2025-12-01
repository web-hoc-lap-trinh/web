import {Typography} from "antd"

const {Title} = Typography;

const DashboardPage = () => {
    return (
        <main className={"flex flex-col"}>
            <div className={"flex pb-8"}>
                <Title level={2} style={{color: 'white'}}>
                    Tổng quan
                </Title>
            </div>
            <div>Dashboard</div>
        </main>
    )
};

export default DashboardPage;