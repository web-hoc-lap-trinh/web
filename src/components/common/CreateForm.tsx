import {Form, Modal} from "antd";
import React, {useState} from "react";

interface Values {
    title?: string;
    description?: string;
    modifier?: string;
}

interface CreateFormProps {
    open: boolean;
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}

const CreateForm = ({open, title, onClose, children}: CreateFormProps) => {
    const [form] = Form.useForm();
    const [formValues, setFormValues] = useState<Values>();

    const onCreate = (values: Values) => {
        console.log('Received values of form: ', values);
        setFormValues(values);
        onClose();
    };

    return (
        <Modal
            open={open}
            title={title}
            okText="Create"
            cancelText="Cancel"
            okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
            onCancel={onClose}
            destroyOnHidden
            modalRender={(dom) => (
                <Form
                    layout="vertical"
                    form={form}
                    name="form_in_modal"
                    initialValues={{ modifier: 'public' }}
                    clearOnDestroy
                    onFinish={(values) => onCreate(values)}
                >
                    {dom}
                </Form>
            )}
        >
            {children}
        </Modal>
    )
}

export default CreateForm;