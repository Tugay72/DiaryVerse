import React from "react";
import "./login_page.css"
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { Button, Checkbox, Form, Input, message } from 'antd';

import SignIn from "./sign_in";
import SignUp from "./sign_up";

import formImage from '../../assets/login_image.png'

const loginDetails = [{
    email : "someone@example.com",
    password : "admin135"
}];



export default function LoginPage () {
    const [messageApi, contextHolder] = message.useMessage();

    const navigate = useNavigate();

    //Correct information entered
    const onFinish = (values) => {
        console.log('Success:', values);
        
        //Login deatils check
        if (values.user.email === loginDetails[0].email && values.password === loginDetails[0].password){
            console.log("Login Successful!")
            navigate('/homepage');
    
            //......
        }
        else{
            error();
            console.log("Check your information again!");
        }
    
      };

    const error = () => {
        messageApi.open({
            type: 'error',
            content: 'Error!',
        });
    };


      // False information entered
    const onFinishFailed = (errorInfo) => {
        error();
        console.log('Failed:', errorInfo);
    };

    const onSignUpFinish = (values) => {
        console.log('Sign-Up Success:', values);
        message.success('Account created successfully!');
        // Add logic to save new user details, e.g., API call or updating local state.
    };
    
    
    const signUpFailed = (errorInfo) => {
        error();
        console.log('Failed:', errorInfo);
    }

    const [selectedContent, setSelectedContent] = useState(<SignIn onFinish={onFinish} onFinishFailed={onFinishFailed} />);
    const handleSelect = (selection) => {
        if (selection === 'SignUp') {
            setSelectedContent(
                <SignUp
                    onFinish={onSignUpFinish}
                    onFinishFailed={signUpFailed}
                />
            );
        } else {
            setSelectedContent(
                <SignIn
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                />
            );
        }
    };


    return (
        <div className="login-main">
            {contextHolder}
            <div className="login-container">
                <div className="login-container-image">
                    <img src={formImage} alt="" width={500} height={350}/>
                </div>
                
                <div className="login-container-form">
                    <div className="login-container-form-section">
                        <section id="buttons">
                            <menu>
                                <Button id="menu-button" onClick={() => handleSelect("SignIn")}>Sign In</Button>
                                <Button id="menu-button" onClick={() => handleSelect("SignUp")}>Sign Up</Button>
                            </menu>
                        </section>
                    </div>
                    <div className="selected-content">
                        {selectedContent}
                    </div>
                </div>
            </div>
            {/* <span id="form-container">
                <Form
                    name="basic"
                    wrapperCol={{span: 24}}

                    initialValues={{remember: true}}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off">

                    <Form.Item
                        name={['user', 'email']}
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
                        name="remember"
                        valuePropName="checked"
                        wrapperCol={{
                            offset: 0,
                            span: 16,
                        }}>
                    
                    <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                    </Form.Item>
                </Form>
            </span> */}
        </div>
    );
}