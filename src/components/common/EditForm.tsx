import {Form, Modal} from "antd";
import React from "react";

interface EditFormProps<T extends object, K extends keyof T> {
    open: boolean;
    title: string;
    recordKey: K;
    onSave: (value: T, key: T[K]) => void;
    onClose: () => void;
    initialData: T | undefined;
    children: React.ReactNode;
}

const EditForm = <T extends object, K extends keyof T>(
    {open, title, recordKey, onClose, onSave, initialData, children}: EditFormProps<T, K>
) => {
    const [form] = Form.useForm();

    const handleSave = (value: T) => {
        if (initialData) {
            const recordId = initialData[recordKey];
            console.log(recordKey)
            onSave(value, recordId);
            console.log("Save", recordId);
        }
        onClose();
    };

    return (
        <Modal
            open={open}
            title={title}
            okText="Lưu"
            cancelText="Hủy"
            okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
            onCancel={onClose}
            destroyOnHidden
            modalRender={(dom) => (
                <Form
                    layout="horizontal"
                    form={form}
                    name="CreateForm"
                    initialValues={initialData}
                    clearOnDestroy
                    onFinish={(values: T) => handleSave(values)}
                >
                    {dom}
                </Form>
            )}
        >
            {children}
        </Modal>
    )
}

export default EditForm;