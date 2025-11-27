import {DownOutlined} from '@ant-design/icons';
import type {MenuProps} from "antd";
import {Button, Dropdown, Input} from "antd";

const {Search} = Input;
const sortItems: MenuProps['items'] = [
    {
        key: 'public',
        label: 'Công khai'
    },
    {
        key: 'recently',
        label: 'Gần đây nhất'
    },
    {
        key: 'amount',
        label: 'Số lượng bài tập'
    }
]

const handleMenuClick: MenuProps['onClick'] = (e) => {
    console.log('click', e);
};

const menuProps = {
    items: sortItems,
    onClick: handleMenuClick
}

const SearchBar = () => {
    return (
        <main className={"min-w-full flex rounded-lg bg-primary-400 p-2 items-center"}>
            <div className={"flex-1/2"}>
                <Search placeholder={"Nhập tên chủ đề"}/>
            </div>
            <div className={"ps-4 pe-2"}>
                Sắp xếp:
            </div>
            <div>
                <Dropdown menu={menuProps}>
                    <Button icon={<DownOutlined />} iconPosition="end">
                        Button
                    </Button>
                </Dropdown>
            </div>
        </main>
    )
}

export default SearchBar;