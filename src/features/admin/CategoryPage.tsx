import HeaderBar from "../../components/common/HeaderBar.tsx";
import SearchBar from "../../components/common/SearchBar.tsx";
import DataTable from "../../components/common/DataTable.tsx";
import {useState} from "react";
import CreateForm from "../../components/common/CreateForm.tsx";
import {Form, Input, Radio} from "antd";
import AddImage from "../../components/common/AddImage.tsx";
import icon from "../../assets/react.svg";
import type {ICategory} from "../../types/data.types.ts";
import EditForm from "../../components/common/EditForm.tsx";

const CategoryColumn = [
    {
        title: 'Ảnh',
        dataIndex: 'icon_url',
        width: '5%',
        render: () => {
            return(
                <div>
                    <img
                        src={icon}
                        alt={"icon"}
                    />
                </div>
            )
        }
    },
    {
        title: 'Mã chủ đề',
        dataIndex: 'category_id',
        width: '15%',
    },
    {
        title: 'Tên chủ đề',
        dataIndex: 'name',
        width: '30%',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'is_active',
        width: '15%',
    },
    {
        title: 'Ngày tạo',
        dataIndex: 'created_at',
        width: '15%',
    },
];

const originData = Array.from({ length: 100 }).map<ICategory>((_, i) => ({
    category_id: i.toString(),
    name: `Edward ${i}`,
    icon_url: icon,
    order_index: i,
    is_active: 1,
    created_at: new Date(),
}));

const CategoryPage = () => {
    const [data, setData] = useState<ICategory[]>(originData);
    const [create, setCreate] = useState(false);
    const [edit, setEdit] = useState(false);
    const [editing, setEditing] = useState<ICategory | undefined>(undefined);

    const handleEdit = (record: ICategory) => {
        setEditing(record);
        setEdit(true);
    }

    const handleSave =(value: ICategory, recordKey: string | number) => {
        const newData = data.map((item: ICategory) => {
            if (item.category_id === recordKey) {
                return {
                    ...item,
                    ...value,
                    category_id: recordKey,
                }
            }
            return item;
        });
        setData(newData);
    }

    const handleCancel = () => {
        setEditing(undefined);
        setEdit(false);
    }

    const handleDelete = (recordKey: string | number) => {
        const newData = data.filter((item: ICategory) => item.category_id !== recordKey);
        setData(newData);
    }

    return (
        <main className={"flex flex-col"}>
            <div className={"flex flex-col"}>
                <HeaderBar
                    title={"Danh sách các chủ đề"}
                    buttonText={"Thêm chủ đề"}
                    setOpen={() => {
                        setCreate(true)
                        console.log(open)
                    }}
                />

                <CreateForm<ICategory, 'category_id'>
                    open={create}
                    title={"Thêm chủ đề mới"}
                    key={"category_id"}
                    onClose={() => setCreate(false)}
                >
                    <Form.Item name={"icon"} label={"Ảnh"}>
                        <AddImage/>
                    </Form.Item>
                    <Form.Item
                        name={"title"}
                        label={"Tên chủ đề"}
                        rules={[{required: true, message: 'Hãy thêm tên chủ đề'}]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name={"status"} label={"Trạng thái"}>
                        <Radio.Group>
                            <Radio value={1}>Công khai</Radio>
                            <Radio value={0}>Riêng tư</Radio>
                        </Radio.Group>
                    </Form.Item>
                </CreateForm>

                <EditForm<ICategory, 'category_id'>
                    open={edit}
                    title={"Thêm chủ đề mới"}
                    recordKey={"category_id"}
                    onSave={handleSave}
                    onClose={handleCancel}
                    initialData={editing}
                >
                    {/*<Form.Item name={"icon"} label={"Ảnh"}>
                        <AddImage/>
                    </Form.Item>*/}
                    <Form.Item
                        name={"category_id"}
                        label={"Mã chủ đề"}
                        rules={[{required: true, message: 'Hãy thêm tên chủ đề'}]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name={"name"}
                        label={"Tên chủ đề"}
                        rules={[{required: true, message: 'Hãy thêm tên chủ đề'}]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name={"is_active"} label={"Trạng thái"}>
                        <Radio.Group>
                            <Radio value={1}>Công khai</Radio>
                            <Radio value={0}>Riêng tư</Radio>
                        </Radio.Group>
                    </Form.Item>
                </EditForm>

                <SearchBar/>
            </div>

            <DataTable<ICategory, 'category_id'>
                columnConfig={CategoryColumn}
                recordKey={"category_id"}
                tableData={data}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </main>
    )
};

export default CategoryPage;