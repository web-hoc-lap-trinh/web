import HeaderBar from "../../components/common/HeaderBar.tsx";
import {useState} from "react";
import CreateForm from "../../components/common/CreateForm.tsx";
import {Form, Input, Radio} from "antd";
import SearchBar from "../../components/common/SearchBar.tsx";
import DataTable from "../../components/common/DataTable.tsx";
import type {IExercise} from "../../types/data.types.ts";
import EditForm from "../../components/common/EditForm.tsx";

const ExerciseColunn = [
    {
        title: "Mã bài tập",
        dataIndex: "exercise_id",
        width: '10%'
    },
    {
        title: "Tên bài tập",
        dataIndex: "title",
        width: '20%'
    },
    {
        title: "Mô tả",
        dataIndex: "description",
        width: '20%'
    },
    {
        title: "Loại bài tập",
        dataIndex: "exercise_type",
        width: '10%'
    },
    {
        title: "Ngày tạo",
        dataIndex: "created_at",
        width: '10%'
    }
]

const originData: IExercise[] = [
    {
        exercise_id: "E2001",
        title: "Điền vào chỗ trống: Khai báo biến trong JavaScript",
        description: "Điền từ khóa thích hợp vào chỗ trống để khai báo một biến có phạm vi khối (block scope).",
        exercise_type: "fill_black", // Bài tập điền vào chỗ trống
        hints: "Từ khóa bắt đầu bằng chữ 'l'.",
        explanation: "Từ khóa 'let' được sử dụng để khai báo biến có phạm vi khối trong JavaScript, khác với 'var' có phạm vi hàm.",
        created_at: new Date("2025-10-01T08:00:00Z"),
    },
    {
        exercise_id: "E2002",
        title: "Sửa lỗi: Vòng lặp vô hạn",
        description: "Đoạn code dưới đây gây ra vòng lặp vô hạn. Hãy sửa lại điều kiện của vòng lặp.",
        exercise_type: "fix_code", // Bài tập sửa lỗi code
        hints: "Kiểm tra điều kiện thoát. Biến `i` cần phải tăng lên.",
        explanation: "Cần thêm `i++` vào trong vòng lặp hoặc thay đổi điều kiện `i < 10` thành điều kiện có thể đạt được trạng thái dừng.",
        created_at: new Date("2025-10-05T14:30:00Z"),
    },
    {
        exercise_id: "E2003",
        title: "Trắc nghiệm: Kết quả của phép toán Bitwise",
        description: "Kết quả của biểu thức `5 & 1` trong JavaScript là gì?",
        exercise_type: "multiple_choice", // Bài tập trắc nghiệm
        hints: "Chuyển cả hai số về hệ nhị phân trước khi thực hiện phép toán AND.",
        explanation: "Trong nhị phân: 5 là `101`, 1 là `001`. `101 & 001` bằng `001`, tức là 1.",
        created_at: new Date("2025-10-10T10:15:00Z"),
    },
    {
        exercise_id: "E2004",
        title: "Thực hành Code: Hàm tìm số lớn nhất",
        description: "Viết một hàm JavaScript nhận vào một mảng số nguyên và trả về số nguyên lớn nhất trong mảng đó.",
        exercise_type: "coding", // Bài tập lập trình
        hints: "Sử dụng `Math.max` hoặc lặp qua mảng và so sánh.",
        explanation: "Sử dụng toán tử spread (`...`) với `Math.max` là cách ngắn gọn nhất, ví dụ: `Math.max(...arr)`. Hoặc khởi tạo biến `max` và cập nhật nó trong vòng lặp.",
        created_at: new Date("2025-10-15T16:00:00Z"),
    },
];

const ExercisePage = () => {
    const [data, setData] = useState<IExercise[]>(originData);
    const [create, setCreate] = useState(false);
    const [edit, setEdit] = useState(false);
    const [editing, setEditing] = useState<IExercise | undefined>(undefined);

    const handleEdit = (record: IExercise) => {
        setEditing(record);
        setEdit(true)
    }

    const handleSave =(value: IExercise, recordId: string | number) => {
        const newData = data.map((item: IExercise) => {
            if (item.exercise_id === recordId) {
                return {
                    ...item,
                    ...value,
                    category_id: recordId,
                }
            }
            return item;
        });
        console.log(newData);
        setData(newData);
    }

    const handleCancel = () => {
        setEditing(undefined);
        setEdit(false);
    }

    const handleDelete = (recordKey: string | number) => {
        const newData = data.filter((item: IExercise) => item.exercise_id !== recordKey);
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

                <CreateForm<IExercise, 'exercise_id'>
                    open={create}
                    title={"Thêm chủ đề mới"}
                    key={'exercise_id'}
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

                <EditForm<IExercise, 'exercise_id'>
                    open={edit}
                    title={"Thêm chủ đề mới"}
                    recordKey={"exercise_id"}
                    onSave={handleSave}
                    onClose={handleCancel}
                    initialData={editing}
                >
                    <Form.Item
                        name={"exercise_id"}
                        label={"Mã bài tập"}
                        rules={[{required: true, message: 'Hãy thêm tên chủ đề'}]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name={"title"}
                        label={"Tên bài tập"}
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

            <DataTable<IExercise, 'exercise_id'>
                columnConfig={ExerciseColunn}
                recordKey={'exercise_id'}
                tableData={data}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </main>
    )
}

export default ExercisePage