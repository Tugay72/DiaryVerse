import './streak_calendar.css';
import React, { useState, useEffect, useContext } from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import moment from 'moment';
import { UserContext } from '../../context/userContext';

const fontSizes = [24, 28, 32, 36, 32, 28, 24]; // Font sizes for each index

export default function StreakContainer({ saveTrigger }) {
    const { userData } = useContext(UserContext);
    const [diaryStatuses, setDiaryStatuses] = useState(Array(7).fill(false)); // Initialize with falses

    // Fetch diary statuses for the past 7 days
    useEffect(() => {
        const fetchDiaries = async () => {
            const today = new Date();
            const statuses = [];

            for (let i = 0; i < fontSizes.length; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() - (3 - i)); // Shift days relative to center index
                const formattedDate = moment(date).format('YYYY-MM-DD');

                try {
                    const response = await fetch(
                        `http://localhost:5000/get-diaries/${userData.user_id}/${formattedDate}`
                    );

                    if (response.ok) {
                        const data = await response.json();
                        statuses.push(data.diary !== null); // True if diary exists
                    } else {
                        statuses.push(false);
                    }
                } catch (error) {
                    console.error(`Error fetching diaries for ${formattedDate}:`, error);
                    statuses.push(false);
                }
            }

            setDiaryStatuses(statuses);
        };

        if (userData?.user_id) {
            fetchDiaries();
        }
        console.log(userData.current_streak)
    }, [userData?.user_id, saveTrigger]);
    
    return (
        <div>
            <h3 style={{ color: 'whitesmoke' }}>🔥 {userData.current_streak}</h3>
            <div className="streak-container">
                {fontSizes.map((size, index) => (
                    <span
                        key={index}
                        className="cell"
                        style={{
                            fontSize: `${size}px`,
                            width: `${size + 2}px`,
                            height: `${size + 2}px`,
                        }}
                    >
                        {diaryStatuses[index] ? <CheckOutlined /> : <CloseOutlined />}
                    </span>
                ))}
            </div>
        </div>
    );
}
