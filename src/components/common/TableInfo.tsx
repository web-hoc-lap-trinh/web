import React, { useState } from 'react';
import type { TableProps } from 'antd';
import { Form, Input, InputNumber, Popconfirm, Table, Typography, Space } from 'antd';
import type {ICategory} from "../../types/data.types.ts";
import icon from "../../assets/react.svg";

const originData = Array.from({ length: 100 }).map<ICategory>((_, i) => ({
    category_id: i.toString(),
    name: `Edward ${i}`,
    icon_url: icon,
    order_index: i,
    is_active: 1,
    created_at: new Date(),
}));

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: ICategory;
    index: number;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
                                                                                editing,
                                                                                dataIndex,
                                                                                title,
                                                                                inputType,
                                                                                record,
                                                                                index,
                                                                                children,
                                                                                ...restProps
                                                                            }) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const DataTable = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState<ICategory[]>(originData);
    const [editingKey, setEditingKey] = useState('');

    const isEditing = (record: ICategory) => record.category_id === editingKey;

    const edit = (record: ICategory) => {
        // form.setFieldsValue({ name: '', age: '', address: '', ...record });
        setEditingKey(record.category_id);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key: React.Key) => {
        try {
            const row = (await form.validateFields()) as ICategory;

            const newData = [...data];
            const index = newData.findIndex((item) => key === item.category_id);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const handleDelete = (key: string) => {
        const newData = data.filter((item) => item.category_id !== key);
        setData(newData);
    };

    const columns = [
        {
            title: 'Ảnh',
            dataIndex: 'icon',
            width: '5%',
            editable: false,
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
            dataIndex: 'id',
            width: '15%',
            editable: false,
        },
        {
            title: 'Tên chủ đề',
            dataIndex: 'name',
            width: '30%',
            editable: true,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'created_at',
            width: '15%',
            editable: false,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'is_active',
            width: '15%',
            editable: true,
        },
        {
            title: 'Hành động',
            dataIndex: 'operation',
            render: (_: any, record: ICategory) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
            <Typography.Link onClick={() => save(record.category_id)} style={{marginInlineEnd: 8}}>
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
                ) : (
                    <Space>
                        <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                            Edit
                        </Typography.Link>
                        <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.category_id)}>
                            <a>Delete</a>
                        </Popconfirm>
                    </Space>
                );
            },
        },
    ];

    const mergedColumns: TableProps<ICategory>['columns'] = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: ICategory) => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <Form form={form} component={false}>
            <Table<ICategory>
                components={{
                    body: { cell: EditableCell },
                }}
                bordered
                dataSource={data}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={false}
                scroll={{ y: 55 * 5 }}
            />
        </Form>
    );
};

export default DataTable;