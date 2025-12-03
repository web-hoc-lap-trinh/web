import {useMemo} from 'react';
import {Form, Popconfirm, Table, Typography, Space} from 'antd';
import type {TableColumnType} from "antd";

interface DataTableProps<T extends object, K extends keyof T> {
    columnConfig: TableColumnType[];
    recordKey: K;
    tableData: T[];
    onEdit: (record: T) => void;
    onDelete: (recordKey: T[K]) => void;
}

const DataTable = <T extends object, K extends keyof T>(
    {columnConfig, recordKey, tableData, onEdit, onDelete}: DataTableProps<T, K>
) => {
    const [form] = Form.useForm();

    const columnOperation: TableColumnType<T> = useMemo(() => ({
        title: 'Hành động',
        dataIndex: 'operation',
        render: (_: unknown, record: T) => {
            return (
                <Space>
                    <Typography.Link onClick={() => onEdit(record)}>
                        Edit
                    </Typography.Link>
                    <Popconfirm
                        title="Sure to delete?"
                        onConfirm={() => onDelete(record[recordKey])}
                    >
                        <a>Delete</a>
                    </Popconfirm>
                </Space>
            );
        },
    }), [recordKey, onEdit, onDelete]);

    const allColumns = [...columnConfig, columnOperation];

    return (
        <Form form={form} component={false}>
            <Table<T>
                bordered
                dataSource={tableData}
                columns={allColumns}
                pagination={false}
                scroll={{ y: 55 * 5 }}
            />
        </Form>
    );
};

export default DataTable;