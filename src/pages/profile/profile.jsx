import React, {useState, useEffect, useContext} from "react";
import './profile.css';

import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Modal, Space } from 'antd';

import Navbar from '../../components/navbar/navbar';
import { UserContext } from "../../context/userContext";

import { useNavigate } from "react-router-dom";

export default function ProfilePage(){
    const navigate = useNavigate();
    const {userData, setUserData} = useContext(UserContext);


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
    }

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
                // Apply logic to delete users account!
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    const changePassword = () => {
        //Apply logic to change users password
    }
    
    useEffect(() => {
        get_user();
    }, [])

    return(
        <div className="profile-main">
            <Navbar />
            <div className="profile-container">
                <span>
                    <h2 className="profile-header">Profile</h2>
                    <hr />
                </span>
                
                
                <div className="user-information">
                    <p><b>🧙 Name:</b> {userData && userData.name ? userData.name : 'Guest'}</p>
                    <p><b>📧 E-mail:</b> {userData && userData.email ? userData.email : 'guest@welcome.com'}</p>
                    <p><b>📖 Total Diaries:</b> {userData && userData.totalDiaries ? userData.totalDiaries : '0'}</p>
                    <p><b>🔥 CurrentStreak:</b> {userData && userData.currentStreak ? userData.currentStreak : '0'}</p>
                </div>

                <span style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                }}>
                    <button onClick={changePassword}>Change Password</button>
                    <button 
                        style={{
                            backgroundColor: 'rgb(255, 75, 75)'
                        }}
                        onClick={showDeleteConfirm}
                    >Delete Account</button>
                </span>
            </div>

        </div>
    )
}