import { useEffect } from "react";
import { Typography, Button, Form, Input, Upload, message, Avatar } from "antd";
import { UserOutlined, LockOutlined, CameraOutlined, MailOutlined, EditOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { 
    useGetProfileQuery, 
    useUpdateProfileMutation, 
    useChangePasswordMutation
} from "../../../../../services/profile/profile.service";
import type { UpdateProfilePayload, ChangePasswordPayload } from "../../../../../services/profile/profile.types";

const ProfileTab = () => {
    const [form] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const { data: profile, isLoading: profileLoading, isFetching } = useGetProfileQuery();
    
    const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();
    const [changePassword, { isLoading: changingPw }] = useChangePasswordMutation();

    useEffect(() => {
        if (profile) {
            form.setFieldsValue({
                fullname: profile.full_name,
                email: profile.email,
            });
        }
    }, [profile, form]);

    const onFinishProfile = async (values: any) => {
        const payload: UpdateProfilePayload = {
            full_name: values.fullname,
        };

        try {
            await updateProfile(payload).unwrap();
            message.success("Đã lưu thông tin hồ sơ!");
            window.dispatchEvent(new Event("userUpdated"));
        } catch (err) {
            console.error(err);
            message.error("Cập nhật hồ sơ thất bại. Vui lòng thử lại.");
        }
    };

    const onFinishPassword = async (values: any) => {
        const payload: ChangePasswordPayload = {
            oldPassword: values.currentPassword, 
            newPassword: values.newPassword,
        };

        try {
            await changePassword(payload).unwrap();
            message.success("Đổi mật khẩu thành công!");
            passwordForm.resetFields();
        } catch (err: any) {
            console.error(err);
            const errorMsg = err?.data?.message || "Đổi mật khẩu thất bại. Kiểm tra lại mật khẩu cũ.";
            message.error(errorMsg);
        }
    };

    const uploadProps: UploadProps = {
        beforeUpload: (file) => {
            const isValidType = file.type === "image/jpeg" || file.type === "image/png";
            if (!isValidType) message.error("Chỉ chấp nhận file JPG/PNG!");
            
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) message.error("Ảnh phải nhỏ hơn 2MB!");

            return (isValidType && isLt2M) || Upload.LIST_IGNORE;
        },
        customRequest: async ({ file, onSuccess, onError }) => {
            try {
                const payload: UpdateProfilePayload = { 
                    avatar_file: file as File 
                };
                
                await updateProfile(payload).unwrap();
                
                onSuccess && onSuccess("ok");
                message.success("Cập nhật ảnh đại diện thành công!");
                // Notify SideBar to re-render
                window.dispatchEvent(new Event("userUpdated"));
            } catch (err) {
                onError && onError(err as any);
                message.error("Cập nhật ảnh thất bại.");
            }
        },
        showUploadList: false,
    };

    const isBusy = profileLoading || isFetching || updating;

    return (
        <div className="space-y-8 animate-fade-in">
            <section className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                    <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                        <UserOutlined style={{ fontSize: '20px' }} />
                    </div>
                    <div>
                        <Typography.Title level={4} className="!text-white !m-0">Thông tin cá nhân</Typography.Title>
                        <p className="text-gray-500 text-sm">Quản lý thông tin hiển thị công khai của bạn</p>
                    </div>
                </div>

                <div className="flex flex-col xl:flex-row gap-10">
                    <div className="flex flex-col items-center gap-4 min-w-[200px]">
                        <div className="relative group cursor-pointer">
                            <Avatar 
                                size={140} 
                                src={profile?.avatar_url || ""} 
                                className="border-4 border-white/5" 
                                icon={!profile?.avatar_url && <UserOutlined />}
                            />
                            
                            <Upload {...uploadProps} disabled={isBusy}>
                                <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <CameraOutlined className="text-white text-3xl mb-1" />
                                    <span className="text-white text-xs font-medium">Thay đổi</span>
                                </div>
                            </Upload>
                        </div>
                        <p className="text-gray-500 text-xs text-center">
                            Định dạng JPG, PNG.<br/>Tối đa 2MB.
                        </p>
                    </div>

                    <Form
                        form={form}
                        layout="vertical"
                        className="flex-1 w-full"
                        onFinish={onFinishProfile}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Form.Item 
                                label={<span className="text-gray-300 font-medium">Họ và tên</span>} 
                                name="fullname" 
                                rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
                            > 
                                <Input 
                                    size="large" 
                                    prefix={<EditOutlined className="text-gray-500"/>} 
                                    placeholder="Nhập tên hiển thị" 
                                    disabled={isBusy} 
                                />
                            </Form.Item>
                            <Form.Item label={<span className="text-gray-300 font-medium">Email</span>} name="email">
                                <Input 
                                    size="large" 
                                    prefix={<MailOutlined className="text-gray-500"/>} 
                                    disabled={true} 
                                    className="!text-gray-400" 
                                    suffix={<span className="text-xs text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">Đã xác thực</span>} 
                                />
                            </Form.Item>
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                loading={updating} 
                                disabled={isBusy}
                                size="large" 
                                className="bg-emerald-500 hover:!bg-emerald-400 border-0 shadow-lg shadow-emerald-500/20 px-8"
                            >
                                Lưu thay đổi
                            </Button>
                        </div>
                    </Form>
                </div>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                    <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                        <LockOutlined style={{ fontSize: '20px' }} />
                    </div>
                    <div>
                        <Typography.Title level={4} className="!text-white !m-0">Đổi mật khẩu</Typography.Title>
                        <p className="text-gray-500 text-sm">Cập nhật mật khẩu định kỳ để bảo vệ tài khoản</p>
                    </div>
                </div>

                <Form form={passwordForm} layout="vertical" onFinish={onFinishPassword}>
                    <Form.Item
                        label={<span className="text-gray-300">Mật khẩu hiện tại</span>}
                        name="currentPassword"
                        rules={[{ required: true, message: "Nhập mật khẩu cũ" }]}
                    >
                        <Input.Password size="large" placeholder="••••••••" disabled={changingPw} />
                    </Form.Item>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Form.Item
                            label={<span className="text-gray-300">Mật khẩu mới</span>}
                            name="newPassword"
                            rules={[{ required: true, min: 6, message: "Tối thiểu 6 ký tự" }]}
                        >
                            <Input.Password size="large" placeholder="••••••••" disabled={changingPw} />
                        </Form.Item>
                        <Form.Item
                            label={<span className="text-gray-300">Xác nhận mật khẩu</span>}
                            name="confirmPassword"
                            dependencies={["newPassword"]}
                            rules={[
                                { required: true, message: "Vui lòng xác nhận mật khẩu" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("newPassword") === value) return Promise.resolve();
                                        return Promise.reject(new Error("Mật khẩu không khớp!"));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password size="large" placeholder="••••••••" disabled={changingPw} />
                        </Form.Item>
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button 
                            htmlType="submit" 
                            size="large" 
                            loading={changingPw}
                            disabled={changingPw}
                            className="bg-white/10 hover:!bg-white/20 border-white/10 text-white px-8"
                        >
                            Cập nhật mật khẩu
                        </Button>
                    </div>
                </Form>
            </section>
        </div>
    );
};

export default ProfileTab;