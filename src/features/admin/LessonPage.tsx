import HeaderBar from "../../components/common/HeaderBar.tsx";
import SearchBar from "../../components/common/SearchBar.tsx";
import CreateForm from "../../components/common/CreateForm.tsx";
import {Form, Input, Radio} from "antd";
import {useState} from "react";
import type {ILesson} from "../../types/data.types.ts";
import DataTable from "../../components/common/DataTable.tsx";
import EditForm from "../../components/common/EditForm.tsx";

const LessonColumn = [
    {
        title: "Mã bài học",
        dataIndex: "lesson_id",
        width: '10%'
    },
    {
        title: "Tên bài học",
        dataIndex: "title",
        width: '15%'
    },
    {
        title: "Mô tả",
        dataIndex: "description",
        width: '15%'
    },
    {
        title: "Mức độ",
        dataIndex: "difficulty_level",
        width: "10%"
    },
    {
        title: "Trạng thái",
        dataIndex: "is_published",
        width: "10%"
    },
    {
        title: "Ngày tạo",
        dataIndex: "created_at",
        width: "10%"
    }
]

const generateLessonData = (count: number): ILesson[] => {
    const data: ILesson[] = [];
    const titles = ["HTML & CSS", "JavaScript Basics", "React Components", "Node.js Server", "Database Queries"];

    for (let i = 1; i <= count; i++) {
        const isPublished = (i % 5 === 0) ? 0 : 1;

        data.push({
            lesson_id: `L${String(i).padStart(4, '0')}`,
            title: `${titles[i % titles.length]} - Part ${Math.floor(i / titles.length) + 1}`,
            description: `Mô tả ngắn gọn cho bài học số ${i}`,
            content: `Nội dung chi tiết của bài học số ${i}...`,
            difficulty_level: 'beginner',
            is_published: isPublished,
            view_count: isPublished ? Math.floor(Math.random() * 5000) : 0,
            created_at: new Date(Date.now() - i * 86400000), // Tạo lùi lại i ngày
            updated_at: new Date(Date.now() - Math.floor(i / 2) * 86400000),
        });
    }

    return data;
};

const originData = generateLessonData(50)

const LessonPage = () => {
    const [data, setData] = useState<ILesson[]>(originData);
    const [create, setCreate] = useState(false);
    const [edit, setEdit] = useState(false);
    const [editing, setEditing] = useState<ILesson | undefined>(undefined);

    const handleEdit = (record: ILesson) => {
        setEditing(record);
        setEdit(true);
    }

    const handleSave =(value: ILesson, recordId: string | number) => {
        const newData = data.map((item: ILesson) => {
            if (item.lesson_id === recordId) {
                return {
                    ...item,
                    ...value,
                    category_id: recordId,
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
        const newData = data.filter((item: ILesson) => item.lesson_id !== recordKey);
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

                <CreateForm<ILesson, 'lesson_id'>
                    open={create}
                    title={"Thêm chủ đề mới"}
                    key={'lesson_id'}
                    onClose={() => setCreate(false)}
                >
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

                <EditForm<ILesson, 'lesson_id'>
                    open={edit}
                    title={"Thêm chủ đề mới"}
                    recordKey={"lesson_id"}
                    onSave={handleSave}
                    onClose={handleCancel}
                    initialData={editing}
                >
                    <Form.Item
                        name={"lesson_id"}
                        label={"Mã bài học"}
                        rules={[{required: true, message: 'Hãy thêm tên chủ đề'}]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name={"title"}
                        label={"Tên bài học"}
                        rules={[{required: true, message: 'Hãy thêm tên chủ đề'}]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name={"description"}
                        label={"Mô tả"}
                        rules={[{required: true, message: 'Hãy thêm tên chủ đề'}]}
                    >
                        <Input />
                    </Form.Item>
                </EditForm>

                <SearchBar/>
            </div>

            <DataTable<ILesson, 'lesson_id'>
                columnConfig={LessonColumn}
                recordKey={'lesson_id'}
                tableData={data}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </main>
    )
};

export default LessonPage;