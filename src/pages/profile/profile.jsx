import React, {useState, useEffect, useContext} from "react";
import './profile.css';

import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Modal, Space } from 'antd';

import Navbar from '../../components/navbar/navbar';
import { UserContext } from "../../context/userContext";

export default function ProfilePage(){
    const {userData, setUserData} = useContext(UserContext);


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