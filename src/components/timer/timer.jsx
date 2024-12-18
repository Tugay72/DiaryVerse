import './timer.css';
import React, { useState, useEffect } from 'react';
import { useTimer } from 'react-timer-hook';
import { Modal, Input, Form, message } from 'antd';

function MyTimer({ expiryTimestamp, setIsModalVisible, onCustomTimeSet }) {
    const [messageApi, contextHolder] = message.useMessage();
    const {
        totalSeconds,
        seconds,
        minutes,
        hours,
        days,
        isRunning,
        start,
        pause,
        resume,
        restart,
    } = useTimer({
        expiryTimestamp: expiryTimestamp || new Date(),
        onExpire: () => {
            console.warn('onExpire called');
            timer_message();
        },
    });

    // Function to display a warning message when the timer ends
    const timer_message = () => {
        messageApi.open({
            type: 'warning',
            content: 'Times Up!',
        });
    };

    // Function to format the time with leading zeros
    const formatTime = (time) => (time < 10 ? `0${time}` : time);

    // If custom time is set, we need to restart the timer
    useEffect(() => {
        if (expiryTimestamp) {
            restart(expiryTimestamp); // Restart timer when custom time is updated
        }
    }, [expiryTimestamp, restart]);

    return (
        <div className="timer">
            ⏲
            {contextHolder}
            <div>
                <span>{formatTime(days)}</span>:
                <span>{formatTime(hours)}</span>:
                <span>{formatTime(minutes)}</span>:
                <span>{formatTime(seconds)}</span>
            </div>
            <p>{isRunning ? 'Running' : 'Not running'}</p>
            <button onClick={start}>Start</button>
            <button onClick={pause}>Pause</button>
            <button onClick={resume}>Resume</button>
            <button
                onClick={() => {
                    setIsModalVisible(true); // Show modal for custom time
                }}
            >
                Restart
            </button>
        </div>
    );
}

export default function Timer() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [customTime, setCustomTime] = useState(null);
    const [form] = Form.useForm();

    // Handling form submission to set custom timer
    const handleCustomTime = (values) => {
        const { days, hours, minutes, seconds } = values;

        // Calculate total seconds from user input
        const totalSeconds = (days * 86400) + (parseInt(hours) * 3600) + (parseInt(minutes) * 60) + parseInt(seconds);
        const time = new Date();
        
        time.setSeconds(time.getSeconds() + totalSeconds);
        console.log(totalSeconds)

        setCustomTime(time);
        setIsModalVisible(false);
    };

    return (
        <div>
            <MyTimer
                expiryTimestamp={customTime} // Pass the custom time here
                setIsModalVisible={setIsModalVisible}
                onCustomTimeSet={setCustomTime}
            />
            <Modal
                title="Set Custom Timer"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form
                    layout="horizontal"
                    form={form}
                    onFinish={handleCustomTime}
                    initialValues={{ days: 0, hours: 0, minutes: 0, seconds: 0 }}
                    labelCol={{ span: 8 }} // Align labels consistently
                    wrapperCol={{ span: 16 }} // Align inputs
                >
                    <Form.Item
                        label="Days"
                        name="days"
                        rules={[{ required: true, message: 'Please input days!' }]}>
                        <Input type="number" className="timer-input" />
                    </Form.Item>

                    <Form.Item
                        label="Hours"
                        name="hours"
                        rules={[{ required: true, message: 'Please input hours!' }]}>
                        <Input type="number" className="timer-input" />
                    </Form.Item>

                    <Form.Item
                        label="Minutes"
                        name="minutes"
                        rules={[{ required: true, message: 'Please input minutes!' }]}>
                        <Input type="number" className="timer-input" />
                    </Form.Item>

                    <Form.Item
                        label="Seconds"
                        name="seconds"
                        rules={[{ required: true, message: 'Please input seconds!' }]}>
                        <Input type="number" className="timer-input" />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <button htmlType="submit" className="timer-button">
                            Set Timer
                        </button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
