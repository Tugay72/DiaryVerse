import './sign_up.css'

import { Button, Form, Input } from 'antd';

export default function SignUp({ onFinish, onFinishFailed }) {
    return (
        
        <div className="sign-up-container">
            <h2>Sign Up</h2>
            <Form
                name="basic"
                wrapperCol={{ span: 24 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your name!',
                        },
                    ]}
                >
                    <Input placeholder="Name" />
                </Form.Item>

                <Form.Item
                    name="email"
                    rules={[
                        {
                            required: true,
                            type: 'email',
                            message: 'Please input a valid e-mail!',
                        },
                    ]}
                >
                    <Input placeholder="E-mail" />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password placeholder="Password" />
                </Form.Item>

                <Form.Item
                    name="confirm_password"
                    dependencies={['password']}
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error('Confirm your password!')
                                );
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder="Confirm Password" />
                </Form.Item>

                <Form.Item 
                wrapperCol={{ 
                    offset: 8, 
                    span: 16 
                    }}>
                    <Button htmlType="submit" style={{width: '80', height: '36'}}>
                        Sign Up
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
