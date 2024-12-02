import './sign_in.css'

import { Button, Checkbox, Form, Input, message } from 'antd';

export default function SignIn({onFinish, onFinishFailed}){
    return(

        <div className='sign-in-container'>
            <h2>Sign In</h2>
            <Form
                name="basic"
                wrapperCol={{span: 24}}
                initialValues={{remember: true}}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off">

                <Form.Item
                    name="email"
                    rules={[
                        {
                        required: true,
                        type: 'email',
                        message: 'Please input your e-mail!'
                        },
                    ]}
                    >
                
                    <Input placeholder="E-mail"/>
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}>
                    <Input.Password placeholder="Password"/>
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}>
                    <Button htmlType="submit">
                        Sign In
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}