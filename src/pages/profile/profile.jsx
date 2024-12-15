import React, { useState, useEffect, useContext } from "react";
import './profile.css';

import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Modal, Space, message, Form, Input } from 'antd';

import Navbar from '../../components/navbar/navbar';
import { UserContext } from "../../context/userContext";

import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const { userData, setUserData } = useContext(UserContext);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [form] = Form.useForm();

    const error_message = () => {
        messageApi.open({
            type: 'error',
            content: 'Error! Please check your input.',
        });
    };

    const success_message = () => {
        messageApi.open({
            type: 'success',
            content: 'Password successfully updated!',
        });
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields(); // Reset form fields on cancel
    };

    const handleOk = () => {
        if (newPassword === confirmPassword) {
            changePassword();
            setIsModalVisible(false);
            success_message();
        } else {
            error_message(); // Show error message if passwords don't match
            console.error('Passwords do not match');
        }
    };
    
    const showDeleteConfirm = () => {
        Modal.confirm({
            title: 'Delete Account!',
            icon: <ExclamationCircleFilled />,
            content: 'You are going to delete your account. Are you sure?',
            okText: 'Yes, Delete!',
            okType: 'danger',
            cancelText: 'No, Cancel!',
            onOk() {
                console.log('OK');
                // Apply logic to delete user's account
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    const get_user = async () => {
        const queryParams = new URLSearchParams({
            email: userData.email,
        });

        try {
            const response = await fetch(`http://localhost:5000/get-user?${queryParams}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData.error);
                return;
            }

            const responseData = await response.json();
            console.log('Success:', responseData);
            setUserData(responseData);

        } catch (error) {
            console.error('Error:', error);
        }
    };

    const changePassword = async () => {
        const requestBody = {
            email: userData.email,
            newPassword: newPassword,
        };

        try {
            const response = await fetch('http://localhost:5000/change-password', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData);
                error_message(); // Show error message for API failure
                return;
            }

            const responseData = await response.json();
            console.log('Password successfully updated!', responseData);
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error('Error:', error);
            error_message(); // Show error message if the network request fails
        }
    };

    useEffect(() => {
        get_user();
    }, []);

    return (
        <div className="profile-main">
            <Navbar />
            {contextHolder}
            <div className="profile-container">
                <span>
                    <h2 className="profile-header">Profile</h2>
                    <hr />
                </span>

                <div className="user-information">
                    <p><b>🧙 Name:</b> {userData && userData.name ? userData.name : 'Guest'}</p>
                    <p><b>📧 E-mail:</b> {userData && userData.email ? userData.email : 'guest@welcome.com'}</p>
                    <p><b>📖 Total Diaries:</b> {userData && userData.total_diaries ? userData.total_diaries : '0'}</p>
                    <p><b>🔥 Current Streak:</b> {userData && userData.currentStreak ? userData.currentStreak : '0'}</p>
                </div>

                <span style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                }}>
                    <button onClick={showModal}>Change Password</button>
                    <button
                        style={{
                            backgroundColor: 'rgb(255, 75, 75)'
                        }}
                        onClick={showDeleteConfirm}
                    >Delete Account</button>
                </span>
            </div>

            <Modal
                title="Change Password"
                open={isModalVisible}
                onCancel={handleCancel}
                onOk={handleOk}
                okText="Save"
                cancelText="Cancel"
                icon={<ExclamationCircleFilled />}
            >
                <Form
                    layout="vertical"
                    form={form} // Bind form to the modal
                >
                    <Form.Item
                        label="New Password"
                        name="newPassword"
                        rules={[
                            { required: true, message: 'Please enter your new password!' },
                            { min: 6, message: 'Password must be at least 6 characters' },
                        ]}
                    >
                        <Input.Password
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Confirm Password"
                        name="confirmPassword"
                        rules={[
                            { required: true, message: 'Please confirm your new password!' },
                            { min: 6, message: 'Password must be at least 6 characters' },
                        ]}
                    >
                        <Input.Password
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
