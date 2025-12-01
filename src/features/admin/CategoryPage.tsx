import HeaderBar from "../../components/common/HeaderBar.tsx";
import SearchBar from "../../components/common/SearchBar.tsx";
import DataTable from "../../components/common/TableInfo.tsx";
import {useState} from "react";
import CreateForm from "../../components/common/CreateForm.tsx";
import {Form, Input, Radio} from "antd";
import AddImage from "../../components/common/AddImage.tsx";

const CategoryPage = () => {
    const [open, setOpen] = useState(false);

    return (
        <main className={"flex flex-col"}>
            <div className={"flex flex-col"}>
                <HeaderBar
                    title={"Danh sách các chủ đề"}
                    buttonText={"Thêm chủ đề"}
                    setOpen={() => {
                        setOpen(true)
                        console.log(open)
                    }}
                />
                <CreateForm
                    open={open}
                    title={"Thêm chủ đề mới"}
                    onClose={() => setOpen(false)}
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
                            <Radio value="1">Công khai</Radio>
                            <Radio value="0">Riêng tư</Radio>
                        </Radio.Group>
                    </Form.Item>
                </CreateForm>
                <SearchBar/>
            </div>
            <div>Category</div>
            <DataTable/>
        </main>
    )
};

export default CategoryPage;