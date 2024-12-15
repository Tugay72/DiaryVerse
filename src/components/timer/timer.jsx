import './timer.css';
import React, { useState } from 'react';
import { useTimer } from 'react-timer-hook';
import { Modal, Button, Input, Form } from 'antd';

function MyTimer({ expiryTimestamp, setIsModalVisible, onCustomTimeSet }) {
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
        expiryTimestamp,
        onExpire: () => console.warn('onExpire called'),
    });

    // Function to format the time with leading zeros
    const formatTime = (time) => (time < 10 ? `0${time}` : time);

    // If custom time is set, we need to restart the timer
    React.useEffect(() => {
        if (expiryTimestamp) {
            restart(expiryTimestamp); // Restart timer when custom time is updated
        }
    }, [expiryTimestamp, restart]);

    return (
        <div className="timer">
            ⏲
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
    const [customTime, setCustomTime] = useState(null); // Initially no custom time set
    const [form] = Form.useForm();

    // Handling form submission to set custom timer
    const handleCustomTime = (values) => {
        const { days, hours, minutes, seconds } = values;

        // Calculate total seconds from user input
        const totalSeconds = (days * 86400) + (hours * 3600) + (minutes * 60) + seconds;
        const time = new Date();
        time.setSeconds(time.getSeconds() + totalSeconds); // Set the new expiry time

        setCustomTime(time); // Update custom time
        setIsModalVisible(false); // Close modal after setting time
    };

    return (
        <div>
            <MyTimer
                expiryTimestamp={customTime}
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
                    form={form}
                    onFinish={handleCustomTime}
                    initialValues={{ days: 0, hours: 0, minutes: 0, seconds: 0 }}
                >
                    <Form.Item
                        label="Days"
                        name="days"
                        rules={[{ required: true, message: 'Please input days!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        label="Hours"
                        name="hours"
                        rules={[{ required: true, message: 'Please input hours!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        label="Minutes"
                        name="minutes"
                        rules={[{ required: true, message: 'Please input minutes!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        label="Seconds"
                        name="seconds"
                        rules={[{ required: true, message: 'Please input seconds!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item>
                        <button htmlType="submit">
                            Set Timer
                        </button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
