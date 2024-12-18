import "./login_page.css"
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Button, message } from 'antd';

import SignIn from "./sign_in";
import SignUp from "./sign_up";

import { UserContext } from '../../context/userContext';
import formImage from '../../assets/login_image.png'


export default function LoginPage () {
    const [messageApi, contextHolder] = message.useMessage();
    const {userData, setUserData} = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (userData){
            navigate('/new_diary')
        }
    })

    const error = (message) => {
        messageApi.open({
            type: 'error',
            content: message ? message : 'Error!',
        });
    };

    //Correct information entered
    const onFinish = (values) => {
        check_user(values);
    };
    
    const check_user = async (values) => {
        const queryParams = new URLSearchParams({
            email: values.email,
            password: values.password,
        });
      
        console.log("Entered: ", values.email, values.password);
        try {
            const response = await fetch(`http://localhost:5000/confirm-user?${queryParams}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
      
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData.error);
                error('Incorrect Email or Password!');
                return;
            }
            
            const responseData = await response.json();
            if (responseData.success === true){
                console.log('Success:', responseData);
                setUserData(responseData.user);
                navigate('/new_diary');
            }
            else{
                error('Incorrect Password!');
                console.error('Error: Incorrect Password');
                return;
            }
            
        } catch (error) {
            error('Incorrect Email or Password!');
            console.error('Error:', error);
        }
    };

    // False information entered
    const onFinishFailed = (errorInfo) => {
        error();
        console.log('Failed:', errorInfo);
    };

    const onSignUpFinish = (values) => {
        console.log('Sign-Up Success:', values);
        save_new_user(values)
    };

    const save_new_user = async (values) => {
        const userData = {
          name: values.name,
          email: values.email,
          password: values.password,
        };
      
        try {
            const response = await fetch('http://localhost:5000/save-user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
      
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData.error);
                return;
            }
      
            const responseData = await response.json();
            console.log('User saved successfully:', responseData);
            message.success('Account created successfully!');
        } catch (error) {
          console.error('Error:', error);
        }
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
        </div>
    );
}