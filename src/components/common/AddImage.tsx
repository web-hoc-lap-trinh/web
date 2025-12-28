import { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const AddImage = () => {
    const [, setPreviewImage] = useState('');
    const [uploadStatus, setUploadStatus] = useState(false);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
    };

    const handleRemove = () => setUploadStatus(false);

    // const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    //     setFileList(newFileList);

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );
    return (
        <>
            <Upload
                listType="picture-circle"
                onChange={() => setUploadStatus(true)}
                onPreview={handlePreview}
                onRemove={handleRemove}
            >
                {uploadStatus ? null : uploadButton}
            </Upload>
            {/*{previewImage && (
                <Image
                    src={previewImage}
                />
            )}*/}
        </>
    );
};

export default AddImage;