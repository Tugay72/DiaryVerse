import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Result, Button } from 'antd';

export default function NotFound() {

    const navigate = useNavigate();

    return(
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>


            <Result
                style={{marginTop: "12rem"}}
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
            />
            <Button type = 'primary' onClick = {() => navigate('/')}>
                Go Back!
            </Button>
        </div>
        
    )
}